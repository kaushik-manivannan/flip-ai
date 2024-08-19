import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { db } from '@/firebase';
import { collection, addDoc, query, where, getDocs, updateDoc, doc, getDoc } from 'firebase/firestore'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const session_id = searchParams.get('session_id');

  if (!session_id) {
    return NextResponse.json({ error: 'Session ID is required' }, { status: 400 });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);

    // You might want to add additional checks here, like verifying the user's permission to access this session

    return NextResponse.json(session);
  } catch (error: any) {
    console.error('Error retrieving checkout session: ', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature') as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err: any) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    await handleCheckoutSessionCompleted(session);
  }

  return NextResponse.json({ received: true });
}

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  try {
    const q = query(
      collection(db, "checkoutSessions"), 
      where("sessionId", "==", session.id)
    );

    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const checkoutSessionDoc = querySnapshot.docs[0];
      const userId = checkoutSessionDoc.data().userId;

      // Add the subscription to your database
      const subscriptionData = {
        userId: userId,
        status: 'active',
        stripeCustomerId: session.customer as string,
        stripeSubscriptionId: session.subscription as string,
        startDate: new Date(),
        planId: session.metadata?.planId || 'default_plan'
      };

      const subscriptionDoc = await addDoc(collection(db, "subscriptions"), subscriptionData);

      // Update the checkout session status
      await updateDoc(checkoutSessionDoc.ref, { status: 'completed' });
    } else {
      console.error(`No checkout session found for session ID: ${session.id}`);
    }
  } catch (error) {
    console.error(`Error in handleCheckoutSessionCompleted: ${error}`);
  }
}

async function handleInvoicePaid(invoice: Stripe.Invoice) {
  if (invoice.subscription) {
    const q = query(
      collection(db, "subscriptions"), 
      where("stripeSubscriptionId", "==", invoice.subscription)
    );
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const subscriptionDoc = querySnapshot.docs[0];
      await updateDoc(subscriptionDoc.ref, { 
        status: 'active',
        currentPeriodEnd: new Date(invoice.lines.data[0].period.end * 1000)
      });
    } else {
      console.error(`No subscription found for invoice ${invoice.id}`);
    }
  }
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  if (invoice.subscription) {
    const q = query(
      collection(db, "subscriptions"), 
      where("stripeSubscriptionId", "==", invoice.subscription)
    );
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const subscriptionDoc = querySnapshot.docs[0];
      await updateDoc(subscriptionDoc.ref, { 
        status: 'past_due'
      });
    }
  }
}

async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  const userId = subscription.metadata.userId; // Assuming you store userId in metadata
  if (userId) {
    await addDoc(collection(db, "subscriptions"), {
      userId: userId,
      status: subscription.status,
      stripeCustomerId: subscription.customer as string,
      stripeSubscriptionId: subscription.id,
      startDate: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      planId: subscription.items.data[0].price.id,
    });
  }
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const q = query(
    collection(db, "subscriptions"), 
    where("stripeSubscriptionId", "==", subscription.id)
  );
  const querySnapshot = await getDocs(q);
  
  if (!querySnapshot.empty) {
    const subscriptionDoc = querySnapshot.docs[0];
    await updateDoc(subscriptionDoc.ref, {
      status: subscription.status,
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      planId: subscription.items.data[0].price.id,
    });
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const q = query(
    collection(db, "subscriptions"), 
    where("stripeSubscriptionId", "==", subscription.id)
  );
  const querySnapshot = await getDocs(q);
  
  if (!querySnapshot.empty) {
    const subscriptionDoc = querySnapshot.docs[0];
    await updateDoc(subscriptionDoc.ref, {
      status: 'canceled',
      canceledAt: new Date(),
    });
  }
}

async function handleCustomerUpdated(customer: Stripe.Customer) {
  const q = query(
    collection(db, "subscriptions"), 
    where("stripeCustomerId", "==", customer.id)
  );
  const querySnapshot = await getDocs(q);
  
  for (const doc of querySnapshot.docs) {
    await updateDoc(doc.ref, {
      email: customer.email,
      name: customer.name,
    });
  }
}
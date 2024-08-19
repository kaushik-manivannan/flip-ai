import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { auth } from '@clerk/nextjs/server';
import { db } from '@/firebase';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

interface CheckoutSessionBody {
  email: string;
  planId?: string;
}

export async function GET(req: NextRequest) {
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const searchParams = req.nextUrl.searchParams;
  const session_id: any = searchParams.get('session_id');

  try {
    const checkoutSession = await stripe.checkout.sessions.retrieve(session_id);
    return NextResponse.json(checkoutSession);
  } catch (error: any) {
    console.error('Error retrieving checkout session: ', error)
    return NextResponse.json({error: {message: error.message}}, {status: 500})
  }
}

export async function POST(req: NextRequest){
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  // Parse the request body
  const body: CheckoutSessionBody = await req.json();
  const { email, planId } = body;

  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 })
  }
  
  // Check if user already has an active subscription
  const q = query(
    collection(db, "subscriptions"), 
    where("userId", "==", userId), 
    where("status", "==", "active")
  )
  const querySnapshot = await getDocs(q)
  if (!querySnapshot.empty) {
    return NextResponse.json({ error: 'User already has an active subscription' }, { status: 400 })
  }

  const params: any = {
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Pro subscription',
          },
          unit_amount: formatAmountForStripe(10),
          recurring: {
            interval: 'month',
            interval_count: 1
          },
        },
        quantity: 1,
      },
    ],
    success_url: `${req.headers.get('origin')}/result?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${req.headers.get('origin')}/result?session_id={CHECKOUT_SESSION_ID}`,
    client_reference_id: userId,
    customer_email: email, // Add this line to set the customer's email
    metadata: {
      planId: planId || 'default_plan',
    },
  };

  try {
    const checkoutSession: Stripe.Checkout.Session =
      await stripe.checkout.sessions.create(params);

    // Store the checkout session in Firebase
    await addDoc(collection(db, "checkoutSessions"), {
      sessionId: checkoutSession.id,
      userId: userId,
      status: 'pending',
      createdAt: new Date(),
      metadata: {
        planId: planId || 'default_plan', // Use a default value if planId is not provided
      },
    })

    return NextResponse.json(checkoutSession, {
      status: 200,
    });
  } catch (err) {
    if (err instanceof Stripe.errors.StripeError) {
      return NextResponse.json({ error: err.message }, { status: err.statusCode });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

function formatAmountForStripe(amount: number) {
  return Math.round(amount * 100);
}
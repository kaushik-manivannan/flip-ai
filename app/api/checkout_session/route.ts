import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const session_id: any = searchParams.get('session_id');

  try{
    const checkoutSession = await stripe.checkout.sessions.retrieve(session_id);
    return NextResponse.json(checkoutSession);
  } catch (error: any) {
    console.error('Error retrieving checkout session: ', error)
    return NextResponse.json({error: {message: error.message}}, {status: 500})
  }

}

export async function POST(req: NextRequest){
  const params: any = {
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [
      {
        price_data:{
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
  };

  try {
    const checkoutSession: Stripe.Checkout.Session =
      await stripe.checkout.sessions.create(params);

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


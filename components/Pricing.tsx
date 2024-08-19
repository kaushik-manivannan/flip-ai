'use client'

import getStripe from '@/utils/get-stripe'
import { useUser } from '@clerk/nextjs';
import { CheckIcon } from '@heroicons/react/20/solid'
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const includedFeatures = [
  'Unlimited Flashcards',
  'More Features Coming Soon'
];

export default function Pricing() {

  const router = useRouter();
  const { isSignedIn, user } = useUser();
  const [isPremiumUser, setIsPremiumUser] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserStatus = async () => {
      if (!isSignedIn) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch('/api/user-status');
        const data = await response.json();
        setIsPremiumUser(data.isPremiumUser);
      } catch (error) {
        console.error('Error fetching user status:', error);
        setIsPremiumUser(false); // Assume not premium on error
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserStatus();
  }, [isSignedIn]);

  const handleSubmit = async () => {
    if (!isSignedIn) {
      router.push('/sign-in')
      return
    }

    if (isPremiumUser) {
      alert('You already have an active subscription!')
      return
    }

    setIsLoading(true);

    try {
      const checkoutSession = await fetch('api/checkout_session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: user?.primaryEmailAddress?.emailAddress
        })
      });

      const checkoutSessionJson = await checkoutSession.json();
      
      if (!checkoutSession.ok) {
        throw new Error(checkoutSessionJson.error || 'Failed to create checkout session');
      }

      const stripe = await getStripe();
      if (stripe) {
        const { error } = await stripe.redirectToCheckout({
          sessionId: checkoutSessionJson.id
        });

        if (error) {
          console.warn(error.message);
          throw new Error(error.message);
        }
      }
    } catch (error) {
      console.error('Subscription error:', error);
      alert('Failed to start subscription process. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  const isButtonDisabled = isLoading || isPremiumUser === true;
  const buttonText = isLoading ? 'Loading...' : 
                     isPremiumUser ? 'Already Subscribed' : 
                     'Subscribe Now';

  return (
    <div id="pricing">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 mb-32 mb:py-48 lg:mb-56">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-primary sm:text-6xl">Pricing</h2>
          <p className="mt-2 text-lg leading-8 text-gray-600 dark:text-foreground font-light">
            Subscribe now for better features!
          </p>
        </div>
        <div className="mx-auto mt-8 max-w-2xl rounded-3xl ring-1 ring-gray-200 dark:ring-primary lg:mx-0 lg:flex lg:max-w-none">
          <div className="p-8 sm:p-10 lg:flex-auto">
            <h3 className="text-4xl font-bold text-gray-900 text-center sm:text-left dark:text-foreground">Monthly Membership</h3>
            <p className="mt-6 text-base leading-7 text-gray-600 dark:text-foreground font-light">
              Unlock limitless learning with Flip AI&apos;s monthly membership! Enjoy the power to generate unlimited AI-driven flashcards and save them for future reference. Perfect your study sessions and keep your knowledge at your fingertips—anytime, anywhere.
            </p>
            <div className="mt-10 flex items-center gap-x-4">
              <h4 className="flex-none text-lg font-semibold leading-6 text-primary">What&apos;s Included</h4>
              <div className="h-px flex-auto bg-gray-100" />
            </div>
            <ul
              role="list"
              className="mt-8 grid grid-cols-1 gap-4 text-md leading-6 text-gray-600 dark:text-foreground sm:grid-cols-2 sm:gap-6"
            >
              {includedFeatures.map((feature) => (
                <li key={feature} className="flex gap-x-3">
                  <CheckIcon aria-hidden="true" className="h-6 w-5 flex-none text-primary" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
          <div className="-mt-2 p-2 lg:mt-0 lg:w-full lg:max-w-md lg:flex-shrink-0">
            <div className="rounded-2xl bg-gray-50 dark:bg-primary-foreground py-10 text-center ring-1 ring-inset ring-gray-900/5 lg:flex lg:flex-col lg:justify-center lg:py-16 h-full">
              <div className="mx-auto max-w-xs px-8">
                <p className="text-xl font-semibold text-gray-600 dark:text-foreground">Pay monthly</p>
                <p className="mt-6 flex items-baseline justify-center gap-x-2">
                  <span className="text-5xl font-bold text-gray-900 dark:text-foreground">$10</span>
                  <span className="text-sm font-semibold leading-6 tracking-wide text-gray-600 dark:text-foreground">USD</span>
                </p>
                <button
                disabled={isButtonDisabled}
                onClick={handleSubmit}
                className="mt-10 block w-full rounded-lg bg-primary px-3 py-2 text-center text-md font-semibold text-white dark:text-foreground shadow-sm hover:bg-primary-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:hover:bg-primary/[0.6] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Checking Subscription...
                  </span>
                ) : buttonText}
              </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
import { FC } from "react";
import NavBar from "./NavBar";
import getStripe from "@/utils/get-stripe";
import Link from "next/link";

interface HeroProps {
  
}
 
const Hero: FC<HeroProps> = () => {

  return ( 
    <div>
      <header className="absolute inset-x-0 top-0 z-50">
        <NavBar />
      </header>

      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div
          aria-hidden="true"
          className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
        >
        </div>
        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
          <div className="hidden sm:mb-8 sm:flex sm:justify-center">
          </div>
          <div className="text-center">
            <h1 className="text-7xl font-bold tracking-tight text-gray-900 dark:text-primary sm:text-8xl">
              Flip AI
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-foreground font-light">
              Supercharge your learning with Flip AI! Create AI-powered flashcards in seconds and master any topic with ease. Study smarter, not harder.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                href="/create"
                className="rounded-lg bg-primary px-3.5 py-2.5 text-md text-white shadow-sm hover:bg-primary dark:hover:bg-primary/[0.6] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary
                font-semibold"
              >
                Start Learning
              </Link>
              <Link href="#" className="text-md leading-6 text-gray-900 dark:text-foreground">
                Learn more <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
        >
        </div>
      </div>
    </div>
   );
}
 
export default Hero;
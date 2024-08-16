import { FC } from "react";
import NavBar from "./NavBar";
import Link from "next/link";

interface HeroProps {
  
}
 
const Hero: FC<HeroProps> = () => {

  return ( 
    <div>
      <header className="absolute inset-x-0 top-0 z-50">
        <NavBar />
      </header>

      <div className="relative isolate px-6 pt-14 lg:px-8" id="hero">
      <div
          aria-hidden="true"
          className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
        >
          <div
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-primary to-primary-foreground opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          />
      </div>
        <div
          aria-hidden="true"
          className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
        >
        </div>
        <div className="mx-auto max-w-2xl my-32 my:py-48 lg:my-56">
          <div className="hidden sm:mb-8 sm:flex sm:justify-center">
          </div>
          <div className="text-center">
            <h1 className="text-7xl font-bold text-gray-900 dark:text-primary sm:text-8xl">
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
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
        >
          <div
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
            className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tl from-primary-foreground to-primary opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
          />
        </div>
      </div>
    </div>
   );
}
 
export default Hero;
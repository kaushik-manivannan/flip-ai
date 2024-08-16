import Hero from "@/components/Hero";
import Pricing from "@/components/Pricing";
import getStripe from "@/utils/get-stripe";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between dark:bg-background">
      <Hero />
      <Pricing />
    </main>
  );
}
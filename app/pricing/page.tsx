'use client'

import NavBar from "@/components/NavBar";
import Pricing from "@/components/Pricing";
import { useUser } from "@clerk/nextjs";
import { FC, useEffect, useState } from "react";

interface PricingPageProps {
  
}
 
const PricingPage: FC<PricingPageProps> = () => {

  const { isLoaded, isSignedIn, user } = useUser();

  if (!isLoaded || !isSignedIn){
    return <></>
  };

  return (
    <main className="h-screen flex flex-col">
      <NavBar />
      <div className="my-10">
        <Pricing />
      </div>
    </main>
  );
}
 
export default PricingPage;
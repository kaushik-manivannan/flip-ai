import Hero from "@/components/Hero";
import NavBar from "@/components/NavBar";
import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="min-h-screen">
      <NavBar />
      <main className="flex flex-col items-center justify-between mt-3 sm:mt-10">
        <SignUp />
      </main>
    </div>
  );
}
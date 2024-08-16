import NavBar from "@/components/NavBar";
import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="min-h-screen">
      <NavBar showMainNav={false} />
      <main className="flex flex-col items-center justify-between mt-10 lg:mt-24">
        <SignIn />
      </main>
    </div>
  );
}
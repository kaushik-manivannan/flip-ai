import NavBar from "@/components/NavBar";
import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="min-h-screen">
      <NavBar showMainNav={false} />
      <main className="flex flex-col items-center justify-between mt-10">
        <SignUp />
      </main>
    </div>
  );
}
'use client'

import { useUser } from "@clerk/nextjs";
import { collection, doc, getDoc, setDoc } from "firebase/firestore";
import { FC, HTMLAttributes, useEffect, useState } from "react";
import { db } from "@/firebase";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import NavBar from "@/components/NavBar";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface CollectionsPageProps extends HTMLAttributes<HTMLDivElement> {}

const CollectionsPage: FC<CollectionsPageProps> = ({ className, ...props }) => {
  const { isLoaded, isSignedIn, user } = useUser();
  const [flashcards, setFlashcards] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function getFlashcards() {
      if (!user) return;
      setIsLoading(true);
      try {
        const docRef = doc(collection(db, 'users'), user.id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const collections = docSnap.data().flashcards || [];
          setFlashcards(collections);
        } else {
          await setDoc(docRef, { flashcards: [] });
        }
      } catch (error) {
        console.error("Error fetching flashcards:", error);
      } finally {
        setIsLoading(false);
      }
    }
    if (isLoaded && isSignedIn) {
      getFlashcards();
    }
  }, [user, isLoaded, isSignedIn]);

  if (!isLoaded || !isSignedIn) {
    return <></>;
  }

  const handleCardClick = (name: string) => {
    router.push(`/flashcard?id=${name}`);
  };

  const filteredFlashcards = flashcards.filter((flashcard: any) =>
    flashcard.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <NavBar />
      <div className="container mx-auto px-4">
        <h1 className="text-4xl w-full text-center my-8">Your Flashcards Collection</h1>
        <div className="relative mb-6">
          <Input
            type="text"
            placeholder="Search Flashcards..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        </div>
        {isLoading ? (
          <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 auto-rows-max mb-10">
            {[...Array(10)].map((_, index) => (
              <Card key={index} className="h-[200px]">
                <CardContent className="h-full p-0">
                  <Skeleton className="w-full h-full rounded-lg" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredFlashcards.length > 0 ? (
          <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 auto-rows-max mb-10">
            {filteredFlashcards.map((flashcard: any, index: number) => (
              <Card
                key={index}
                onClick={() => handleCardClick(flashcard.name)}
                className="h-[200px] cursor-pointer hover:translate-y-2 transition-transform"
              >
                <CardContent className="h-full p-0">
                  <div
                    className="relative w-full h-full rounded-lg dark:bg-primary"
                    style={{
                      boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2)',
                    }}
                  >
                    <div className="absolute w-full h-full flex justify-center items-center p-4 box-border dark:text-primary-foreground font-bold text-xl">
                      <p>{flashcard.name}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 dark:text-primary text-xl mt-10">
            {searchQuery ? "No flashcards found matching your search." : "You haven't saved any flashcards yet."}
          </p>
        )}
      </div>
    </>
  );
};

export default CollectionsPage;
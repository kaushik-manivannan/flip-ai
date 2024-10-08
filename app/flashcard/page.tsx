'use client'

import { useUser } from "@clerk/nextjs";
import { collection, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
import { useSearchParams } from "next/navigation";
import { FC, useEffect, useState } from "react";
import { db } from "@/firebase";
import NavBar from "@/components/NavBar";
import FlashcardsList from "@/components/FlashcardsList";

interface SavedFlashcardProps {
  
}
 
const SavedFlashcard: FC<SavedFlashcardProps> = () => {

  const { isLoaded, isSignedIn, user } = useUser();
  const [flashcards, setFlashcards] = useState([]);
  const [flipped, setFlipped] = useState<boolean[]>([]);

  const searchParams = useSearchParams();
  const search = searchParams.get('id');

  useEffect(() => {
    async function getFlashcard(){
      if(!search || !user) return
      const colRef = collection(doc(collection(db, 'users'), user.id), search);
      const docs = await getDocs(colRef);
      const flashcards: any = [];

      docs.forEach((doc) => {
        flashcards.push({id: doc.id, ...doc.data()})
      })
      setFlashcards(flashcards);
    }
    getFlashcard();
  }, [user, search])

  const handleCardClick = (id: number) => {
    setFlipped((prev) => {
      const newFlipped = [...prev];
      newFlipped[id] = !newFlipped[id];
      return newFlipped;
    });
  };

  if (!isLoaded || !isSignedIn){
    return <></>
  };

  return (
    <main className="h-screen flex flex-col">
      <NavBar />
      <h1 className="text-4xl w-full text-center my-8">
        { search }
      </h1>
      <div className="flex-grow overflow-auto">
        <FlashcardsList 
          flashcards={flashcards}
          handleCardClick={handleCardClick} 
          flipped={flipped}
          className="p-4 grid gap-10 grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 auto-rows-max 2xl:grid-cols-4"
        />
      </div>
    </main>
  );
}
 
export default SavedFlashcard;
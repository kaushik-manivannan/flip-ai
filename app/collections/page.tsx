'use client'

import { useUser } from "@clerk/nextjs";
import { collection, doc, getDoc, setDoc } from "firebase/firestore";
import { FC, HTMLAttributes, useEffect, useState } from "react";
import { db } from "@/firebase";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import NavBar from "@/components/NavBar";

interface CollectionsPageProps extends HTMLAttributes<HTMLDivElement> {
  
}
 
const CollectionsPage: FC<CollectionsPageProps> = ({ className, ...props }) => {

  const {isLoaded, isSignedIn, user} = useUser();
  const [flashcards, setFlashcards] = useState([]);
  const router = useRouter();

  useEffect(() => {
    async function getFlashcards(){
      if(!user) return
      const docRef = doc(collection(db, 'users'), user.id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()){
        const collections = docSnap.data().flashcards || [];
        setFlashcards(collections);
      } else {
        await setDoc(docRef, {flashcards: []});
      }
    }
    getFlashcards();
  }, [user])

  if (!isLoaded || !isSignedIn){
    return <></>
  }

  const handleCardClick = (name: string) => {
    router.push(`/flashcard?id=${name}`)
  }

  return (
    <>
      <NavBar />
      <div className="p-4 grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 auto-rows-max">
        {flashcards.length > 0 && flashcards.map((flashcard: any, index: number) => (
          <Card key={index} onClick={() => handleCardClick(flashcard.name)} className="h-[200px] cursor-pointer hover:translate-y-2 transition-transform">
            <CardContent className="h-full p-0">
                <div 
                  className="relative w-full h-full rounded-lg dark:bg-primary" 
                  style={{
                    boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2)',
                  }}
                >
                  <div 
                    className="absolute w-full h-full flex justify-center items-center p-4 box-border dark:text-primary-foreground font-bold text-xl" 
                  >
                    <p>{flashcard.name}</p>
                  </div>
                </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
 
export default CollectionsPage;
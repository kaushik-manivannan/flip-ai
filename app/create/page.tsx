'use client'

import { useUser } from "@clerk/nextjs";
import { collection, doc, getDoc, writeBatch } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { FC, useState } from "react";
import { db } from "@/firebase";
import NavBar from "@/components/NavBar";
import TextInputForm from "@/components/TextInputForm";
import FlashcardsList from "@/components/FlashcardsList";
import { Loader2 } from "lucide-react";

interface CreatePageProps {}

const CreatePage: FC<CreatePageProps> = () => {
  const { isLoaded, isSignedIn, user } = useUser();
  const [flashcards, setFlashcards] = useState([]);
  const [flipped, setFlipped] = useState<boolean[]>([]);
  const [text, setText] = useState('');
  const [name, setName] = useState('');
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        body: JSON.stringify({ text }),
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await response.json();
      setFlashcards(data);
      setIsLoading(false);
      setFlipped(new Array(data.length).fill(false));
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
      alert('Failed to generate flashcards. Please try again.');
    }
  };

  const handleCardClick = (id: number) => {
    setFlipped((prev) => {
      const newFlipped = [...prev];
      newFlipped[id] = !newFlipped[id];
      return newFlipped;
    });
  };

  const saveFlashcards = async () => {
    if (!name) {
      alert('Please enter a name.');
      return;
    }

    const batch = writeBatch(db);
    const userDocRef = doc(db, "users", user!.id);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      const collections = userDocSnap.data().flashcards || [];
      if (collections.find((f: any) => f.name === name)) {
        alert("Flashcard collection with the same name already exists!");
        return;
      } else {
        collections.push({ name });
        batch.set(userDocRef, { flashcards: collections }, { merge: true });
      }
    } else {
      batch.set(userDocRef, { flashcards: [{ name }] });
    }

    const colRef = collection(userDocRef, name);
    flashcards.forEach((flashcard) => {
      const cardDocRef = doc(colRef);
      batch.set(cardDocRef, flashcard);
    });

    await batch.commit();
    setOpen(false);
  };

  return (
    <main className="h-screen flex flex-col">
      <NavBar />
      <div className="flex-grow overflow-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 dark:scrollbar-thumb-primary dark:scrollbar-track-primary-foreground">
        {!isLoading && flashcards.length === 0 && (
          <div className="flex flex-col items-center justify-center text-center p-7 h-[75vh]">
            <p className="text-2xl sm:text-4xl font-bold text-gray-600 dark:text-primary leading-9 sm:leading-[3.2rem] mb-5 sm:mb-6">
              Welcome to Flip AI! Ready to turn your ideas into powerful flashcards?
            </p>
            <p className="text-lg sm:3xl text-gray-600 dark:text-foreground leading-9 font-light">
            Enter a topic below and let's start learning!
            </p>
          </div>
        )}
        {isLoading && (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin" />
            <p className="ml-2">Generating {text} Flashcards...</p>
          </div>
        )}
        {!isLoading && (
          <FlashcardsList 
          flashcards={flashcards} 
          handleCardClick={handleCardClick} 
          flipped={flipped}

          className="p-4 grid gap-10 grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 auto-rows-max 2xl:grid-cols-4"
          />
        )}
      </div>
      <TextInputForm 
        setText={setText}
        handleSubmit={handleSubmit}
        className="p-4"
        flashcards={flashcards}
        setName={setName}
        saveFlashcards={saveFlashcards}
        open={open}
        setOpen={setOpen}
      />
    </main>
  );
};

export default CreatePage;
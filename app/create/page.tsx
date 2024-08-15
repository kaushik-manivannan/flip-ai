'use client'

import { useUser } from "@clerk/nextjs";
import { collection, doc, getDoc, writeBatch } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { FC, useState } from "react";
import { db } from "@/firebase";
import NavBar from "@/components/NavBar";
import TextInputForm from "@/components/TextInputForm";
import FlashcardsList from "@/components/FlashcardsList";

interface CreatePageProps {}

const CreatePage: FC<CreatePageProps> = () => {
  const { isLoaded, isSignedIn, user } = useUser();
  const [flashcards, setFlashcards] = useState([]);
  const [flipped, setFlipped] = useState<boolean[]>([]);
  const [text, setText] = useState('');
  const [name, setName] = useState('');
  const [open, setOpen] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        body: JSON.stringify({ text }),
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await response.json();
      setFlashcards(data);
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
      <div className="flex-grow overflow-auto">
        <FlashcardsList 
          flashcards={flashcards} 
          handleCardClick={handleCardClick} 
          flipped={flipped}
          className="p-4 grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 auto-rows-max"
        />
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
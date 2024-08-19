import { auth } from "@clerk/nextjs/server";
import { collection, doc, getDoc, getDocs, increment, query, setDoc, updateDoc, where } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { db } from "@/firebase";

const MAX_FREE_TOPICS = 5;
const openai = new OpenAI();

async function checkSubscriptionStatus(userId: string): Promise<boolean> {
  const q = query(
    collection(db, "subscriptions"), 
    where("userId", "==", userId),
    where("status", "==", "active")
  );
  const querySnapshot = await getDocs(q);
  return !querySnapshot.empty;
}

async function getTopicCount(userId: string): Promise<number> {
  const userRef = doc(db, "users", userId);
  const userDoc = await getDoc(userRef);

  if (!userDoc.exists()) {
    await setDoc(userRef, { topicCount: 0 });
    return 0;
  } else {
    return userDoc.data().topicCount || 0;
  }
}

async function incrementTopicCount(userId: string): Promise<void> {
  const userRef = doc(db, "users", userId);
  await updateDoc(userRef, { topicCount: increment(1) });
}

const systemPrompt = `
  You are a flashcard creator. Your task is to generate concise and effective flashcards based on the given topic or content. Follow the guidelines provided below:
  1. Create clear and concise questions for the front of the flashcard.
  2. Provide accurate and informative answers for the back of the flashcard.
  3. Ensure that each flashcard focuses on a single concept or piece of information.
  4. Use simple language to make the flashcards accessible to a wide range of learners.
  5. Include a variety of question types, such as definitions, examples, comparisons, and applications.
  6. Avoid overly complex or ambiguous phrasing in both questions and answers.
  7. When appropriate, use mnemonics or memory aids to help reinforce the information.
  8. Tailor the difficulty level of the flashcards to the user's specified preferences.
  9. If given a body of text, extract the most important and relevant information for the flashcards.
  10. Aim to create a balanced set of flashcards that covers the topic comprehensively.
  11. Only generate 12 flashcards.

  Remember, the goal is to facilitate effective learning and retention of information through these flashcards.

  Return in the following JSON format:
  {
    "flashcards": [
      {
        "front": str,
        "back": str
      }
    ]
  }
`

export async function POST(req: NextRequest){
  const data = await req.text();
  const { userId } = auth();
  
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const isPremiumUser = await checkSubscriptionStatus(userId);
  const currentTopicCount = await getTopicCount(userId);
  
  if (!isPremiumUser && currentTopicCount >= MAX_FREE_TOPICS) {
    return NextResponse.json({ 
      error: 'Free user topic limit reached',
      isPremiumUser,
      topicCount: currentTopicCount,
      maxAllowed: MAX_FREE_TOPICS
    }, { status: 403 });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: data }
      ],
      response_format: {type: 'json_object'}
    });

    const flashcards = JSON.parse(completion.choices[0].message.content!).flashcards;

    // Only increment the topic count if flashcards were successfully generated
    if (!isPremiumUser) {
      await incrementTopicCount(userId);
    }

    return NextResponse.json({ 
      flashcards,
      isPremiumUser,
      topicCount: isPremiumUser ? null : currentTopicCount + 1,
      maxAllowed: isPremiumUser ? null : MAX_FREE_TOPICS
    });
  } catch (error) {
    console.error('Error generating flashcards:', error);
    return NextResponse.json({ error: 'Failed to generate flashcards' }, { status: 500 });
  }
}
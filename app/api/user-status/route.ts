import { NextRequest, NextResponse } from "next/server";
import { auth } from '@clerk/nextjs/server';
import { db } from '@/firebase';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';

const MAX_FREE_TOPICS = 5;

export async function GET(req: NextRequest) {
  const { userId } = auth();
  
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Check subscription status
    const subscriptionQuery = query(
      collection(db, "subscriptions"), 
      where("userId", "==", userId),
      where("status", "==", "active")
    );
    const subscriptionSnapshot = await getDocs(subscriptionQuery);
    const isPremiumUser = !subscriptionSnapshot.empty;

    // Get topic count
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);
    const topicCount = userDoc.exists() ? (userDoc.data().topicCount || 0) : 0;

    return NextResponse.json({ 
      isPremiumUser,
      topicCount,
      maxAllowed: MAX_FREE_TOPICS
    });
  } catch (error) {
    console.error('Error fetching user status:', error);
    return NextResponse.json({ error: 'Failed to fetch user status' }, { status: 500 });
  }
}
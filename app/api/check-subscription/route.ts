import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server';
import { db } from '@/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore'

export async function GET(req: NextRequest) {
  try {
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized', hasActiveSubscription: false }, { status: 401 })
    }

    const q = query(
      collection(db, "subscriptions"), 
      where("userId", "==", userId), 
      where("status", "==", "active")
    )
    const querySnapshot = await getDocs(q)
    const hasActiveSubscription = !querySnapshot.empty

    return NextResponse.json({ hasActiveSubscription })
  } catch (error) {
    console.error('Error checking subscription:', error)
    return NextResponse.json({ error: 'Internal Server Error', hasActiveSubscription: false }, { status: 500 })
  }
}
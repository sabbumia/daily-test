// app/api/saved-words/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { savedWords } from '@/db/schema';
import { authenticateRequest } from '@/lib/authMiddleware';
import { eq, and, ilike, or } from 'drizzle-orm';

// Get all saved words for user
export async function GET(req: NextRequest) {
  const auth = authenticateRequest(req);
  if (!auth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const searchParams = req.nextUrl.searchParams;
    const search = searchParams.get('search');

    let query = db
      .select()
      .from(savedWords)
      .where(eq(savedWords.userId, auth.userId))
      .$dynamic();

    // Add search filter if provided
    if (search) {
      query = query.where(
        or(
          ilike(savedWords.word, `%${search}%`),
          ilike(savedWords.meaning, `%${search}%`)
        )
      );
    }

    const words = await query.orderBy(savedWords.createdAt);

    return NextResponse.json({ words });
  } catch (error) {
    console.error('Error fetching saved words:', error);
    return NextResponse.json(
      { error: 'Failed to fetch saved words' },
      { status: 500 }
    );
  }
}

// Add new saved word
export async function POST(req: NextRequest) {
  const auth = authenticateRequest(req);
  if (!auth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { word, meaning, notes } = await req.json();

    if (!word || !meaning) {
      return NextResponse.json(
        { error: 'Word and meaning are required' },
        { status: 400 }
      );
    }

    // Check if word already exists for this user
    const existing = await db
      .select()
      .from(savedWords)
      .where(
        and(
          eq(savedWords.userId, auth.userId),
          eq(savedWords.word, word)
        )
      )
      .limit(1);

    if (existing.length > 0) {
      return NextResponse.json(
        { error: 'Word already saved' },
        { status: 400 }
      );
    }

    const [newWord] = await db
      .insert(savedWords)
      .values({
        userId: auth.userId,
        word,
        meaning,
        notes: notes || null,
      })
      .returning();

    return NextResponse.json({ word: newWord });
  } catch (error) {
    console.error('Error saving word:', error);
    return NextResponse.json(
      { error: 'Failed to save word' },
      { status: 500 }
    );
  }
}

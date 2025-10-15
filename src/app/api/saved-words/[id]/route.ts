
// app/api/saved-words/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { savedWords } from '@/db/schema';
import { authenticateRequest } from '@/lib/authMiddleware';
import { eq, and } from 'drizzle-orm';

// Delete saved word
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = authenticateRequest(req);
  if (!auth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const wordId = parseInt(id);

    // Verify the word belongs to the user
    const [word] = await db
      .select()
      .from(savedWords)
      .where(
        and(
          eq(savedWords.id, wordId),
          eq(savedWords.userId, auth.userId)
        )
      )
      .limit(1);

    if (!word) {
      return NextResponse.json(
        { error: 'Word not found' },
        { status: 404 }
      );
    }

    await db
      .delete(savedWords)
      .where(eq(savedWords.id, wordId));

    return NextResponse.json({ message: 'Word deleted successfully' });
  } catch (error) {
    console.error('Error deleting word:', error);
    return NextResponse.json(
      { error: 'Failed to delete word' },
      { status: 500 }
    );
  }
}

// Update saved word
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = authenticateRequest(req);
  if (!auth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }); 
  }

  try {
    const { id } = await params;
    const wordId = parseInt(id);
    const { word, meaning, notes } = await req.json();

    // Verify the word belongs to the user
    const [existingWord] = await db
      .select()
      .from(savedWords)
      .where(
        and(
          eq(savedWords.id, wordId),
          eq(savedWords.userId, auth.userId)
        )
      )
      .limit(1);

    if (!existingWord) {
      return NextResponse.json(
        { error: 'Word not found' },
        { status: 404 }
      );
    }

    const [updatedWord] = await db
      .update(savedWords)
      .set({
        word: word || existingWord.word,
        meaning: meaning || existingWord.meaning,
        notes: notes !== undefined ? notes : existingWord.notes,
      })
      .where(eq(savedWords.id, wordId))
      .returning();

    return NextResponse.json({ word: updatedWord });
  } catch (error) {
    console.error('Error updating word:', error);
    return NextResponse.json(
      { error: 'Failed to update word' },
      { status: 500 }
    );
  }
}
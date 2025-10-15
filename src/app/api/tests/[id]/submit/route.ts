// app/api/tests/[id]/submit/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { dailyTests, userTestAttempts } from '@/db/schema';
import { authenticateRequest } from '@/lib/authMiddleware';
import { eq, and } from 'drizzle-orm';
import { WordTest } from '@/lib/gemini';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = authenticateRequest(req);
  if (!auth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Await params to get the actual values
    const { id } = await params;
    const testId = parseInt(id);
    const { answers } = await req.json();

    // Get the test
    const [test] = await db
      .select()
      .from(dailyTests)
      .where(eq(dailyTests.id, testId))
      .limit(1);

    if (!test) {
      return NextResponse.json({ error: 'Test not found' }, { status: 404 });
    }

    const words: WordTest[] = JSON.parse(test.words);

    // Calculate score
    let score = 0;
    const results = words.map((word, index) => {
      const userAnswer = answers[index];
      const isCorrect = userAnswer === word.correctAnswer;
      if (isCorrect) score++;

      return {
        word: word.word,
        userAnswer,
        correctAnswer: word.correctAnswer,
        isCorrect,
      };
    });

    // Save attempt
    await db.insert(userTestAttempts).values({
      userId: auth.userId,
      testId: testId,
      score: score,
      answers: JSON.stringify(answers),
      completed: true,
    });

    return NextResponse.json({
      score,
      totalQuestions: words.length,
      percentage: (score / words.length) * 100,
      results,
    });
  } catch (error) {
    console.error('Error submitting test:', error);
    return NextResponse.json(
      { error: 'Failed to submit test' },
      { status: 500 }
    );
  }
}
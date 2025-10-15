// app/api/tests/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { dailyTests, userTestAttempts } from '@/db/schema';
import { authenticateRequest } from '@/lib/authMiddleware';
import { eq, and, lt } from 'drizzle-orm';

export async function GET(
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

    // Get the test
    const [test] = await db
      .select()
      .from(dailyTests)
      .where(eq(dailyTests.id, testId))
      .limit(1);

    if (!test) {
      return NextResponse.json({ error: 'Test not found' }, { status: 404 });
    }

    // Check if user has completed all previous tests
    const previousTests = await db
      .select()
      .from(dailyTests)
      .where(lt(dailyTests.testDate, test.testDate));

    for (const prevTest of previousTests) {
      const [attempt] = await db
        .select()
        .from(userTestAttempts)
        .where(
          and(
            eq(userTestAttempts.userId, auth.userId),
            eq(userTestAttempts.testId, prevTest.id),
            eq(userTestAttempts.completed, true)
          )
        )
        .limit(1);

      if (!attempt) {
        return NextResponse.json(
          { 
            error: 'You must complete previous tests first',
            requiredTest: {
              id: prevTest.id,
              date: prevTest.testDate,
            }
          },
          { status: 403 }
        );
      }
    }

    // Check if user already completed this test
    const [existingAttempt] = await db
      .select()
      .from(userTestAttempts)
      .where(
        and(
          eq(userTestAttempts.userId, auth.userId),
          eq(userTestAttempts.testId, testId),
          eq(userTestAttempts.completed, true)
        )
      )
      .limit(1);

    return NextResponse.json({
      test: {
        id: test.id,
        date: test.testDate,
        words: JSON.parse(test.words),
      },
      alreadyCompleted: !!existingAttempt,
      previousScore: existingAttempt?.score,
    });
  } catch (error) {
    console.error('Error fetching test:', error);
    return NextResponse.json(
      { error: 'Failed to fetch test' },
      { status: 500 }
    );
  }
}
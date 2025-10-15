// app/api/tests/available/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { dailyTests, userTestAttempts } from '@/db/schema';
import { authenticateRequest } from '@/lib/authMiddleware';
import { eq, and, lt } from 'drizzle-orm';

export async function GET(req: NextRequest) {
  const auth = authenticateRequest(req);
  if (!auth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Get all tests ordered by date
    const allTests = await db
      .select()
      .from(dailyTests)
      .orderBy(dailyTests.testDate);

    // Get user's completed tests
    const completedTests = await db
      .select()
      .from(userTestAttempts)
      .where(
        and(
          eq(userTestAttempts.userId, auth.userId),
          eq(userTestAttempts.completed, true)
        )
      );

    const completedTestIds = new Set(completedTests.map(t => t.testId));

    // Find first incomplete test
    let nextAvailableTest = null;
    for (const test of allTests) {
      if (!completedTestIds.has(test.id)) {
        nextAvailableTest = test;
        break;
      }
    }

    // Get user's progress
    const userProgress = allTests.map(test => ({
      id: test.id,
      date: test.testDate,
      completed: completedTestIds.has(test.id),
      score: completedTests.find(ct => ct.testId === test.id)?.score || 0,
    }));

    return NextResponse.json({
      nextTest: nextAvailableTest,
      progress: userProgress,
      totalTests: allTests.length,
      completedCount: completedTests.length,
    });
  } catch (error) {
    console.error('Error fetching tests:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tests' },
      { status: 500 }
    );
  }
}

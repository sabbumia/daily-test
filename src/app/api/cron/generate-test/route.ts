// app/api/cron/generate-test/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { dailyTests } from '@/db/schema';
import { generateDailyTest } from '@/lib/gemini';
import { eq } from 'drizzle-orm';

export async function GET(req: NextRequest) {
  // Verify cron secret to prevent unauthorized access
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const today = new Date().toISOString().split('T')[0];

    // Check if test already exists for today
    const existingTest = await db
      .select()
      .from(dailyTests)
      .where(eq(dailyTests.testDate, today))
      .limit(1);

    if (existingTest.length > 0) {
      return NextResponse.json({ 
        message: 'Test already exists for today',
        date: today 
      });
    }

    // Generate new test using Gemini
    const words = await generateDailyTest();

    // Store in database
    await db.insert(dailyTests).values({
      testDate: today,
      words: JSON.stringify(words),
    });

    return NextResponse.json({ 
      message: 'Daily test generated successfully',
      date: today,
      wordCount: words.length
    });
  } catch (error) {
    console.error('Error generating daily test:', error);
    return NextResponse.json(
      { error: 'Failed to generate daily test' },
      { status: 500 }
    );
  }
}

// Manual trigger for testing (remove in production or add authentication)
export async function POST(req: NextRequest) {
  try {
    const today = new Date().toISOString().split('T')[0];
    const words = await generateDailyTest();

    await db.insert(dailyTests).values({
      testDate: today,
      words: JSON.stringify(words),
    });

    return NextResponse.json({ 
      message: 'Test generated',
      words 
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to generate test' },
      { status: 500 }
    );
  }
}
import { NextResponse } from 'next/server';
import { readDB, writeDB } from '@/lib/db';

export async function GET() {
  const db = await readDB();
  return NextResponse.json(db.challenges || []);
}

export async function POST(request: Request) {
  try {
    const data = await request.json(); // { title: string, subject: string, questions: number, points: number }
    const db = await readDB();
    
    if (!db.challenges) {
      db.challenges = [];
    }

    const newChallenge = {
      id: Math.random().toString(36).substr(2, 9),
      ...data,
      status: 'pending'
    };

    db.challenges.push(newChallenge);
    await writeDB(db);
    
    return NextResponse.json({ success: true, challenge: newChallenge });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

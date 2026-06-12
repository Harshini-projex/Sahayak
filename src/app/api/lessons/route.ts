import { NextResponse } from 'next/server';
import { readDB, writeDB } from '@/lib/db';

export async function GET() {
  const db = await readDB();
  return NextResponse.json(db.lessons);
}

export async function POST(request: Request) {
  const data = await request.json(); // { topic: string, content: string }
  const db = await readDB();
  
  const newLesson = {
    id: Math.random().toString(36).substr(2, 9),
    ...data,
    date: new Date().toLocaleDateString()
  };
  
  db.lessons.unshift(newLesson);
  await writeDB(db);
  
  return NextResponse.json(newLesson);
}

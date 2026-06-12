import { NextResponse } from 'next/server';
import { readDB, writeDB } from '@/lib/db';

export async function GET() {
  const db = await readDB();
  return NextResponse.json(db.notes);
}

export async function POST(request: Request) {
  const data = await request.json(); // { fileName: string, description: string }
  const db = await readDB();
  
  const newNote = {
    id: Date.now().toString(),
    ...data,
    date: new Date().toISOString()
  };
  
  db.notes.unshift(newNote);
  await writeDB(db);
  
  return NextResponse.json(newNote);
}

import { NextResponse } from 'next/server';
import { readDB, writeDB } from '@/lib/db';

export async function GET() {
  const db = await readDB();
  return NextResponse.json(db.syncedNotes || []);
}

export async function POST(request: Request) {
  try {
    const data = await request.json(); // { title, subject, grade, fileName }
    const db = await readDB();
    
    if (!db.syncedNotes) db.syncedNotes = [];

    const newNote = {
      id: Date.now().toString(),
      ...data,
      date: new Date().toISOString().split('T')[0]
    };

    db.syncedNotes.unshift(newNote);
    await writeDB(db);
    
    return NextResponse.json({ success: true, note: newNote });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

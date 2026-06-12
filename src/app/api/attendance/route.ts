import { NextResponse } from 'next/server';
import { readDB, writeDB } from '@/lib/db';

export async function GET() {
  const db = await readDB();
  return NextResponse.json(db.attendance);
}

export async function POST(request: Request) {
  const data = await request.json();
  const db = await readDB();
  
  // Update attendance
  // Assuming data is { date: string, students: { id: string, name: string, status: 'present' | 'absent' }[] }
  const existingIndex = db.attendance.findIndex((a: any) => a.date === data.date);
  if (existingIndex > -1) {
    db.attendance[existingIndex] = data;
  } else {
    db.attendance.push(data);
  }
  
  await writeDB(db);
  return NextResponse.json({ success: true, attendance: data });
}

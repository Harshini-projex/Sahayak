import { NextResponse } from 'next/server';
import { readDB, writeDB } from '@/lib/db';

export async function GET() {
  const db = await readDB();
  return NextResponse.json(db.students || []);
}

export async function POST(request: Request) {
  try {
    const data = await request.json(); // { id: string, height?: number, weight?: number, hb?: number, score?: number, points?: number, badges?: string[] }
    const db = await readDB();
    
    if (!db.students) {
      db.students = [];
    }

    const studentIndex = db.students.findIndex((s: any) => s.id === data.id);
    if (studentIndex > -1) {
      const student = db.students[studentIndex];
      
      // Update fields if provided
      if (data.height !== undefined) student.height = Number(data.height);
      if (data.weight !== undefined) student.weight = Number(data.weight);
      if (data.hb !== undefined) {
        student.hb = Number(data.hb);
        // Recalculate status based on hemoglobin levels
        if (student.hb < 8.5) {
          student.status = 'critical';
        } else if (student.hb < 11.0) {
          student.status = 'atRisk';
        } else {
          student.status = 'stable';
        }
      }
      if (data.score !== undefined) student.score = Number(data.score);
      if (data.points !== undefined) student.points = Number(data.points);
      if (data.badges !== undefined) student.badges = data.badges;
      
      db.students[studentIndex] = student;
      await writeDB(db);
      return NextResponse.json({ success: true, student });
    } else {
      return NextResponse.json({ success: false, error: 'Student not found' }, { status: 404 });
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

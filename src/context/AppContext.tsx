'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { translations, Language, TranslationKey } from '@/lib/translations';
import { useRouter } from 'next/navigation';

export type Role = 'teacher' | 'student' | 'parent' | 'admin';

interface User {
  id: string;
  name: string;
  role: Role;
  grade?: number;
}

interface LessonPlan {
  id: string;
  topic: string;
  content: string;
  date: string;
}

export interface StudentRecord {
  id: string;
  name: string;
  roll: string;
  grade: string;
  age: number;
  height: number;
  weight: number;
  hb: number;
  score: number;
  points: number;
  status: 'stable' | 'atRisk' | 'critical';
  badges: string[];
}

export interface Quiz {
  id: string;
  title: string;
  subject: string;
  grade: string;
  points: number;
  totalQuestions: number;
  status: 'pending' | 'completed';
}

export interface SharedNote {
  id: string;
  title: string;
  subject: string;
  grade: string;
  fileType: string;
  downloadUrl: string;
  date: string;
}

export interface AttendanceDayRecord {
  date: string;
  students: { id: string; status: 'present' | 'absent' }[];
}

export interface HealthRecord {
  date: string;
  mealServed: string;
  calories: number;
  quantityStatus: string;
  remarks: string;
}

interface AppContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  role: Role | null;
  setRole: (role: Role | null) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
  isOffline: boolean;
  lessonPlans: LessonPlan[];
  addLessonPlan: (topic: string, content: string) => Promise<void>;
  deleteLessonPlan: (id: string) => Promise<void>;
  logout: () => void;
  // Student records
  students: StudentRecord[];
  fetchStudents: () => Promise<void>;
  updateStudent: (id: string, data: Partial<StudentRecord>) => Promise<any>;
  // Points & badges (Meera's live data)
  points: number;
  badges: string[];
  awardPoints: (amount: number, badge?: string) => Promise<void>;
  downloadedBooks: string[];
  addDownloadedBook: (id: string) => void;
  // Quizzes (Challenges)
  quizzes: Quiz[];
  addQuiz: (quiz: Omit<Quiz, 'id' | 'status'>) => void;
  markQuizDone: (id: string) => void;
  // Shared Notes
  sharedNotes: SharedNote[];
  uploadNotes: (note: Omit<SharedNote, 'id' | 'date'>) => void;
  deleteSharedNote: (id: string) => void;
  // Live attendance for parent portal
  attendanceRecords: AttendanceDayRecord[];
  saveAttendance: (date: string, records: { id: string; status: 'present' | 'absent' }[]) => void;
  fetchAttendance: () => Promise<void>;
  // Live health records for parent portal
  healthRecords: HealthRecord[];
  logMeal: (log: HealthRecord) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<Role | null>('teacher');
  const [language, setLanguage] = useState<Language>('en');
  const [isOffline, setIsOffline] = useState(false);
  const [lessonPlans, setLessonPlans] = useState<LessonPlan[]>([]);
  const [students, setStudents] = useState<StudentRecord[]>([]);
  const [sharedNotes, setSharedNotes] = useState<SharedNote[]>([]);
  const [downloadedBooks, setDownloadedBooks] = useState<string[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceDayRecord[]>([]);
  const [healthRecords, setHealthRecords] = useState<HealthRecord[]>([
    { date: 'Today', mealServed: 'Rice, Dal, Drumstick Sambar', calories: 480, quantityStatus: 'High Protein', remarks: 'Ate well' },
    { date: 'Yesterday', mealServed: 'Rice, Buttermilk', calories: 410, quantityStatus: 'Balanced', remarks: 'Good appetite' }
  ]);
  const router = useRouter();

  // ─── Bootstrap fetches ───────────────────────────────────────────────────
  useEffect(() => {
    fetchStudents();
    fetchLessonPlans();
    fetchAttendance();
  }, []);

  useEffect(() => {
    if (user) setRole(user.role);
  }, [user]);

  // ─── Fetch helpers ────────────────────────────────────────────────────────
  const fetchStudents = useCallback(async () => {
    try {
      const res = await fetch('/api/students');
      if (res.ok) setStudents(await res.json());
    } catch (e) {
      console.error('fetchStudents', e);
    }
  }, []);

  const fetchLessonPlans = useCallback(async () => {
    try {
      const res = await fetch('/api/lessons');
      if (res.ok) setLessonPlans(await res.json());
    } catch (e) {
      console.error('fetchLessonPlans', e);
    }
  }, []);

  const fetchAttendance = useCallback(async () => {
    try {
      const res = await fetch('/api/attendance');
      if (res.ok) setAttendanceRecords(await res.json());
    } catch (e) {
      console.error('fetchAttendance', e);
    }
  }, []);

  // ─── Student helpers ──────────────────────────────────────────────────────
  const updateStudent = async (id: string, data: Partial<StudentRecord>) => {
    try {
      const res = await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...data }),
      });
      if (res.ok) { await fetchStudents(); return await res.json(); }
    } catch (e) { console.error('updateStudent', e); }
  };

  // Meera is student id '2'
  const meeraRecord = students.find(s => s.id === '2');
  const points = meeraRecord?.points ?? 2100;
  const badges = meeraRecord?.badges ?? ['⭐ Gold Star', '📚 Reader Pro', '🥗 Healthy Eater'];

  const awardPoints = async (amount: number, badge?: string) => {
    const student = students.find(s => s.id === '2');
    if (student) {
      const updatedPoints = student.points + amount;
      const updatedBadges = [...student.badges];
      if (badge && !updatedBadges.includes(badge)) updatedBadges.push(badge);
      await updateStudent(student.id, { points: updatedPoints, badges: updatedBadges });
    }
  };

  const addDownloadedBook = (id: string) =>
    setDownloadedBooks(prev => [...prev, id]);

  // ─── Lesson plan helpers ──────────────────────────────────────────────────
  const addLessonPlan = async (topic: string, content: string) => {
    try {
      const res = await fetch('/api/lessons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, content }),
      });
      if (res.ok) await fetchLessonPlans();
    } catch (e) { console.error('addLessonPlan', e); }
  };

  const deleteLessonPlan = async (id: string) =>
    setLessonPlans(prev => prev.filter(p => p.id !== id));

  // ─── Shared notes helpers ─────────────────────────────────────────────────
  const uploadNotes = (note: Omit<SharedNote, 'id' | 'date'>) => {
    const newNote: SharedNote = {
      ...note,
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0]
    };
    setSharedNotes(prev => [newNote, ...prev]);
  };

  const deleteSharedNote = (id: string) =>
    setSharedNotes(prev => prev.filter(n => n.id !== id));

  // ─── Quiz helpers ─────────────────────────────────────────────────────────
  const addQuiz = (quiz: Omit<Quiz, 'id' | 'status'>) => {
    const newQuiz: Quiz = {
      ...quiz,
      id: Date.now().toString(),
      status: 'pending'
    };
    setQuizzes(prev => [...prev, newQuiz]);
  };

  const markQuizDone = (id: string) =>
    setQuizzes(prev =>
      prev.map(q => q.id === id ? { ...q, status: 'completed' } : q)
    );

  // ─── Attendance helpers ───────────────────────────────────────────────────
  const saveAttendance = (date: string, records: { id: string; status: 'present' | 'absent' }[]) => {
    setAttendanceRecords(prev => {
      const existing = prev.findIndex(r => r.date === date);
      if (existing !== -1) {
        const newRecords = [...prev];
        newRecords[existing] = { date, students: records };
        return newRecords;
      }
      return [...prev, { date, students: records }];
    });
  };

  // ─── Meal Log helpers ─────────────────────────────────────────────────────
  const logMeal = (log: HealthRecord) => {
    setHealthRecords(prev => [log, ...prev]);
  };

  // ─── Network status ───────────────────────────────────────────────────────
  useEffect(() => {
    const handler = () => setIsOffline(!navigator.onLine);
    window.addEventListener('online', handler);
    window.addEventListener('offline', handler);
    return () => {
      window.removeEventListener('online', handler);
      window.removeEventListener('offline', handler);
    };
  }, []);

  const t = (key: TranslationKey) => translations[language][key] || key;

  const logout = () => {
    setUser(null);
    setRole(null);
    router.push('/');
  };

  return (
    <AppContext.Provider value={{
      user, setUser,
      role, setRole,
      language, setLanguage,
      t, isOffline,
      lessonPlans, addLessonPlan, deleteLessonPlan,
      logout,
      students, fetchStudents, updateStudent,
      points, badges, awardPoints,
      downloadedBooks, addDownloadedBook,
      sharedNotes, uploadNotes, deleteSharedNote,
      quizzes, addQuiz, markQuizDone,
      attendanceRecords, fetchAttendance, saveAttendance,
      healthRecords, logMeal,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
}

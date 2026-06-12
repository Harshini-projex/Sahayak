'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Save, Loader2 } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import styles from './AttendanceGrid.module.css';



export default function AttendanceGrid() {
  const { t, students, attendanceRecords, saveAttendance } = useApp();
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendance, setAttendance] = useState<Record<string, 'present' | 'absent'>>({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadAttendance();
  }, [date, attendanceRecords]);

  const loadAttendance = () => {
    setLoading(true);
    const record = attendanceRecords.find(r => r.date === date);
    if (record) {
      const attMap: Record<string, 'present' | 'absent'> = {};
      record.students.forEach(s => { attMap[s.id] = s.status; });
      setAttendance(attMap);
    } else {
      const defaultAtt: Record<string, 'present' | 'absent'> = {};
      students.forEach(s => { defaultAtt[s.id] = 'present'; });
      setAttendance(defaultAtt);
    }
    setLoading(false);
  };

  const setStatus = (studentId: string, status: 'present' | 'absent') => {
    setAttendance(prev => ({ ...prev, [studentId]: status }));
  };

  const handleSave = () => {
    setSaving(true);
    const studentsPayload = students.map(s => ({
      id: s.id,
      status: attendance[s.id] || 'present'
    }));
    
    saveAttendance(date, studentsPayload);
    alert(t('saveSuccess'));
    setSaving(false);
  };

  const shiftDate = (days: number) => {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    setDate(d.toISOString().split('T')[0]);
  };

  return (
    <div className={styles.gridContainer}>
      <div className={styles.controls}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button onClick={() => shiftDate(-1)} className={styles.iconBtn}><ChevronLeft size={20} /></button>
          <div className={styles.dateDisplay}>
            <Calendar size={18} color="var(--primary)" />
            <span>{new Date(date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</span>
          </div>
          <button onClick={() => shiftDate(1)} className={styles.iconBtn}><ChevronRight size={20} /></button>
        </div>
      </div>

      <div className={styles.ledger}>
        <div className={styles.ledgerHeader}>
          <span>{t('navStudents')}</span>
          <span className={styles.hideMobile}>Roll Number</span>
          <span style={{ textAlign: 'right' }}>Status Selector</span>
        </div>
        
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center' }}><Loader2 className="spin" /></div>
        ) : (
          students.map(student => (
            <div key={student.id} className={`${styles.ledgerRow} ${attendance[student.id] === 'absent' ? styles.absentRow : ''}`}>
              <div className={styles.studentInfo}>
                <div className={styles.avatar}>{student.name[0]}</div>
                <div className={styles.name}>{student.name}</div>
              </div>
              <span className={`${styles.details} ${styles.hideMobile}`}>{student.roll}</span>
              <div className={styles.toggleGroup}>
                <button 
                  className={`${styles.toggleBtn} ${attendance[student.id] === 'absent' ? styles.absentActive : styles.inactive}`}
                  onClick={() => setStatus(student.id, 'absent')}
                >
                  A
                </button>
                <button 
                  className={`${styles.toggleBtn} ${attendance[student.id] === 'present' ? styles.presentActive : styles.inactive}`}
                  onClick={() => setStatus(student.id, 'present')}
                >
                  P
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className={styles.saveBar}>
         <button className="btn btn-primary" style={{ width: '280px', height: '52px' }} onClick={handleSave} disabled={saving}>
           {saving ? <Loader2 className="spin" size={20} /> : <Save size={20} />}
           {t('saveAttendance')}
         </button>
      </div>
    </div>
  );
}

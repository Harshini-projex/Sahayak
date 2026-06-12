'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { 
  Heart, 
  Activity, 
  AlertCircle,
  Save,
  Search,
  CheckCircle2,
  Stethoscope
} from 'lucide-react';
import styles from './HealthDashboard.module.css';

export default function HealthDashboard() {
  const { t, students, updateStudent } = useApp();
  const [search, setSearch] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  
  // Local edit states
  const [height, setHeight] = useState(134);
  const [weight, setWeight] = useState(28);
  const [hb, setHb] = useState(9.5);
  
  const [notified, setNotified] = useState(false);

  const handleEdit = (student: any) => {
    setSelectedStudent(student);
    setHeight(student.height || 134);
    setWeight(student.weight || 28);
    setHb(student.hb || 9.5);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedStudent) {
      await updateStudent(selectedStudent.id, {
        height: height,
        weight: weight,
        hb: hb
      });
      setSelectedStudent(null);
      alert('Student health card updated successfully!');
    }
  };

  const triggerNotify = () => {
    setNotified(true);
    setTimeout(() => {
      setNotified(false);
      alert('SMS alerts containing customized nutrition recipes sent to all registered parent numbers!');
    }, 1500);
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h3><Heart color="var(--error)" /> {t('healthCard')} Management</h3>
      </header>

      <div className={styles.topActions}>
        <div className={styles.searchBar}>
          <Search size={18} />
          <input 
            type="text" 
            placeholder="Search student by name or roll..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className={styles.contentGrid}>
        <div className="card" style={{ overflowX: 'auto' }}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Student</th>
                <th>Roll</th>
                <th>BMI</th>
                <th>Hb (g/dL)</th>
                <th>Alert Level</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {students
                .filter(s => s.name.toLowerCase().includes(search.toLowerCase()) || s.roll.includes(search))
                .map(student => {
                  const bmiVal = student.height ? (student.weight / Math.pow(student.height / 100, 2)).toFixed(1) : '0';
                  const riskLevel = student.hb < 8.5 ? 'High' : (student.hb < 11.0 ? 'Medium' : 'Low');
                  
                  return (
                    <tr key={student.id}>
                      <td className={styles.studentName}>{student.name}</td>
                      <td>{student.roll}</td>
                      <td>{bmiVal}</td>
                      <td className={student.hb < 11 ? styles.warningText : ''}>{student.hb}</td>
                      <td>
                        <span className={`${styles.badge} ${styles['badge' + riskLevel]}`}>
                          {riskLevel} Risk
                        </span>
                      </td>
                      <td>
                        <button className={styles.editBtn} onClick={() => handleEdit(student)}>Edit Vitals</button>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>

        {selectedStudent && (
          <div className="card">
            <div className={styles.formHeader}>
              <h4>Update Vitals for {selectedStudent.name}</h4>
              <button onClick={() => setSelectedStudent(null)} className={styles.closeBtn}>×</button>
            </div>
            <form onSubmit={handleSave} className={styles.form}>
              <div className={styles.formRow}>
                <label>Height (cm)</label>
                <input 
                  type="number" 
                  value={height} 
                  onChange={e => setHeight(Number(e.target.value))}
                  required 
                />
              </div>
              <div className={styles.formRow}>
                <label>Weight (kg)</label>
                <input 
                  type="number" 
                  value={weight} 
                  onChange={e => setWeight(Number(e.target.value))}
                  required 
                />
              </div>
              <div className={styles.formRow}>
                <label>Hemoglobin (g/dL)</label>
                <input 
                  type="number" 
                  step="0.1"
                  value={hb} 
                  onChange={e => setHb(Number(e.target.value))}
                  required 
                />
              </div>
              <button type="submit" className="btn btn-primary">
                <Save size={18} />
                Save Health Card
              </button>
            </form>
          </div>
        )}
      </div>

      <div className={styles.alertPanel}>
        <div className={styles.panelHeader}>
          <AlertCircle size={20} />
          <h4>Automated Health Risk Flags</h4>
        </div>
        <div className={styles.alertList}>
          <div className={styles.alertItem}>
            <strong>Anemia Warning:</strong> {students.filter(s => s.hb < 11).length} students showing low hemoglobin flags. 
            <button 
              onClick={triggerNotify} 
              className={styles.link}
              disabled={notified}
            >
              {notified ? 'Sending SMS alerts...' : 'Notify Parents via SMS →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

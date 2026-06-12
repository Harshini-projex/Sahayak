'use client';

import React, { useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { 
  Heart, 
  AlertTriangle,
  Calendar as CalendarIcon,
  Stethoscope,
  Utensils,
  Plus,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Award,
  BookOpen
} from 'lucide-react';
import styles from './ParentPortal.module.css';

interface ParentPortalProps {
  currentView?: string;
}

export default function ParentPortal({ currentView = 'dashboard' }: ParentPortalProps) {
  const { t, students, attendanceRecords, healthRecords, language, quizzes } = useApp();

  // Find Meera's profile in database (ID '2')
  const child = students.find(s => s.id === '2') || {
    id: '2',
    name: 'Meera Patil',
    roll: '101',
    grade: '6A',
    age: 10,
    height: 142,
    weight: 36,
    hb: 8.8,
    score: 88,
    points: 450,
    status: 'atRisk',
    badges: []
  };

  // Compute BMI dynamically
  const bmiVal = child.height ? (child.weight / Math.pow(child.height / 100, 2)).toFixed(1) : '17.8';
  const bmiCategory = Number(bmiVal) < 15.0 ? t('bmiUnderweight') : (Number(bmiVal) < 18.5 ? t('bmiNormal') : t('bmiOverweight'));

  // Weekly Attendance Summary Bar (computed from past 7 days)
  const past7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(2026, 5, 12); // Assuming today is June 12, 2026
    d.setDate(d.getDate() - (6 - i));
    const dateString = `2026-06-${d.getDate().toString().padStart(2, '0')}`;
    const record = attendanceRecords.find(r => r.date === dateString);
    let status = 'absent';
    if (record) {
      const s = record.students.find((s: any) => s.id === '2');
      if (s) status = s.status;
    } else {
      status = d.getDay() === 0 || d.getDay() === 6 ? 'weekend' : 'present'; // Mock default
    }
    return status;
  });

  const weeklyPresent = past7Days.filter(s => s === 'present').length;
  const weeklyTotal = past7Days.filter(s => s === 'present' || s === 'absent').length;
  const weeklyAttendanceRate = weeklyTotal ? Math.round((weeklyPresent / weeklyTotal) * 100) : 100;

  // Compute dynamic attendance record for June 2026 calendar days
  const days = Array.from({ length: 30 }, (_, i) => {
    const dayNum = i + 1;
    const dateString = `2026-06-${dayNum < 10 ? '0' + dayNum : dayNum}`;
    const dbRecord = attendanceRecords.find(r => r.date === dateString);

    let status = 'present';
    if (dbRecord) {
      const studentStatus = dbRecord.students.find((s: any) => s.id === '2')?.status;
      status = studentStatus || 'present';
    } else {
      const isWeekend = dayNum % 7 === 6 || dayNum % 7 === 0;
      status = isWeekend ? 'weekend' : 'present';
    }
    return { day: dayNum, status };
  });

  const presentCount = days.filter(d => d.status === 'present').length;
  const activeSchoolDays = days.filter(d => d.status === 'present' || d.status === 'absent').length;
  const attendanceRate = activeSchoolDays ? Math.round((presentCount / activeSchoolDays) * 100) : 96;

  // AI Advice
  const getHbAdvice = (hb: number) => {
    if (hb < 8.5) {
      return {
        title: "Urgent Action Required",
        remedy: t('remedyText'),
        color: "#ef4444"
      };
    } else if (hb < 11.0) {
      return {
        title: "Iron Rich Intake Advised",
        remedy: t('remedyText'),
        color: "#d97706"
      };
    } else {
      return {
        title: "Vitals Look Healthy",
        remedy: "Hemoglobin level is normal. Maintain child growth by continuing a balanced nutrition plan.",
        color: "#059669"
      };
    }
  };

  const advice = getHbAdvice(child.hb);

  // Hardcoded Subject Scores based on child overall score average
  const subjects = [
    { name: t('math'), score: Math.max(0, child.score - 5), color: '#3b82f6' },
    { name: t('science'), score: child.score, color: '#10b981' },
    { name: t('social'), score: Math.max(0, child.score - 10), color: '#8b5cf6' },
    { name: t('english'), score: Math.min(100, child.score + 5), color: '#f59e0b' },
    { name: t('kannada'), score: Math.min(100, child.score + 10), color: '#ec4899' },
  ];

  // All possible badges
  const allBadges = [
    { name: t('goldStar'), emoji: '⭐', icon: Award },
    { name: t('quizChampion'), emoji: '🏆', icon: TrendingUp },
    { name: t('homeworkHero'), emoji: '📝', icon: BookOpen },
    { name: "Reader Pro", emoji: '📚', icon: BookOpen },
    { name: "Healthy Eater", emoji: '🥗', icon: Utensils }
  ];

  const hasQuizChampion = quizzes.filter(q => q.status === 'completed').length >= 1;

  const renderDashboard = () => (
    <div className={styles.dashboardContainer}>
      <div className={styles.heroCard}>
        <div className={styles.heroProfile}>
          <div className={styles.heroAvatar}>MP</div>
          <div className={styles.heroInfo}>
            <h2>{child.name}</h2>
            <p>{t('grade')} {child.grade}</p>
          </div>
        </div>
        <div className={styles.heroStats}>
          <div className={styles.statBadge}>
            <Award size={18} />
            <span>{child.points} {t('rewardPoints')}</span>
          </div>
        </div>
      </div>

      <div className={styles.dashboardGrid}>
        <div className="card">
          <div className={styles.sectionHeader}>
            <h3><CalendarIcon size={20} /> {t('weeklyAttendance')}</h3>
          </div>
          <div className={styles.attendanceBarContainer}>
            <div className={styles.attendanceBarHeader}>
              <span>{weeklyAttendanceRate}%</span>
              <span>7 {t('dateCol')}</span>
            </div>
            <div className={styles.progressBarBg}>
              <div 
                className={styles.progressBarFill} 
                style={{ width: `${weeklyAttendanceRate}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className={styles.sectionHeader}>
            <h3><TrendingUp size={20} /> {t('performanceOverview')}</h3>
          </div>
          <div className={styles.barChart}>
            {subjects.map(sub => (
              <div key={sub.name} className={styles.chartRow}>
                <span className={styles.chartLabel}>{sub.name}</span>
                <div className={styles.chartBarBg}>
                  <div 
                    className={styles.chartBarFill} 
                    style={{ width: `${sub.score}%`, backgroundColor: sub.color }}
                  ></div>
                </div>
                <span className={styles.chartValue}>{sub.score}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderAttendance = () => (
    <div className={styles.attendanceContainer}>
      <div className="card">
        <div className={styles.attendanceHeader}>
          <div>
            <h3><CalendarIcon size={24} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '8px', color: 'var(--parent-accent)' }}/> {t('attendanceCalendar')}</h3>
            <p className={styles.attendanceSubtext}>June 2026</p>
          </div>
          <div className={styles.statBox}>
            <div className={styles.statValue}>{attendanceRate}%</div>
            <div className={styles.statLabel}>{t('avgAttendance')}</div>
          </div>
        </div>
        
        <div className={styles.legend}>
          <span className={styles.legendItem}><div className={styles.dotPresent}></div> {t('present')}</span>
          <span className={styles.legendItem}><div className={styles.dotAbsent}></div> {t('absent')}</span>
        </div>

        <div className={styles.calendarGrid}>
          {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, index) => <div key={`weekday-${d}-${index}`} className={styles.calDayName}>{d}</div>)}
          {days.map(d => (
            <div key={d.day} className={styles.calDayWrapper}>
              <div className={`${styles.calDay} ${styles['day' + d.status]}`}>
                {d.day}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderPerformance = () => (
    <div className={styles.performanceGrid}>
      <div className="card">
        <div className={styles.sectionHeader}>
          <h3><BookOpen size={20} /> {t('performance')}</h3>
        </div>
        <div className={styles.reportCard}>
          <div className={styles.overallScore}>
            <div className={styles.scoreCircle}>
              <span>{child.score}%</span>
            </div>
            <span>{t('avgScore')}</span>
          </div>
          <div className={styles.subjectList}>
            {subjects.map(sub => (
              <div key={sub.name} className={styles.subjectItem}>
                <div className={styles.subjectHeader}>
                  <span className={styles.subjectName}>{sub.name}</span>
                  <span className={styles.subjectScore}>{sub.score}/100</span>
                </div>
                <div className={styles.progressBarBg}>
                  <div 
                    className={styles.progressBarFill} 
                    style={{ width: `${sub.score}%`, backgroundColor: sub.color }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card">
        <div className={styles.sectionHeader}>
          <h3><Award size={20} /> {t('achievementsBadges')}</h3>
        </div>
        <div className={styles.badgeShowcase}>
          {allBadges.map(badge => {
            // Find if student has this badge by checking if child.badges includes the emoji or name
            let isUnlocked = child.badges.some(b => b.includes(badge.emoji) || b.includes(badge.name));
            if (badge.name === t('quizChampion') && hasQuizChampion) isUnlocked = true;
            
            return (
              <div key={badge.name} className={`${styles.badgeCard} ${isUnlocked ? styles.unlocked : styles.locked}`}>
                <div className={styles.badgeEmoji}>{badge.emoji}</div>
                <div className={styles.badgeName}>{badge.name}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderNutrition = () => (
    <div className={styles.healthContainer}>
      <div className={styles.metricsRibbon}>
        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>{t('height')}</span>
          <span className={styles.metricValue}>{child.height} <small>cm</small></span>
        </div>
        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>{t('weight')}</span>
          <span className={styles.metricValue}>{child.weight} <small>kg</small></span>
        </div>
        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>{t('bmi')}</span>
          <span className={styles.metricValue}>{bmiVal}</span>
          <span className={styles.metricStatus} data-status={bmiCategory === t('bmiNormal') ? 'good' : 'warning'}>
            {bmiCategory}
          </span>
        </div>
      </div>

      <div className={styles.criticalAlert} style={{ borderLeftColor: advice.color }}>
        <AlertTriangle color={advice.color} size={24} />
        <div>
          <h4 style={{ color: advice.color }}>{t('healthAlerts')}: {advice.title}</h4>
          <p>{advice.remedy}</p>
        </div>
      </div>

      <div className="card">
        <div className={styles.sectionHeader}>
          <h3><Utensils size={20} /> {t('midDayMeal')}</h3>
        </div>
        <div className={styles.tableWrapper}>
          <table className={styles.mealTable}>
            <thead>
              <tr>
                <th>{t('dateCol')}</th>
                <th>{t('mealServed')}</th>
                <th>{t('quantity')}</th>
                <th>{t('teacherRemarks')}</th>
              </tr>
            </thead>
            <tbody>
              {healthRecords.map((log, idx) => (
                <tr key={idx}>
                  <td><div className={styles.tableDate}>{log.date}</div></td>
                  <td><strong>{log.mealServed}</strong></td>
                  <td>
                    <span className={styles.statusBadge} data-status={log.quantityStatus.includes('High') ? 'good' : 'neutral'}>
                      {log.quantityStatus}
                    </span>
                  </td>
                  <td className={styles.mutedText}>{log.remarks} | {log.calories} kcal</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return (
    <div className={styles.container}>
      {currentView === 'dashboard' && renderDashboard()}
      {currentView === 'attendance' && renderAttendance()}
      {currentView === 'performance' && renderPerformance()}
      {currentView === 'health-meals' && renderNutrition()}
    </div>
  );
}

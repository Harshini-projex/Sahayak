'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { 
  BarChart2, 
  Calendar, 
  BookOpen, 
  Library, 
  Gamepad2, 
  StickyNote, 
  Bot, 
  Utensils, 
  Settings,
  Heart
} from 'lucide-react';
import styles from './BottomNavBar.module.css';

interface BottomNavBarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function BottomNavBar({ activeTab, onTabChange }: BottomNavBarProps) {
  const { t, role: contextRole } = useApp();
  const role = contextRole || 'teacher';

  const getMenuItems = () => {
    const common = [
      { id: 'dashboard', label: t('navHome'), icon: <BarChart2 size={20} /> },
    ];

    if (role === 'teacher') {
      return [
        ...common,
        { id: 'attendance', label: t('attendance'), icon: <Calendar size={20} /> },
        { id: 'lesson-planner', label: t('lessonPlanner'), icon: <BookOpen size={20} /> },
        { id: 'health', label: 'Health', icon: <Heart size={20} /> },
        { id: 'resources', label: t('resourceHub'), icon: <Library size={20} /> },
      ];
    }

    if (role === 'student') {
      return [
        { id: 'dashboard', label: 'Learning', icon: <BookOpen size={20} /> },
        { id: 'games', label: 'Quizzes', icon: <Gamepad2 size={20} /> },
        { id: 'library', label: 'Books', icon: <Library size={20} /> },
        { id: 'progress', label: 'Progress', icon: <BarChart2 size={20} /> },
        { id: 'ai-buddy', label: 'AI', icon: <Bot size={20} /> },
      ];
    }

    return [
      ...common,
      { id: 'attendance', label: t('attendance'), icon: <Calendar size={20} /> },
      { id: 'performance', label: t('performance'), icon: <BarChart2 size={20} /> },
      { id: 'health-meals', label: t('healthMealsNav'), icon: <Heart size={20} /> },
    ];
  };

  return (
    <nav className={`${styles.navBar} ${styles[role]}`}>
      {getMenuItems().map((item) => (
        <button
          key={item.id}
          className={`${styles.navItem} ${activeTab === item.id ? styles.active : ''}`}
          onClick={() => onTabChange(item.id)}
        >
          <div className={styles.iconWrapper}>{item.icon}</div>
          <span className={styles.label}>{item.label}</span>
        </button>
      ))}
      <button
        className={`${styles.navItem} ${activeTab === 'profile' ? styles.active : ''}`}
        onClick={() => onTabChange('profile')}
      >
        <div className={styles.iconWrapper}><Settings size={20} /></div>
        <span className={styles.label}>{t('profile')}</span>
      </button>
    </nav>
  );
}

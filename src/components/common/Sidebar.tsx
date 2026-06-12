'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { 
  BarChart2, 
  Users, 
  BookOpen, 
  Settings, 
  Heart, 
  Utensils, 
  Gamepad2,
  Calendar,
  Library,
  StickyNote,
  Bot
} from 'lucide-react';
import styles from './Sidebar.module.css';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function Sidebar({ activeTab, onTabChange }: SidebarProps) {
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
        { id: 'health', label: t('healthCard'), icon: <Heart size={20} /> },
        { id: 'resources', label: t('resourceHub'), icon: <Library size={20} /> },
      ];
    }

    if (role === 'student') {
      return [
        { id: 'dashboard', label: 'My Learning', icon: <BookOpen size={20} /> },
        { id: 'games', label: t('quizzes'), icon: <Gamepad2 size={20} /> },
        { id: 'library', label: 'Textbook Hub', icon: <Library size={20} /> },
        { id: 'progress', label: 'My Progress', icon: <BarChart2 size={20} /> },
        { id: 'ai-buddy', label: t('chatAssistant'), icon: <Bot size={20} /> },
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
    <aside className={`${styles.sidebar} ${styles[role]}`}>
      <ul className={styles.menu}>
        {getMenuItems().map((item) => (
          <li 
            key={item.id} 
            className={`${styles.menuItem} ${activeTab === item.id ? styles.active : ''}`}
            onClick={() => onTabChange(item.id)}
          >
            {item.icon}
            <span>{item.label}</span>
          </li>
        ))}
      </ul>
      
      <div className={styles.footer}>
        <li 
          className={`${styles.menuItem} ${activeTab === 'profile' ? styles.active : ''}`}
          onClick={() => onTabChange('profile')}
        >
          <Settings size={20} />
          <span>{t('profile')}</span>
        </li>
      </div>
    </aside>
  );
}

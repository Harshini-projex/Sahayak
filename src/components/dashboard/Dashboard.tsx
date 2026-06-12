'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import Header from '@/components/common/Header';
import TeacherPortal from '@/components/teacher/TeacherPortal';
import StudentPortal from '@/components/student/StudentPortal';
import ParentPortal from '@/components/parent/ParentPortal';
import Sidebar from '@/components/common/Sidebar';
import styles from './Dashboard.module.css';

export default function Dashboard() {
  const { role } = useApp();

  const renderPortal = () => {
    switch (role) {
      case 'teacher':
        return <TeacherPortal />;
      case 'student':
        return <StudentPortal />;
      case 'parent':
        return <ParentPortal />;
      default:
        return <TeacherPortal />;
    }
  };

  return (
    <div className={styles.layout}>
      <Header />
      <div className={styles.main}>
        <Sidebar activeTab="dashboard" onTabChange={() => {}} />
        <main className={styles.content}>
          {renderPortal()}
        </main>
      </div>
    </div>
  );
}

'use client';

import React, { useEffect, useState } from 'react';
import { useApp } from '@/context/AppContext';
import { useRouter } from 'next/navigation';
import Header from '@/components/common/Header';
import Sidebar from '@/components/common/Sidebar';
import BottomNavBar from '@/components/common/BottomNavBar';
import styles from './PortalLayout.module.css';

export default function PortalLayout({ 
  children, 
  requiredRole 
}: { 
  children: React.ReactNode, 
  requiredRole?: string 
}) {
  const { user } = useApp();
  const [currentView, setCurrentView] = useState('dashboard');
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/');
    } else if (requiredRole && user.role !== requiredRole) {
      router.push(`/${user.role}`);
    }
  }, [user, router, requiredRole]);

  if (!user) return null;

  return (
    <div className={styles.layout}>
      <Header />
      <div className={styles.main}>
        <Sidebar activeTab={currentView} onTabChange={setCurrentView} />
        <main className={styles.content}>
          {React.Children.map(children, child => {
            if (React.isValidElement(child)) {
              return React.cloneElement(child as React.ReactElement<any>, { currentView });
            }
            return child;
          })}
        </main>
      </div>
      <BottomNavBar activeTab={currentView} onTabChange={setCurrentView} />
    </div>
  );
}

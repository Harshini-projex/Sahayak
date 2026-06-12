'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { Globe, User, LogOut, Menu } from 'lucide-react';
import styles from './Header.module.css';

export default function Header() {
  const { language, setLanguage, user, t, logout, role } = useApp();
  
  const displayRole = role || user?.role || 'teacher';

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <img 
            src="/logo.png" 
            alt="SAHAYAK" 
            className={styles.logoImage}
            onError={(e) => {
              (e.target as any).src = "https://cdn-icons-png.flaticon.com/512/5833/5833290.png";
            }}
          />
          <h1 className={styles.brandTitle}>{t('title')}</h1>
        </div>

        <nav className={styles.nav}>
          <div className={styles.langSelector}>
            <button 
              onClick={() => setLanguage('en')}
              className={`${styles.langBtn} ${language === 'en' ? styles.activeLang : ''}`}
            >
              EN
            </button>
            <span className={styles.divider}>|</span>
            <button 
              onClick={() => setLanguage('kn')}
              className={`${styles.langBtn} ${language === 'kn' ? styles.activeLang : ''}`}
            >
              ಕೆಎನ್
            </button>
          </div>

          {user && (
            <div className={styles.userProfile}>
              <div className={styles.userInfo}>
                <span className={styles.userName}>{user?.name || 'User'}</span>
                <span className={styles.userRole}>{displayRole.toUpperCase()}</span>
              </div>
              <div className={styles.avatar}>
                <User size={20} />
              </div>
            </div>
          )}

          <button className={styles.logoutBtn} onClick={logout} title={t('logout')}>
            <LogOut size={20} />
          </button>
        </nav>
      </div>
    </header>
  );
}

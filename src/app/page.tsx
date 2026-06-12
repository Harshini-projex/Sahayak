'use client';

import React, { useState } from 'react';
import { useApp, Role } from '@/context/AppContext';
import { BrainCircuit, Activity, Users, ArrowRight, Lock, Phone, User as UserIcon, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import styles from './Landing.module.css';

export default function LandingPage() {
  const { setUser, t } = useApp();
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [credentials, setCredentials] = useState({ id: '', password: '', phone: '' });
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole) return;

    const mockName = selectedRole === 'teacher' ? 'Mrs. Kavitha' : selectedRole === 'student' ? 'Meera' : 'Mr. Ramesh';
    
    setUser({
      id: credentials.id || 'MOCK_ID',
      name: mockName,
      role: selectedRole
    });

    router.push(`/${selectedRole}`);
  };

  const roles = [
    { 
      id: 'teacher' as Role, 
      title: 'Teacher Portal', 
      titleKn: 'ಶಿಕ್ಷಕರ ಪೋರ್ಟಲ್',
      desc: 'AI planning & student records tracking.', 
      icon: <BrainCircuit size={28} />, 
      color: '#eff6ff', 
      accent: '#2563eb',
      fields: [
        { name: 'id', label: 'Teacher ID', icon: <UserIcon size={18} />, type: 'text' },
        { name: 'password', label: 'Password', icon: <Lock size={18} />, type: 'password' }
      ]
    },
    { 
      id: 'student' as Role, 
      title: 'Student Learning', 
      titleKn: 'ವಿದ್ಯಾರ್ಥಿ ಕಲಿಕೆ',
      desc: 'Interactive quizzes & digital vault.', 
      icon: <Users size={28} />, 
      color: '#f0fdf4', 
      accent: '#16a34a',
      fields: [
        { name: 'id', label: 'Roll Number', icon: <UserIcon size={18} />, type: 'text' },
        { name: 'password', label: 'Password', icon: <Lock size={18} />, type: 'password' }
      ]
    },
    { 
      id: 'parent' as Role, 
      title: 'Parent Portal', 
      titleKn: 'ಪೋಷಕರ ಪೋರ್ಟಲ್',
      desc: 'Real-time progress & nutrition data.', 
      icon: <Activity size={28} />, 
      color: '#fff1f2', 
      accent: '#e11d48',
      fields: [
        { name: 'phone', label: 'Phone Number', icon: <Phone size={18} />, type: 'tel' },
        { name: 'password', label: 'OTP/Password', icon: <Lock size={18} />, type: 'password' }
      ]
    }
  ];

  return (
    <div className={styles.container}>
      <div className={styles.background}>
        <div className={styles.blob1}></div>
        <div className={styles.blob2}></div>
      </div>

      <nav className={styles.nav}>
        <div className={styles.logo}>
          <img 
            src="/logo.png" 
            alt="Sahayak" 
            className={styles.logoImage}
            onError={(e) => {
              (e.target as any).src = "https://cdn-icons-png.flaticon.com/512/5833/5833290.png";
            }}
          />
          <h1>SAHAYAK</h1>
        </div>
      </nav>

      <main className={styles.main}>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={styles.heroCard}
        >
          <div className={styles.heroContent}>
            <span className={styles.badge}>Unified Education & Health Platform</span>
            <div className={styles.titleGroup}>
              <h2 className={styles.title}>
                Empowering <span>Rural</span> Minds
              </h2>
              <h3 className={styles.titleKn}>ಗ್ರಾಮೀಣ ಪ್ರತಿಭೆಗಳಿಗೆ ತಂತ್ರಜ್ಞಾನದ ಶಕ್ತಿ</h3>
            </div>
            <p className={styles.subtitle}>
              A clean-slate gateway for teachers, students and parents to sync classroom progress with vital health metrics.
            </p>
          </div>
        </motion.div>

        <div className={styles.grid}>
          {roles.map((role) => (
            <motion.div 
              key={role.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={styles.card}
              onClick={() => setSelectedRole(role.id)}
            >
              <div className={styles.cardIcon} style={{ background: role.color, color: role.accent }}>
                {role.icon}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <h3>{role.title}</h3>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--muted)' }}>{role.titleKn}</span>
              </div>
              <p>{role.desc}</p>
              <button className={styles.cardBtn} style={{ background: role.accent }}>
                Enter Portal <ArrowRight size={18} />
              </button>
            </motion.div>
          ))}
        </div>
      </main>

      <AnimatePresence>
        {selectedRole && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={styles.modalOverlay}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={styles.loginModal}
            >
              <button className={styles.closeModal} onClick={() => setSelectedRole(null)}>
                <X size={24} />
              </button>
              
              <div className={styles.modalHeader}>
                <div className={styles.modalIcon} style={{ background: roles.find(r => r.id === selectedRole)?.color, color: roles.find(r => r.id === selectedRole)?.accent }}>
                  {roles.find(r => r.id === selectedRole)?.icon}
                </div>
                <h2>{roles.find(r => r.id === selectedRole)?.title}</h2>
                <p>Authenticating as {selectedRole.toUpperCase()}</p>
              </div>

              <form className={styles.loginForm} onSubmit={handleLogin}>
                {roles.find(r => r.id === selectedRole)?.fields.map(field => (
                  <div key={field.name} className={styles.inputGroup}>
                    <label>{field.label}</label>
                    <div className={styles.inputWrapper}>
                      <span className={styles.inputIcon}>{field.icon}</span>
                      <input 
                        type={field.type} 
                        placeholder={`Enter your ${field.label.toLowerCase()}...`}
                        required 
                        value={(credentials as any)[field.name]}
                        onChange={(e) => setCredentials(prev => ({ ...prev, [field.name]: e.target.value }))}
                      />
                    </div>
                  </div>
                ))}
                <button type="submit" className={styles.submitBtn}>
                  Authenticate & Continue
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

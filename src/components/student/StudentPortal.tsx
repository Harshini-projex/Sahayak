'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import {
  Trophy, Download, WifiOff, Flame,
  CheckCircle2, X, Send, StickyNote,
  ChevronRight, BookOpen, Library, Lock,
  BarChart2, Zap, FileText, Play, Star
} from 'lucide-react';
import confetti from 'canvas-confetti';
import styles from './StudentPortal.module.css';

interface StudentPortalProps {
  currentView?: string;
}

const subjectScores = [
  { subject: 'Math', score: 88, color: '#059669' },
  { subject: 'Science', score: 74, color: '#3b82f6' },
  { subject: 'Kannada', score: 92, color: '#f59e0b' },
  { subject: 'English', score: 80, color: '#8b5cf6' },
  { subject: 'Social', score: 68, color: '#ef4444' },
];

const vaultBooks = {
  'Grade 6': [
    { id: 'math6', name: 'Mathematics 6', size: '12.4 MB' },
    { id: 'sci6', name: 'Science 6', size: '10.1 MB' },
    { id: 'kan6', name: 'Kannada Text 6', size: '8.3 MB' },
    { id: 'eng6', name: 'English Reader 6', size: '9.7 MB' },
    { id: 'ss6', name: 'Social Science 6', size: '11.2 MB' },
  ],
  'Grade 7': [
    { id: 'math7', name: 'Mathematics 7', size: '13.1 MB' },
    { id: 'sci7', name: 'General Science 7', size: '11.5 MB' },
    { id: 'kan7', name: 'Kannada Text 7', size: '8.8 MB' },
    { id: 'ss7', name: 'Social Studies 7', size: '10.4 MB' },
  ],
};

const allAchievements = [
  { id: 'gold', icon: '\u2B50', name: 'Gold Star', desc: 'Score 90%+ in any subject', earned: true },
  { id: 'quiz', icon: '\uD83C\uDFC6', name: 'Quiz Champion', desc: 'Win 3 quizzes in a row', earned: false },
  { id: 'week', icon: '\uD83D\uDD25', name: 'Perfect Week', desc: '100% attendance for a full week', earned: true },
  { id: 'reader', icon: '\uD83D\uDCDA', name: 'Reader Pro', desc: 'Download and read 5 textbooks', earned: true },
  { id: 'healthy', icon: '\uD83E\uDD57', name: 'Healthy Eater', desc: 'Log meals for 7 days straight', earned: false },
  { id: 'pioneer', icon: '\uD83D\uDE80', name: 'Tech Pioneer', desc: 'Complete the AI & Robotics quiz', earned: false },
];

const INITIAL_TASKS = [
  { id: 't1', title: 'Algebra Practice', subject: 'Math', points: 50, status: 'pending', question: 'Solve for x: 3x - 5 = 10', options: ['A) x = 3', 'B) x = 5', 'C) x = 4', 'D) x = 15'], correct: 1 },
  { id: 't2', title: 'States of Matter', subject: 'Science', points: 30, status: 'completed', question: 'Fixed volume but no fixed shape?', options: ['A) Solid', 'B) Liquid', 'C) Gas', 'D) Plasma'], correct: 1 },
  { id: 't3', title: 'English Grammar', subject: 'English', points: 40, status: 'pending', question: 'Choose the correct past tense: She ___ to school.', options: ['A) go', 'B) goes', 'C) went', 'D) going'], correct: 2 },
];

export default function StudentPortal({ currentView = 'dashboard' }: StudentPortalProps) {
  const {
    t, points, badges, awardPoints,
    downloadedBooks, addDownloadedBook,
    quizzes, markQuizDone,
    sharedNotes,
    students,
  } = useApp();

  const sortedLeaderboard = [...students].sort((a, b) => b.points - a.points);

  const [downloading, setDownloading] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [readingBook, setReadingBook] = useState<string | null>(null);
  const [activeTask, setActiveTask] = useState<any | null>(null);
  const [taskAnswer, setTaskAnswer] = useState<number | null>(null);
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'Namaste Meera! I am your AI Learning Buddy. Ask me anything about your subjects, homework, or textbooks!' }
  ]);
  const [chatInp, setChatInp] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const triggerDownload = (bookId: string, bookName: string) => {
    if (downloadedBooks.includes(bookId)) {
      setReadingBook(bookName);
      return;
    }
    setDownloading(bookId);
    setProgress(0);
    const iv = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(iv);
          setTimeout(() => {
            setDownloading(null);
            addDownloadedBook(bookId);
            confetti({ particleCount: 60, spread: 45 });
          }, 300);
          return 100;
        }
        return p + 8;
      });
    }, 120);
  };

  const openTask = (task: any) => {
    if (task.status === 'completed') return;
    setActiveTask(task);
    setTaskAnswer(null);
  };

  const submitTask = async () => {
    if (!activeTask || taskAnswer === null) return;
    
    // Check if the answer is "correct" (Mock condition for demo)
    if (taskAnswer !== null) {
      markQuizDone(activeTask.id);
      await awardPoints(activeTask.points, 'Quiz Champion');
      confetti({ particleCount: 120, spread: 65 });
      alert(t('congratulations') + ' ' + t('pointsEarned'));
    } else {
      alert('Incorrect! Try again.');
    }
    setActiveTask(null);
  };

  const attemptChallenge = async (ch: any) => {
    openTask({
      ...ch,
      question: `This is a mock question for ${ch.title}. Select the correct option.`,
      options: ['Option A', 'Option B', 'Option C', 'Option D'],
      correct: 0
    });
  };

  const downloadNote = (note: any) => {
    const content = 'Study Notes: ' + note.title + '\nSubject: ' + note.subject + '\nGrade: ' + note.grade;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = note.fileName;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInp.trim()) return;
    const q = chatInp.toLowerCase();
    setMessages(m => [...m, { role: 'user', text: chatInp }]);
    setChatInp('');
    setTimeout(() => {
      let reply = '';
      if (q.includes('fraction')) reply = 'A fraction = part of a whole. Example: 1/2 means 1 out of 2 equal parts.';
      else if (q.includes('photosynthesis')) reply = 'Photosynthesis: Plants use sunlight + CO2 + water to make glucose + oxygen. Chlorophyll captures the light!';
      else if (q.includes('gravity')) reply = 'Gravity pulls objects toward Earth. Formula: F = m x g, where g = 9.8 m/s2';
      else if (q.includes('algebra')) reply = 'Algebra uses letters (variables) to represent unknown numbers. Example: x + 5 = 10, so x = 5.';
      else reply = 'I can help with Math, Science, Kannada, or English topics. Try: "Explain photosynthesis" or "What is algebra?"';
      setMessages(m => [...m, { role: 'bot', text: reply }]);
    }, 750);
  };

  // === MY LEARNING VIEW ===
  const renderDashboard = () => (
    <div className={styles.viewContainer}>
      <div className={styles.greenBanner}>
        <div className={styles.bannerLeft}>
          <div className={styles.avatarCircle}>MP</div>
          <div>
            <div className={styles.bannerName}>Meera Patil</div>
            <div className={styles.bannerMeta}>Grade 6 | Roll No. 101 | 6A</div>
            <div className={styles.bannerBadgeRow}>
              {badges.slice(0, 3).map((b, i) => (
                <span key={i} className={styles.smallBadge}>{b}</span>
              ))}
            </div>
          </div>
        </div>
        <div className={styles.bannerRight}>
          <div className={styles.tokenBig}>{points.toLocaleString()}</div>
          <div className={styles.tokenLabel}>Mastery Tokens</div>
        </div>
      </div>

      <div className={styles.twoColGrid}>
        <div>
          <div className={styles.panelTitle}><BookOpen size={18} /> {t('taskPanel')}</div>
          <div className={styles.taskStack}>
            {quizzes.filter(q => q.status === 'pending').map(task => (
              <div
                key={task.id}
                className={`${styles.taskCard} ${task.status === 'completed' ? styles.taskDone : styles.taskPending}`}
                onClick={() => openTask({ ...task, question: 'Mock Q?', options: ['A','B','C'], correct: 0 })}
              >
                <div className={styles.taskCardLeft}>
                  <div
                    className={styles.subjectDot}
                    style={{ background: task.subject === t('math') ? '#059669' : task.subject === t('science') ? '#3b82f6' : '#8b5cf6' }}
                  />
                  <div>
                    <div className={styles.taskCardTitle}>{task.title}</div>
                    <div className={styles.taskCardMeta}>{task.subject} | +{task.points} pts</div>
                  </div>
                </div>
                <div className={styles.taskCardRight}>
                  {task.status === 'completed'
                    ? <CheckCircle2 size={20} color="#059669" />
                    : <ChevronRight size={20} color="#94a3b8" />}
                </div>
              </div>
            ))}
            {sharedNotes.length > 0 && (
              <div className={styles.taskSectionLabel}>{t('resourceHub')}</div>
            )}
            {sharedNotes.map(note => (
              <div key={note.id} className={`${styles.taskCard} ${styles.taskNote}`} onClick={() => downloadNote(note)}>
                <div className={styles.taskCardLeft}>
                  <div className={styles.subjectDot} style={{ background: '#f59e0b' }} />
                  <div>
                    <div className={styles.taskCardTitle}>{note.title}</div>
                    <div className={styles.taskCardMeta}>{note.subject} | {note.grade} | {note.date}</div>
                  </div>
                </div>
                <Download size={18} color="#f59e0b" />
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className={styles.panelTitle}><BarChart2 size={18} /> My Scores</div>
          <div className={styles.scoreCard}>
            {subjectScores.map(s => (
              <div key={s.subject} className={styles.scoreRow}>
                <span className={styles.scoreLabel}>{s.subject}</span>
                <div className={styles.scoreBarBg}>
                  <div className={styles.scoreBarFill} style={{ width: `${s.score}%`, background: s.color }} />
                </div>
                <span className={styles.scorePct}>{s.score}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {activeTask && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHead}>
              <span>{activeTask.title}</span>
              <button onClick={() => setActiveTask(null)} className={styles.closeBtn}><X size={18} /></button>
            </div>
            <p className={styles.questionText}>{activeTask.question}</p>
            <div className={styles.optionsList}>
              {activeTask.options.map((opt: string, i: number) => (
                <button
                  key={i}
                  className={`${styles.optionBtn} ${taskAnswer === i ? styles.optionSel : ''}`}
                  onClick={() => setTaskAnswer(i)}
                >{opt}</button>
              ))}
            </div>
            <button onClick={submitTask} disabled={taskAnswer === null} className={styles.submitBtn}>
              {t('submitAnswer')}
            </button>
          </div>
        </div>
      )}
    </div>
  );

  // === QUIZZES & CHALLENGES VIEW ===
  const renderGames = () => (
    <div className={styles.viewContainer}>
      <div className={styles.challengeHeader}>
        <div className={styles.masteryBlock}>
          <Flame size={22} color="#f59e0b" />
          <div>
            <div className={styles.masteryPts}>{points.toLocaleString()} pts</div>
            <div className={styles.masteryLabel}>Total Mastery Points</div>
          </div>
        </div>
        <div className={styles.streakBlock}>
          <div className={styles.streakNum}>7</div>
          <div className={styles.streakLabel}>Day Streak</div>
        </div>
      </div>

      <div className={styles.panelTitle}><Zap size={18} /> {t('quizzesAndChallenges')}</div>
      <div className={styles.challengeList}>
        {quizzes.map(ch => (
          <div
            key={ch.id}
            className={`${styles.challengeCard} ${ch.status === 'completed' ? styles.challengeDone : ''}`}
          >
            <div className={styles.challengeInfo}>
              <div className={styles.challengeTitle}>{ch.title}</div>
              <div className={styles.challengeMeta}>{ch.subject} | {ch.totalQuestions} Questions | {ch.points} pts</div>
            </div>
            {ch.status === 'completed' ? (
              <span className={styles.completedTag}><CheckCircle2 size={14} /> Done</span>
            ) : (
              <button className={styles.startBtn} onClick={() => attemptChallenge(ch)}>
                <Play size={14} /> {t('startChallenge')}
              </button>
            )}
          </div>
        ))}
        {quizzes.length === 0 && (
          <div className={styles.emptyState}>No challenges yet. Your teacher will post one soon!</div>
        )}
      </div>

      <div className={styles.panelTitle} style={{ marginTop: '2rem' }}><Trophy size={18} /> Class Leaderboard</div>
      <div className={styles.leaderboard}>
        {sortedLeaderboard.map((s, i) => (
          <div key={s.id} className={`${styles.leaderRow} ${s.id === '2' ? styles.leaderHighlight : ''}`}>
            <span className={styles.leaderRank}>
              {i === 0 ? '1st' : i === 1 ? '2nd' : i === 2 ? '3rd' : `#${i + 1}`}
            </span>
            <span className={styles.leaderName}>{s.name}{s.id === '2' ? ' (You)' : ''}</span>
            <span className={styles.leaderPts}>{s.points.toLocaleString()} pts</span>
          </div>
        ))}
      </div>
    </div>
  );

  // === TEXTBOOK HUB VIEW ===
  const renderLibrary = () => (
    <div className={styles.viewContainer}>
      <div className={styles.offlineBanner}>
        <WifiOff size={16} />
        <span>Offline Mode Active — All saved books available without internet</span>
      </div>

      {Object.entries(vaultBooks).map(([grade, books]) => (
        <div key={grade} className={styles.gradeSection}>
          <div className={styles.gradeLabel}>{grade}</div>
          {books.map(book => (
            <div key={book.id} className={styles.bookRow}>
              <div className={styles.bookInfo}>
                <FileText size={18} color="#059669" />
                <div>
                  <div className={styles.bookName}>{book.name}</div>
                  <div className={styles.bookSize}>{book.size}</div>
                </div>
              </div>
              {downloading === book.id ? (
                <div className={styles.progressPill}>
                  <div className={styles.progressFill} style={{ width: `${progress}%` }} />
                  <span>{progress}%</span>
                </div>
              ) : (
                <button
                  onClick={() => triggerDownload(book.id, book.name)}
                  className={`${styles.bookBtn} ${downloadedBooks.includes(book.id) ? styles.savedBtn : styles.downloadBtn}`}
                >
                  {downloadedBooks.includes(book.id)
                    ? <><CheckCircle2 size={14} /> Saved</>
                    : <><Download size={14} /> Download</>}
                </button>
              )}
            </div>
          ))}
        </div>
      ))}

      {sharedNotes.length > 0 && (
        <div className={styles.gradeSection}>
          <div className={styles.gradeLabel}>{t('resourceHub')}</div>
          {sharedNotes.map(note => (
            <div key={note.id} className={styles.bookRow}>
              <div className={styles.bookInfo}>
                <StickyNote size={18} color="#f59e0b" />
                <div>
                  <div className={styles.bookName}>{note.title}</div>
                  <div className={styles.bookSize}>{note.subject} | {note.grade} | {note.date}</div>
                </div>
              </div>
              <button onClick={() => downloadNote(note)} className={`${styles.bookBtn} ${styles.downloadBtn}`}>
                <Download size={14} /> {t('download')}
              </button>
            </div>
          ))}
        </div>
      )}

      {readingBook && (
        <div className={styles.modalOverlay}>
          <div className={styles.readerModal}>
            <div className={styles.modalHead}>
              <span>{readingBook}</span>
              <button onClick={() => setReadingBook(null)} className={styles.closeBtn}><X size={18} /></button>
            </div>
            <div className={styles.readerBody}>
              <h4>Chapter 1: Foundations</h4>
              <p>Welcome to your offline-ready edition! This content is stored locally on your device — no internet needed.</p>
              <div className={styles.highlightBox}>
                Key Insight: Practice every concept with the worksheets provided. Completing quizzes will earn you Mastery Tokens!
              </div>
              <p style={{ marginTop: '1rem' }}>Review each chapter summary, then attempt the daily challenge in the Quizzes tab to test your knowledge.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // === MY PROGRESS VIEW ===
  const renderProgress = () => {
    const completedChallenges = quizzes.filter(c => c.status === 'completed').length;
    const xpToNextLevel = 3000;
    const xpPct = Math.min(Math.round((points / xpToNextLevel) * 100), 100);

    return (
      <div className={styles.viewContainer}>
        <div className={styles.metricsRow}>
          <div className={styles.metricTile} style={{ borderTop: '3px solid #059669' }}>
            <div className={styles.metricVal}>{points.toLocaleString()}</div>
            <div className={styles.metricLbl}>Total Points</div>
          </div>
          <div className={styles.metricTile} style={{ borderTop: '3px solid #f59e0b' }}>
            <div className={styles.metricVal}>{completedChallenges}</div>
            <div className={styles.metricLbl}>Challenges Done</div>
          </div>
          <div className={styles.metricTile} style={{ borderTop: '3px solid #3b82f6' }}>
            <div className={styles.metricVal}>88%</div>
            <div className={styles.metricLbl}>Avg Score</div>
          </div>
          <div className={styles.metricTile} style={{ borderTop: '3px solid #8b5cf6' }}>
            <div className={styles.metricVal}>96%</div>
            <div className={styles.metricLbl}>Attendance</div>
          </div>
        </div>

        <div className={styles.panelTitle}><Star size={18} /> Achievements</div>
        <div className={styles.badgeGrid}>
          {allAchievements.map(ach => (
            <div key={ach.id} className={`${styles.badgeTile} ${ach.earned ? styles.badgeEarned : styles.badgeLocked}`}>
              <div className={styles.badgeIcon}>{ach.earned ? ach.icon : <Lock size={20} color="#94a3b8" />}</div>
              <div className={styles.badgeName}>{ach.name}</div>
              <div className={styles.badgeDesc}>{ach.desc}</div>
              {ach.earned && <div className={styles.earnedTag}>Unlocked</div>}
            </div>
          ))}
        </div>

        <div className={styles.panelTitle} style={{ marginTop: '2rem' }}><BarChart2 size={18} /> Subject Performance</div>
        <div className={styles.scoreCard}>
          {subjectScores.map(s => (
            <div key={s.subject} className={styles.scoreRow}>
              <span className={styles.scoreLabel}>{s.subject}</span>
              <div className={styles.scoreBarBg}>
                <div className={styles.scoreBarFill} style={{ width: `${s.score}%`, background: s.color }} />
              </div>
              <span className={styles.scorePct}>{s.score}%</span>
            </div>
          ))}
        </div>

        <div className={styles.panelTitle} style={{ marginTop: '2rem' }}><Zap size={18} /> Level Progress</div>
        <div className={styles.xpCard}>
          <div className={styles.xpLabels}>
            <span>Level 3 - Explorer</span>
            <span>{points.toLocaleString()} / {xpToNextLevel.toLocaleString()} XP</span>
          </div>
          <div className={styles.xpBarBg}>
            <div className={styles.xpBarFill} style={{ width: `${xpPct}%` }} />
          </div>
          <div className={styles.xpHint}>{xpToNextLevel - points} XP to reach Level 4 - Trailblazer</div>
        </div>
      </div>
    );
  };

  // === AI BUDDY VIEW ===
  const renderAIBuddy = () => (
    <div className={styles.viewContainer} style={{ height: 'calc(100vh - 220px)', display: 'flex', flexDirection: 'column' }}>
      <div className={styles.chatBox}>
        <div className={styles.chatMessages}>
          {messages.map((m, i) => (
            <div key={i} className={`${styles.chatBubble} ${m.role === 'user' ? styles.bubbleUser : styles.bubbleBot}`}>
              {m.text}
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>
        <form onSubmit={handleChat} className={styles.chatForm}>
          <input
            type="text"
            placeholder="Ask me: Explain photosynthesis..."
            value={chatInp}
            onChange={e => setChatInp(e.target.value)}
            className={styles.chatInput}
          />
          <button type="submit" className={styles.chatSend}><Send size={20} /></button>
        </form>
      </div>
    </div>
  );

  return (
    <div className={styles.container}>
      {currentView === 'dashboard' && renderDashboard()}
      {currentView === 'games' && renderGames()}
      {currentView === 'library' && renderLibrary()}
      {currentView === 'progress' && renderProgress()}
      {currentView === 'ai-buddy' && renderAIBuddy()}
      {currentView === 'notes' && renderDashboard()}
    </div>
  );
}

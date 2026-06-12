'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { 
  Users, 
  BookOpen, 
  Calendar, 
  Plus, 
  Sparkles, 
  History, 
  CheckCircle2, 
  TrendingUp, 
  AlertCircle, 
  MoreVertical, 
  Star, 
  FileText, 
  Link as LinkIcon, 
  Book, 
  Download, 
  Trash2, 
  ChevronDown, 
  Library,
  Heart,
  Search,
  X,
  Upload,
  Loader2,
  FileBadge
} from 'lucide-react';
import HealthDashboard from '../health/HealthDashboard';
import AttendanceGrid from './AttendanceGrid';
import styles from './TeacherPortal.module.css';

interface TeacherPortalProps {
  currentView?: string;
}

export default function TeacherPortal({ currentView = 'dashboard' }: TeacherPortalProps) {
  const { 
    t, 
    user, 
    lessonPlans, 
    addLessonPlan, 
    deleteLessonPlan,
    students, 
    updateStudent,
    sharedNotes,
    uploadNotes,
    deleteSharedNote,
    addQuiz,
    quizzes
  } = useApp();

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [rosterFilter, setRosterFilter] = useState<'all' | 'stable' | 'atRisk' | 'critical'>('all');
  
  // Selected Student for edit modal
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null);
  const [editForm, setEditForm] = useState({ height: 0, weight: 0, hb: 0, score: 0 });

  // AI Lesson Planner state
  const [topic, setTopic] = useState('');
  const [subject, setSubject] = useState('Mathematics');
  const [grade, setGrade] = useState('Grade 6');
  const [duration, setDuration] = useState('45 Mins');
  const [classLevel, setClassLevel] = useState('Beginner');
  const [generating, setGenerating] = useState(false);
  const [generatorStep, setGeneratorStep] = useState(0);
  const [generatedPlan, setGeneratedPlan] = useState<string | null>(null);
  const [activePlanId, setActivePlanId] = useState<string | null>(null);

  // Resource Hub state
  const [activeFilter, setActiveFilter] = useState('all');
  const [noteTitle, setNoteTitle] = useState('');
  const [noteDesc, setNoteDesc] = useState('');
  const [ocrImage, setOcrImage] = useState<string | null>(null);
  const [ocrScanning, setOcrScanning] = useState(false);
  const [ocrResult, setOcrResult] = useState<any | null>(null);

  // Challenge Creator state
  const [quizTitle, setQuizTitle] = useState('');
  const [quizSubject, setQuizSubject] = useState('Mathematics');
  const [quizGrade, setQuizGrade] = useState('Grade 6');
  const [quizQuestions, setQuizQuestions] = useState(10);
  const [quizPoints, setQuizPoints] = useState(100);
  const [quizPosting, setQuizPosting] = useState(false);

  // Resources Publisher state
  const [pubTitle, setPubTitle] = useState('');
  const [pubSubject, setPubSubject] = useState('Mathematics');
  const [pubGrade, setPubGrade] = useState('Grade 6');
  const [pubFileType, setPubFileType] = useState('.pdf');
  const [pubPosting, setPubPosting] = useState(false);

  // Dynamic metrics
  const totalStudents = students.length;
  const avgScore = totalStudents ? (students.reduce((acc, s) => acc + s.score, 0) / totalStudents).toFixed(1) : '0';
  const healthAlerts = students.filter(s => s.status === 'critical' || s.status === 'atRisk').length;
  
  // Custom mock attendance percentage based on grades
  const avgAttendance = '93.6%';

  // Dynamic student list with filters
  const filteredStudents = students.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.roll.includes(searchQuery);
    const matchesFilter = rosterFilter === 'all' || s.status === rosterFilter;
    return matchesSearch && matchesFilter;
  });

  const handleEditStudent = (student: any) => {
    setSelectedStudent(student);
    setEditForm({
      height: student.height,
      weight: student.weight,
      hb: student.hb,
      score: student.score
    });
  };

  const handleSaveStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedStudent) {
      await updateStudent(selectedStudent.id, {
        height: editForm.height,
        weight: editForm.weight,
        hb: editForm.hb,
        score: editForm.score
      });
      setSelectedStudent(null);
    }
  };

  const handleGeneratePlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic) return;

    setGenerating(true);
    setGeneratorStep(1);

    setTimeout(() => {
      setGeneratorStep(2);
      setTimeout(() => {
        setGeneratorStep(3);
        setTimeout(() => {
          // Generate a beautiful mock markdown-like lesson plan
          const plan = `### Core Objectives for ${topic} (${subject} - ${grade})
- Understand the primary laws and equations of ${topic}.
- Connect ${topic} to daily life applications in rural ecosystems.

### Split-Level Teaching Materials
- **Foundational Buddies (Basic)**: 
  - Visual objects modeling: explaining ${topic} using pebbles, leaves, or water cups.
  - Guided step-by-step practice sheets.
- **Advanced Explorers (Higher Order)**:
  - Formulation: translating complex word problems into expressions.
  - Multi-variable challenges.

### Hyperlocal Classroom Activities
- **Local Lore Connection**: Introduce this topic by sharing how village ancestors used traditional weighing scales (Tharasu) to balance grains.
- **Group Activity**: Split the class into groups and let them build physical diagrams on the clay playground.

### Quiz Blueprint (Mastery Check)
1. Multiple Choice concept question about ${topic}.
2. Step-by-step algebraic modeling exercise.
3. Creative open-ended reflection question.`;

          addLessonPlan(topic, plan);
          setGeneratedPlan(plan);
          setGenerating(false);
          setGeneratorStep(0);
        }, 1200);
      }, 1000);
    }, 900);
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteTitle || !noteDesc) return;
    uploadNotes({
      title: `${noteTitle}.pdf`,
      subject: noteDesc,
      grade: 'General',
      fileType: '.pdf',
      downloadUrl: '#'
    });
    setNoteTitle('');
    setNoteDesc('');
  };

  const handleAddQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quizTitle) return;
    setQuizPosting(true);
    addQuiz({ title: quizTitle, subject: quizSubject, grade: quizGrade, totalQuestions: quizQuestions, points: quizPoints });
    setQuizPosting(false);
    setQuizTitle('');
    setQuizQuestions(10);
    setQuizPoints(100);
    alert(`${t('saveSuccess')}!`);
  };

  const handlePublishNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pubTitle) return;
    setPubPosting(true);
    uploadNotes({ title: pubTitle, subject: pubSubject, grade: pubGrade, fileType: pubFileType, downloadUrl: '#' });
    setPubPosting(false);
    setPubTitle('');
    alert(`${t('saveSuccess')}!`);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setOcrScanning(true);
      setOcrImage(URL.createObjectURL(file));
      setOcrResult(null);

      // Simulate OCR Scanning animation
      setTimeout(() => {
        setOcrScanning(false);
        setOcrResult({
          title: "OCR Extracted Chapter: Force and Motion",
          content: "Force is defined as a push or a pull acting on an object. In village transport, bullock carts demonstrate balanced forces when moving at constant speeds.",
          questions: [
            "Q1. Identify two daily instances of force in agriculture.",
            "Q2. Contrast static friction with rolling friction."
          ]
        });
      }, 2000);
    }
  };

  const handleShareOCR = async () => {
    if (ocrResult) {
      uploadNotes({
        title: "Study Sheet - Force and Motion", 
        subject: "Science",
        grade: "Grade 6",
        fileType: ".pdf",
        downloadUrl: "#"
      });
      alert(t('saveSuccess'));
      setOcrResult(null);
      setOcrImage(null);
    }
  };

  const renderDashboard = () => (
    <>
      <header className={styles.header}>
        <div className={styles.welcomeInfo}>
          <h2>{t('welcome')}, {user?.name}! 👋</h2>
          <p style={{ color: 'var(--muted)', fontWeight: 600 }}>{t('tagline')}</p>
        </div>
      </header>

      <div className={styles.metricGrid}>
        <div className={`${styles.metricCard} ${styles.accentWarm}`}>
          <span className={styles.metricLabel}>{t('totalStudents')}</span>
          <div className={styles.metricValue}>{totalStudents}</div>
          <div className={styles.metricIndicator} style={{ color: 'var(--secondary)' }}>
            <TrendingUp size={14} /> +2 this month
          </div>
        </div>
        <div className={`${styles.metricCard} ${styles.accentGreen}`}>
          <span className={styles.metricLabel}>{t('avgAttendance')}</span>
          <div className={styles.metricValue}>{avgAttendance}</div>
          <div className={styles.metricIndicator} style={{ color: 'var(--secondary)' }}>On Track</div>
        </div>
        <div className={`${styles.metricCard} ${styles.accentIndigo}`}>
          <span className={styles.metricLabel}>{t('avgScore')}</span>
          <div className={styles.metricValue}>{avgScore}</div>
          <div className={styles.metricIndicator} style={{ color: 'var(--accent)' }}>
            <Star size={14} fill="currentColor" /> Mastery
          </div>
        </div>
        <div className={`${styles.metricCard} ${styles.accentError}`}>
          <span className={styles.metricLabel}>{t('healthAlerts')}</span>
          <div className={styles.metricValue}>{healthAlerts}</div>
          <div className={styles.metricIndicator} style={{ color: 'var(--error)' }}>
            <AlertCircle size={14} /> Needs Attention
          </div>
        </div>
      </div>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h3><Users /> {t('navStudents')} Roster</h3>
          <div className={styles.searchControls}>
            <div className={styles.searchBox}>
              <Search size={16} />
              <input 
                type="text" 
                placeholder="Search roll, name..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
            <div className={styles.filterPills}>
              {(['all', 'stable', 'atRisk', 'critical'] as const).map(f => (
                <button
                  key={f}
                  className={`${styles.filterPill} ${rosterFilter === f ? styles.activePill : ''}`}
                  onClick={() => setRosterFilter(f)}
                >
                  {f.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.rosterList}>
          {filteredStudents.map((s) => (
            <div key={s.id} className={styles.studentRow} onClick={() => handleEditStudent(s)}>
              <div className={styles.studentMain}>
                <div className={styles.studentAvatar}>{s.name[0]}</div>
                <div>
                  <div className={styles.studentName}>{s.name}</div>
                  <div className={styles.rollNo}>Roll: {s.roll}</div>
                </div>
              </div>
              <div className={styles.hideTablet}><span className={styles.gradeTag}>{s.grade}</span></div>
              <div className={`${styles.attendanceText} ${styles.hideTablet}`}>Age {s.age}</div>
              <div className={`${styles.scoreText} ${styles.hideTablet}`}>{s.score}% Avg.</div>
              <div className={styles.pointsText}>
                <Star size={14} fill="currentColor" /> {s.points} Pts
              </div>
              <div>
                <span className={styles.badge} style={{ 
                  background: s.status === 'stable' ? '#ecfdf5' : s.status === 'atRisk' ? '#fffbeb' : '#fef2f2',
                  color: s.status === 'stable' ? '#059669' : s.status === 'atRisk' ? '#d97706' : '#dc2626',
                  fontSize: '0.625rem'
                }}>
                  {t(s.status as any)}
                </span>
              </div>
              <button onClick={(e) => { e.stopPropagation(); handleEditStudent(s); }}><MoreVertical size={18} color="var(--muted)" /></button>
            </div>
          ))}
          {filteredStudents.length === 0 && (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--muted)' }}>No student records found matching filters.</div>
          )}
        </div>
      </section>

      {/* Edit Student Modal */}
      {selectedStudent && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <div>
                <h3>Edit Student Profile</h3>
                <p>{selectedStudent.name} • Roll {selectedStudent.roll} • {selectedStudent.grade}</p>
              </div>
              <button className={styles.closeBtn} onClick={() => setSelectedStudent(null)}><X size={20} /></button>
            </div>
            <form onSubmit={handleSaveStudent} className={styles.modalForm}>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label>Height (cm)</label>
                  <input 
                    type="number" 
                    value={editForm.height} 
                    onChange={e => setEditForm({ ...editForm, height: Number(e.target.value) })}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Weight (kg)</label>
                  <input 
                    type="number" 
                    value={editForm.weight} 
                    onChange={e => setEditForm({ ...editForm, weight: Number(e.target.value) })}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Hemoglobin (g/dL)</label>
                  <input 
                    type="number" 
                    step="0.1"
                    value={editForm.hb} 
                    onChange={e => setEditForm({ ...editForm, hb: Number(e.target.value) })}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Average Score (%)</label>
                  <input 
                    type="number" 
                    value={editForm.score} 
                    onChange={e => setEditForm({ ...editForm, score: Number(e.target.value) })}
                    required
                  />
                </div>
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                Save Student Record
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );

  const renderLessonPlanner = () => (
    <section className={styles.section}>
      <div className={styles.sectionHeader}>
        <h3><BookOpen /> {t('lessonPlanner')}</h3>
      </div>
      <div className={styles.plannerLayout}>
        <div className="card" style={{ flex: 1 }}>
          <form className={styles.plannerForm} onSubmit={handleGeneratePlan}>
            <div className={styles.splitGrid}>
              <div className={styles.selectGroup}>
                <label>{t('subject')}</label>
                <select value={subject} onChange={e => setSubject(e.target.value)}>
                  <option>Mathematics</option>
                  <option>Science</option>
                  <option>Social Studies</option>
                  <option>Kannada</option>
                  <option>English</option>
                </select>
              </div>
              <div className={styles.selectGroup}>
                <label>{t('grade')}</label>
                <select value={grade} onChange={e => setGrade(e.target.value)}>
                  <option>{t('grade6')}</option>
                  <option>{t('grade7')}</option>
                  <option>{t('grade8')}</option>
                  <option>{t('grade9')}</option>
                  <option>{t('grade10')}</option>
                </select>
              </div>
            </div>
            <div className={styles.splitGrid}>
              <div className={styles.selectGroup}>
                <label>{t('duration')}</label>
                <input type="text" value={duration} onChange={e => setDuration(e.target.value)} />
              </div>
              <div className={styles.selectGroup}>
                <label>{t('classLevel')}</label>
                <select value={classLevel} onChange={e => setClassLevel(e.target.value)}>
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Advanced</option>
                </select>
              </div>
            </div>
            <div className={styles.selectGroup}>
              <label>{t('chapterName')}</label>
              <input 
                type="text" 
                placeholder="e.g. Fractions, Photosynthesis, Gravity..." 
                value={topic} 
                onChange={e => setTopic(e.target.value)} 
                required
              />
            </div>
            <button type="submit" className={styles.generateBtn} disabled={generating}>
              {generating ? (
                <>
                  <Loader2 className="spin" size={18} />
                  <span>
                    {generatorStep === 1 && "Curriculum Alignment Analysis..."}
                    {generatorStep === 2 && "Localizing Pedagogy & Lore..."}
                    {generatorStep === 3 && "Structuring Teaching Materials..."}
                  </span>
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  <span>{t('generatePlan')}</span>
                </>
              )}
            </button>
          </form>

          {/* Generated Plan Output Display */}
          {generatedPlan && (
            <div className={styles.planOutput}>
              <div className={styles.planOutputHeader}>
                <h4>Generated Draft Plan</h4>
                <button onClick={() => setGeneratedPlan(null)} className={styles.closeBtn}><X size={16} /></button>
              </div>
              <div className={styles.planBody}>
                {generatedPlan.split('\n\n').map((para, i) => {
                  if (para.startsWith('###')) {
                    return <h5 key={i} style={{ margin: '1rem 0 0.5rem', fontWeight: 800, color: 'var(--primary)' }}>{para.replace('### ', '')}</h5>;
                  }
                  return <p key={i} style={{ marginBottom: '0.75rem', fontSize: '0.9rem', whiteSpace: 'pre-line' }}>{para}</p>;
                })}
              </div>
            </div>
          )}
        </div>

        {/* History of Saved Plans */}
        <div className={styles.plannerHistory}>
          <h4 style={{ fontSize: '0.9rem', fontWeight: 800, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <History size={16} /> Saved Plans
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {lessonPlans.map(plan => (
              <div key={plan.id} className="card" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 800, fontSize: '0.95rem' }}>{plan.topic}</span>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={() => setActivePlanId(activePlanId === plan.id ? null : plan.id)}>
                      <ChevronDown size={18} color="var(--muted)" style={{ transform: activePlanId === plan.id ? 'rotate(180deg)' : 'none', transition: '0.2s' }} />
                    </button>
                    <button onClick={() => deleteLessonPlan(plan.id)}><Trash2 size={16} color="var(--error)" /></button>
                  </div>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--muted)', fontWeight: 700 }}>Created: {plan.date}</div>
                {activePlanId === plan.id && (
                  <div className={styles.expandedContent}>
                    {plan.content.split('\n\n').map((para, i) => (
                      <p key={i} style={{ fontSize: '0.85rem', marginBottom: '0.5rem', whiteSpace: 'pre-line' }}>{para}</p>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {lessonPlans.length === 0 && (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--muted)', fontSize: '0.85rem' }}>No lesson plans generated yet.</div>
            )}
          </div>
        </div>
      </div>
    </section>
  );

  const renderResourceHub = () => (
    <section className={styles.section}>
      <div className={styles.sectionHeader}>
        <h3><Library /> {t('resourceHub')} & Student Content Creator</h3>
      </div>

      <div className={styles.resourceGrid}>
        {/* ── Left Column ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', flex: 1 }}>

          {/* ── Challenge Creator ── */}
          <div className="card" style={{ borderTop: '4px solid #6366f1' }}>
            <h4 style={{ fontWeight: 900, marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.1rem' }}>🎮</span> {t('postChallenge')}
            </h4>
            <p style={{ fontSize: '0.78rem', color: 'var(--muted)', fontWeight: 600, marginBottom: '1rem' }}>
              Published challenges instantly appear in the student&apos;s <strong>{t('quizzesAndChallenges')}</strong> tab.
            </p>
            <form onSubmit={handleAddQuiz} style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              <div className={styles.selectGroup}>
                <label>{t('notesTitle')}</label>
                <input
                  type="text"
                  placeholder="e.g. Algebra Speed Round"
                  value={quizTitle}
                  onChange={e => setQuizTitle(e.target.value)}
                  required
                />
              </div>
              <div className={styles.splitGrid}>
                <div className={styles.selectGroup}>
                  <label>{t('subject')}</label>
                  <select value={quizSubject} onChange={e => setQuizSubject(e.target.value)}>
                    <option>{t('math')}</option>
                    <option>{t('science')}</option>
                    <option>{t('social')}</option>
                    <option>{t('kannada')}</option>
                    <option>{t('english')}</option>
                  </select>
                </div>
                <div className={styles.selectGroup}>
                  <label>{t('grade')}</label>
                  <select value={quizGrade} onChange={e => setQuizGrade(e.target.value)}>
                    <option>{t('grade6')}</option>
                    <option>{t('grade7')}</option>
                    <option>{t('grade8')}</option>
                    <option>{t('grade9')}</option>
                    <option>{t('grade10')}</option>
                  </select>
                </div>
              </div>
              <div className={styles.splitGrid}>
                <div className={styles.selectGroup}>
                  <label>{t('questionsCount')}</label>
                  <input type="number" min={2} max={30} value={quizQuestions} onChange={e => setQuizQuestions(Number(e.target.value))} />
                </div>
                <div className={styles.selectGroup}>
                  <label>{t('pointsReward')}</label>
                  <input type="number" min={10} max={500} step={10} value={quizPoints} onChange={e => setQuizPoints(Number(e.target.value))} />
                </div>
              </div>
              <button type="submit" className={styles.generateBtn} disabled={quizPosting}>
                {quizPosting ? <><Loader2 className="spin" size={18} /> Posting...</> : <><Plus size={18} /> {t('postChallenge')}</>}
              </button>
            </form>
          </div>

          {/* ── Synced Notes Publisher ── */}
          <div className="card" style={{ borderTop: '4px solid #059669' }}>
            <h4 style={{ fontWeight: 900, marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.1rem' }}>📚</span> {t('publishResource')}
            </h4>
            <p style={{ fontSize: '0.78rem', color: 'var(--muted)', fontWeight: 600, marginBottom: '1rem' }}>
              Published notes appear in the student&apos;s <strong>{t('textbookHub')}</strong> and <strong>{t('myLearning')}</strong> tabs.
            </p>
            <form onSubmit={handlePublishNote} style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              <div className={styles.selectGroup}>
                <label>{t('notesTitle')}</label>
                <input
                  type="text"
                  placeholder="e.g. Photosynthesis Summary"
                  value={pubTitle}
                  onChange={e => setPubTitle(e.target.value)}
                  required
                />
              </div>
              <div className={styles.splitGrid}>
                <div className={styles.selectGroup}>
                  <label>{t('subject')}</label>
                  <select value={pubSubject} onChange={e => setPubSubject(e.target.value)}>
                    <option>{t('math')}</option>
                    <option>{t('science')}</option>
                    <option>{t('social')}</option>
                    <option>{t('kannada')}</option>
                    <option>{t('english')}</option>
                  </select>
                </div>
                <div className={styles.selectGroup}>
                  <label>{t('grade')}</label>
                  <select value={pubGrade} onChange={e => setPubGrade(e.target.value)}>
                    <option>{t('grade6')}</option>
                    <option>{t('grade7')}</option>
                    <option>{t('grade8')}</option>
                    <option>{t('grade9')}</option>
                    <option>{t('grade10')}</option>
                  </select>
                </div>
              </div>
              <div className={styles.selectGroup}>
                <label>{t('fileType')}</label>
                <select value={pubFileType} onChange={e => setPubFileType(e.target.value)}>
                  <option>.pdf</option>
                  <option>.docx</option>
                </select>
              </div>
              <button type="submit" className="btn btn-primary" disabled={pubPosting}>
                {pubPosting ? <><Loader2 className="spin" size={18} /> Publishing...</> : <><Plus size={18} /> {t('publishResource')}</>}
              </button>
            </form>
          </div>

          {/* ── OCR Scanner ── */}
          <div className="card">
            <h4 style={{ fontWeight: 900, marginBottom: '1rem' }}>📷 AI OCR Textbook Scanner</h4>
            <div className={styles.ocrUploader}>
              <label className={styles.uploadLabel}>
                <Upload size={24} />
                <span>Select chapter image...</span>
                <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
              </label>
              {ocrScanning && (
                <div className={styles.scanningPreview}>
                  <Loader2 className="spin" size={24} />
                  <span>AI Scanning Textbook and extracting concepts...</span>
                  <div className={styles.scanningBeam}></div>
                </div>
              )}
              {ocrResult && (
                <div className={styles.ocrResultBox}>
                  <h5>{ocrResult.title}</h5>
                  <p>{ocrResult.content}</p>
                  <div className={styles.ocrQuestions}>
                    <strong>Identified Questions:</strong>
                    {ocrResult.questions.map((q: string, idx: number) => <div key={idx}>{q}</div>)}
                  </div>
                  <button onClick={handleShareOCR} className="btn btn-primary" style={{ marginTop: '1rem', width: '100%' }}>
                    <FileBadge size={16} /> Share Study Sheet with Students
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Right Column — Active Content Lists ── */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

          <div className="card">
            <h4 style={{ fontWeight: 900, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              🎮 {t('quizzesAndChallenges')}
              <span style={{ marginLeft: 'auto', fontSize: '0.75rem', background: '#eef2ff', color: '#6366f1', padding: '0.2rem 0.6rem', borderRadius: '9999px', fontWeight: 800 }}>
                {quizzes.length} Active
              </span>
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {quizzes.map(ch => (
                <div key={ch.id} style={{ padding: '0.875rem 1rem', borderRadius: '10px', background: ch.status === 'completed' ? '#f0fdf4' : '#f8fafc', border: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '0.88rem' }}>{ch.title}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--muted)', fontWeight: 600, marginTop: 2 }}>{ch.subject} • {ch.totalQuestions} Qs • {ch.points} pts</div>
                  </div>
                  <span style={{ fontSize: '0.72rem', fontWeight: 800, padding: '0.2rem 0.6rem', borderRadius: '9999px', background: ch.status === 'completed' ? '#ecfdf5' : '#fffbeb', color: ch.status === 'completed' ? '#059669' : '#d97706' }}>
                    {ch.status === 'completed' ? '✓ Done' : '⏳ Pending'}
                  </span>
                </div>
              ))}
              {quizzes.length === 0 && <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--muted)', fontSize: '0.85rem' }}>No challenges posted yet.</div>}
            </div>
          </div>

          {/* Published Notes List */}
          <div className="card">
            <h4 style={{ fontWeight: 900, marginBottom: '1.25rem' }}>📚 {t('sharedNotesHeader')} ({sharedNotes.length})</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              {sharedNotes.map(note => (
                <div key={note.id} style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', padding: '0.75rem', background: '#f8fafc', borderRadius: '10px', border: '1px solid var(--border)' }}>
                  <div style={{ width: '38px', height: '38px', background: '#ecfdf5', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#059669', flexShrink: 0 }}>
                    <FileText size={18} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 800, fontSize: '0.88rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{note.title}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--muted)', fontWeight: 600 }}>{note.subject} • {note.grade} • {note.date}</div>
                  </div>
                  <button onClick={() => deleteSharedNote(note.id)} style={{ flexShrink: 0 }}><Trash2 size={15} color="var(--error)" /></button>
                </div>
              ))}
              {sharedNotes.length === 0 && <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--muted)', fontSize: '0.85rem' }}>No notes published yet.</div>}
            </div>
          </div>


        </div>
      </div>
    </section>
  );

  return (
    <div className={styles.container}>
      {currentView === 'dashboard' && renderDashboard()}
      {currentView === 'attendance' && <AttendanceGrid />}
      {currentView === 'lesson-planner' && renderLessonPlanner()}
      {currentView === 'health' && <HealthDashboard />}
      {currentView === 'resources' && renderResourceHub()}
    </div>
  );
}

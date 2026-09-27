import { AppState, Subject, Topic, Task, UpcomingExam, FocusSession, QuickNote, StudentProfile, GamificationState } from '../types';

export function getTodayDateString(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getDateOffset(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function generateInitialSampleData(studentName: string = 'Priya Sharma', isSample: boolean = true): AppState {
  const today = getTodayDateString();
  const yesterday = getDateOffset(-1);
  const twoDaysAgo = getDateOffset(-2);
  const tomorrow = getDateOffset(1);
  const inThreeDays = getDateOffset(3);
  const inFiveDays = getDateOffset(5);
  const inTwelveDays = getDateOffset(12);

  // Neutral subjects as requested:
  // Cell Biology, Human Physiology, General Chemistry, Quantitative Aptitude, General Knowledge
  const subjects: Subject[] = [
    {
      id: 'sub-1',
      name: 'Cell Biology',
      code: 'BIO 101',
      track: 'college',
      color: 'indigo',
      description: 'Cell structure, organelle functions, membrane transport and respiration'
    },
    {
      id: 'sub-2',
      name: 'Human Physiology',
      code: 'PHYS 202',
      track: 'college',
      color: 'rose',
      description: 'Cardiovascular control, nervous system and endocrine pathways'
    },
    {
      id: 'sub-3',
      name: 'General Chemistry',
      code: 'CHEM 110',
      track: 'both',
      color: 'emerald',
      description: 'Equilibrium, acid-base systems, thermodynamics and kinetics'
    },
    {
      id: 'sub-4',
      name: 'Quantitative Aptitude',
      code: 'QUANT-PREP',
      track: 'competitive',
      color: 'amber',
      description: 'Arithmetic speed math, data interpretation, ratios and percentages'
    },
    {
      id: 'sub-5',
      name: 'General Knowledge',
      code: 'GK-CURR',
      track: 'competitive',
      color: 'sky',
      description: 'National and international news, constitutional law and geography'
    }
  ];

  // Topics structured with visual Learning Journey progression order
  const topics: Topic[] = [
    // Sub-1: Cell Biology Road
    {
      id: 'top-1',
      subjectId: 'sub-1',
      chapter: 'Unit 1: Fundamentals',
      name: 'Cell Structure & Organelles',
      status: 'strong',
      mastery: 'mastered',
      orderIndex: 1,
      difficulty: 'easy',
      lastStudiedDate: getDateOffset(-10),
      revisionCount: 5,
      nextRevisionDate: inFiveDays,
      notesSummary: 'Eukaryotic vs prokaryotic, endoplasmic reticulum, Golgi vesicle packaging'
    },
    {
      id: 'top-2',
      subjectId: 'sub-1',
      chapter: 'Unit 2: Biomolecules',
      name: 'Biomolecules & Enzymes',
      status: 'strong',
      mastery: 'strong',
      orderIndex: 2,
      difficulty: 'medium',
      lastStudiedDate: getDateOffset(-7),
      revisionCount: 3,
      nextRevisionDate: inThreeDays,
      notesSummary: 'Lock & key vs induced fit, Michaelis-Menten kinetics, competitive inhibitors'
    },
    {
      id: 'top-3',
      subjectId: 'sub-1',
      chapter: 'Unit 3: Transport',
      name: 'Membrane Transport & Osmosis',
      status: 'revised',
      mastery: 'practicing',
      orderIndex: 3,
      difficulty: 'medium',
      lastStudiedDate: yesterday,
      revisionCount: 2,
      nextRevisionDate: today, // DUE TODAY!
      notesSummary: 'Na+/K+ ATPase pump exports 3 Na+ and imports 2 K+ against gradient'
    },
    {
      id: 'top-4',
      subjectId: 'sub-1',
      chapter: 'Unit 4: Bioenergetics',
      name: 'Cellular Respiration (Krebs Cycle)',
      status: 'learning',
      mastery: 'learning',
      orderIndex: 4,
      difficulty: 'hard',
      lastStudiedDate: twoDaysAgo,
      revisionCount: 1,
      nextRevisionDate: today, // DUE TODAY!
      notesSummary: 'Net 2 ATP in glycolysis, chemiosmotic oxidative phosphorylation'
    },
    {
      id: 'top-5',
      subjectId: 'sub-1',
      chapter: 'Unit 5: Division',
      name: 'Cell Division (Mitosis & Meiosis)',
      status: 'not_started',
      mastery: 'started',
      orderIndex: 5,
      difficulty: 'medium',
      revisionCount: 0,
      notesSummary: 'Prophase, Metaphase, Anaphase, Telophase chromosome segregation checkpoints'
    },

    // Sub-2: Human Physiology
    {
      id: 'top-6',
      subjectId: 'sub-2',
      chapter: 'Unit 1: Cardiology',
      name: 'Cardiac Cycle & Blood Pressure Control',
      status: 'learning',
      mastery: 'learning',
      orderIndex: 1,
      difficulty: 'medium',
      lastStudiedDate: yesterday,
      revisionCount: 1,
      nextRevisionDate: tomorrow,
      notesSummary: 'Frank-Starling law, baroreceptor reflex in aortic arch and carotid sinus'
    },
    {
      id: 'top-7',
      subjectId: 'sub-2',
      chapter: 'Unit 2: Neurobiology',
      name: 'Action Potentials & Synaptic Transmission',
      status: 'not_started',
      mastery: 'started',
      orderIndex: 2,
      difficulty: 'hard',
      revisionCount: 0,
      notesSummary: 'Depolarization via voltage-gated Na+ channels; GABA vs glutamate'
    },

    // Sub-4: Quantitative Aptitude
    {
      id: 'top-8',
      subjectId: 'sub-4',
      chapter: 'Section 1: Arithmetic',
      name: 'Percentages & Profit-Loss Shortcuts',
      status: 'strong',
      mastery: 'mastered',
      orderIndex: 1,
      difficulty: 'easy',
      lastStudiedDate: getDateOffset(-6),
      revisionCount: 4,
      nextRevisionDate: inThreeDays,
      notesSummary: 'Successive percentage changes: a + b + (ab/100)'
    },
    {
      id: 'top-9',
      subjectId: 'sub-4',
      chapter: 'Section 2: Speed Math',
      name: 'Time, Speed & Distance / Work Ratios',
      status: 'revised',
      mastery: 'strong',
      orderIndex: 2,
      difficulty: 'medium',
      lastStudiedDate: getDateOffset(-3),
      revisionCount: 2,
      nextRevisionDate: today, // DUE TODAY!
      notesSummary: 'Relative speed in same direction = (u - v); opposite = (u + v)'
    },
    {
      id: 'top-10',
      subjectId: 'sub-4',
      chapter: 'Section 3: Data Analysis',
      name: 'Pie Charts & Data Interpretation Caselets',
      status: 'learning',
      mastery: 'practicing',
      orderIndex: 3,
      difficulty: 'medium',
      lastStudiedDate: yesterday,
      revisionCount: 1,
      nextRevisionDate: tomorrow,
      notesSummary: 'Degree to percentage conversion factor is 3.6 deg = 1%'
    }
  ];

  // Daily Missions with XP
  const tasks: Task[] = [
    {
      id: 'task-1',
      title: 'Revise Cell Biology: Membrane Transport',
      description: 'Review active transport, ion channels and osmosis practice diagrams',
      category: 'college',
      subjectId: 'sub-1',
      dueDate: today,
      priority: 'high',
      estimatedMinutes: 30,
      completed: false,
      createdAt: yesterday,
      xpReward: 15
    },
    {
      id: 'task-2',
      title: 'Solve 20 Quantitative Aptitude Practice MCQs',
      description: 'Time & Work problems from competitive question bank',
      category: 'competitive',
      subjectId: 'sub-4',
      dueDate: today,
      priority: 'high',
      estimatedMinutes: 45,
      completed: false,
      createdAt: yesterday,
      xpReward: 20
    },
    {
      id: 'task-3',
      title: 'Complete Chemistry Laboratory Assignment 2',
      description: 'Write up acid-base titration calculation results',
      category: 'college',
      subjectId: 'sub-3',
      dueDate: today,
      priority: 'medium',
      estimatedMinutes: 35,
      completed: true,
      completedAt: `${today}T09:30:00`,
      createdAt: twoDaysAgo,
      xpReward: 10
    },
    {
      id: 'task-4',
      title: '25-minute Pomodoro focus session on Physiology',
      description: 'Cardiac output calculation and baroreceptor mechanism',
      category: 'college',
      subjectId: 'sub-2',
      dueDate: today,
      priority: 'medium',
      estimatedMinutes: 25,
      completed: true,
      completedAt: `${today}T11:00:00`,
      createdAt: today,
      xpReward: 20
    }
  ];

  const upcomingExams: UpcomingExam[] = [
    {
      id: 'exam-1',
      title: 'Cell Biology Midterm Semester Examination',
      track: 'college',
      category: 'exam',
      subjectId: 'sub-1',
      dueDate: inThreeDays,
      time: '09:30 AM',
      weight: '25% of course grade',
      completed: false,
      notes: 'Units 1-4: Cell structures, enzymes, transport and energy synthesis'
    },
    {
      id: 'exam-2',
      title: 'National Competitive Exam All-India Mock #3',
      track: 'competitive',
      category: 'mock_test',
      subjectId: 'sub-4',
      dueDate: inFiveDays,
      time: '02:00 PM',
      weight: 'Rank Predictor Mock',
      completed: false,
      notes: '100 Questions: Quantitative Aptitude & General Awareness speed drill'
    }
  ];

  const focusSessions: FocusSession[] = [
    {
      id: 'foc-1',
      durationMinutes: 25,
      track: 'college',
      subjectId: 'sub-1',
      completedAt: `${today}T08:30:00`,
      xpEarned: 20
    },
    {
      id: 'foc-2',
      durationMinutes: 25,
      track: 'competitive',
      subjectId: 'sub-4',
      completedAt: `${today}T09:45:00`,
      xpEarned: 20
    },
    {
      id: 'foc-3',
      durationMinutes: 25,
      track: 'college',
      subjectId: 'sub-2',
      completedAt: `${yesterday}T14:15:00`,
      xpEarned: 20
    }
  ];

  const notes: QuickNote[] = [
    {
      id: 'note-1',
      title: 'Cellular Respiration Energy Balance Sheet',
      content: '1. Glycolysis: 1 Glucose -> 2 Pyruvate + 2 net ATP + 2 NADH.\n2. Pyruvate Oxidation: 2 Pyruvate -> 2 Acetyl-CoA + 2 NADH + 2 CO2.\n3. Krebs Cycle (2 turns): 2 ATP + 6 NADH + 2 FADH2 + 4 CO2.\n4. Oxidative Phosphorylation: ~28 ATP via ATP synthase.\nTotal: ~30-32 ATP per glucose molecule.',
      subjectId: 'sub-1',
      track: 'college',
      tags: ['CellBio', 'Metabolism', 'ATP'],
      isPinned: true,
      updatedAt: today
    },
    {
      id: 'note-2',
      title: 'Speed Math & Percentage Shortcuts',
      content: '• 1/6 = 16.66% | 1/7 = 14.28% | 1/8 = 12.5% | 1/9 = 11.11% | 1/12 = 8.33%\n• Compounded successive growth: net % = x + y + (xy/100)\n• Difference between CI and SI for 2 years: D = P * (R/100)^2\n• Time & Work: if A takes a days and B takes b days, together = (ab)/(a+b) days.',
      subjectId: 'sub-4',
      track: 'competitive',
      tags: ['Quant', 'Formulas', 'SpeedMath'],
      isPinned: true,
      updatedAt: yesterday
    }
  ];

  const activeDates = [
    getDateOffset(-5),
    getDateOffset(-4),
    getDateOffset(-3),
    getDateOffset(-2),
    getDateOffset(-1),
    today
  ];

  const gamification: GamificationState = {
    totalXp: 420,
    todayXp: 70,
    currentStreak: 6,
    lastActiveDate: today,
    activeDates,
    level: 2
  };

  return {
    profile: {
      name: studentName,
      collegeName: 'State University',
      collegeMajor: 'General Sciences & Pre-Professional Studies',
      collegeYear: '2nd Year',
      targetExam: 'National Competitive Exam 2027',
      targetExamDate: getDateOffset(90),
      dailyGoalHours: 5,
      dailyGoalSessions: 6,
      hasCompletedOnboarding: !isSample,
      isSampleContent: isSample
    },
    gamification,
    subjects,
    topics,
    tasks,
    upcomingExams,
    focusSessions,
    notes
  };
}

export function createCustomStudySpace(data: {
  name: string;
  collegeName: string;
  collegeSubjects: string[];
  targetExam: string;
  targetExamDate?: string;
  competitiveSubjects: string[];
}): AppState {
  const today = getTodayDateString();
  const colors: Array<'indigo' | 'emerald' | 'amber' | 'rose' | 'sky' | 'purple'> = [
    'indigo', 'emerald', 'amber', 'rose', 'sky', 'purple'
  ];

  const subjects: Subject[] = [];
  const topics: Topic[] = [];
  const tasks: Task[] = [];

  // Add user's college subjects
  data.collegeSubjects.forEach((subName, idx) => {
    const subId = `sub-col-${idx + 1}`;
    subjects.push({
      id: subId,
      name: subName.trim(),
      track: 'college',
      color: colors[idx % colors.length],
      description: `Coursework for ${data.collegeName}`
    });

    // Create 3 learning journey steps for this subject
    const starterTopics = [
      { name: `${subName.trim()}: Core Foundations`, mastery: 'strong' as const, status: 'strong' as const, order: 1, xp: 15 },
      { name: `${subName.trim()}: Key Theorems & Formulas`, mastery: 'learning' as const, status: 'learning' as const, order: 2, xp: 20 },
      { name: `${subName.trim()}: Advanced Problem Solving`, mastery: 'started' as const, status: 'not_started' as const, order: 3, xp: 25 }
    ];

    starterTopics.forEach((st, sIdx) => {
      topics.push({
        id: `top-col-${idx + 1}-${sIdx + 1}`,
        subjectId: subId,
        chapter: `Chapter ${sIdx + 1}`,
        name: st.name,
        status: st.status,
        mastery: st.mastery,
        orderIndex: st.order,
        difficulty: sIdx === 0 ? 'easy' : sIdx === 1 ? 'medium' : 'hard',
        lastStudiedDate: sIdx < 2 ? today : undefined,
        revisionCount: sIdx === 0 ? 2 : sIdx === 1 ? 1 : 0,
        nextRevisionDate: sIdx === 1 ? today : sIdx === 0 ? getDateOffset(3) : undefined,
        notesSummary: `Key insights and mastery milestones for ${subName.trim()}`
      });
    });

    // Create initial missions
    tasks.push({
      id: `task-col-${idx + 1}`,
      title: `Revise ${subName.trim()} Core Foundations`,
      description: `Review Chapter 1 notes and practice 5 formula derivations`,
      category: 'college',
      subjectId: subId,
      dueDate: today,
      priority: 'high',
      estimatedMinutes: 30,
      completed: false,
      createdAt: today,
      xpReward: 15
    });
  });

  // Add user's competitive subjects
  data.competitiveSubjects.forEach((subName, idx) => {
    const subId = `sub-comp-${idx + 1}`;
    subjects.push({
      id: subId,
      name: subName.trim(),
      track: 'competitive',
      color: colors[(idx + 2) % colors.length],
      description: `Target prep for ${data.targetExam}`
    });

    topics.push({
      id: `top-comp-${idx + 1}-1`,
      subjectId: subId,
      chapter: 'High-Yield Section 1',
      name: `${subName.trim()} Speed Drill & MCQs`,
      status: 'learning',
      mastery: 'learning',
      orderIndex: 1,
      difficulty: 'hard',
      lastStudiedDate: today,
      revisionCount: 1,
      nextRevisionDate: today,
      notesSummary: `Speed formulas and time management techniques`
    });

    tasks.push({
      id: `task-comp-${idx + 1}`,
      title: `Solve 15 ${subName.trim()} High-Yield MCQs`,
      description: `Timed practice drill: 2 minutes per question.`,
      category: 'competitive',
      subjectId: subId,
      dueDate: today,
      priority: 'high',
      estimatedMinutes: 35,
      completed: false,
      createdAt: today,
      xpReward: 20
    });
  });

  // Always include a focus session mission
  tasks.push({
    id: `task-focus-${Date.now()}`,
    title: 'Complete a 25-minute Pomodoro focus block',
    description: 'Deep uninterrupted focus on your top study priority',
    category: 'college',
    dueDate: today,
    priority: 'medium',
    estimatedMinutes: 25,
    completed: false,
    createdAt: today,
    xpReward: 20
  });

  const upcomingExams: UpcomingExam[] = [
    {
      id: `exam-main-${Date.now()}`,
      title: `${data.targetExam} Target Date`,
      track: 'competitive',
      category: 'exam',
      dueDate: data.targetExamDate || getDateOffset(90),
      time: '09:00 AM',
      weight: 'Primary Competitive Exam Target',
      completed: false,
      notes: `Keep steady daily streak and spaced revision consistency`
    }
  ];

  const starterNote: QuickNote = {
    id: `note-starter-${Date.now()}`,
    title: `My ${data.targetExam} Master Strategy`,
    content: `1. Keep the daily streak alive with at least 1 mission per day.\n2. Complete 4-5 Pomodoro focus sessions (+20 XP each).\n3. Never skip Spaced Revision due dates (+15 XP each).\n4. Reach Level 5 (Exam Ready) before test day!`,
    track: 'general',
    tags: ['Strategy', 'Roadmap', 'XP'],
    isPinned: true,
    updatedAt: today
  };

  const gamification: GamificationState = {
    totalXp: 100, // 100 welcome XP!
    todayXp: 100,
    currentStreak: 1,
    lastActiveDate: today,
    activeDates: [today],
    level: 1
  };

  return {
    profile: {
      name: data.name,
      collegeName: data.collegeName,
      collegeMajor: data.collegeSubjects[0] ? `${data.collegeSubjects[0]} & Academic Studies` : 'College Student',
      collegeYear: 'Current Term',
      targetExam: data.targetExam,
      targetExamDate: data.targetExamDate || getDateOffset(90),
      dailyGoalHours: 5,
      dailyGoalSessions: 6,
      hasCompletedOnboarding: true,
      isSampleContent: false
    },
    gamification,
    subjects,
    topics,
    tasks,
    upcomingExams,
    focusSessions: [],
    notes: [starterNote]
  };
}

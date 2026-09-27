export type TrackType = 'college' | 'competitive' | 'both';

export type TaskPriority = 'high' | 'medium' | 'low';

export type TopicMastery = 'started' | 'learning' | 'practicing' | 'strong' | 'mastered';
// Backward compatible alias
export type TopicStatus = 'not_started' | 'learning' | 'revised' | 'strong';

export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export type ExamCategory = 'exam' | 'assignment' | 'mock_test' | 'quiz' | 'project';

export interface StudentProfile {
  name: string;
  collegeName: string;
  collegeMajor: string;
  collegeYear: string;
  targetExam: string;
  targetExamDate?: string;
  dailyGoalHours: number;
  dailyGoalSessions: number;
  hasCompletedOnboarding: boolean;
  isSampleContent?: boolean;
}

export interface Subject {
  id: string;
  name: string;
  code?: string;
  track: TrackType;
  color: 'indigo' | 'emerald' | 'amber' | 'rose' | 'sky' | 'purple' | 'slate';
  description?: string;
}

export interface Topic {
  id: string;
  subjectId: string;
  chapter: string;
  name: string;
  status: TopicStatus;
  mastery?: TopicMastery;
  orderIndex?: number;
  difficulty: DifficultyLevel;
  lastStudiedDate?: string; // YYYY-MM-DD
  revisionCount: number;
  nextRevisionDate?: string; // YYYY-MM-DD
  notesSummary?: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  category: 'college' | 'competitive';
  subjectId?: string;
  dueDate: string; // YYYY-MM-DD
  priority: TaskPriority;
  estimatedMinutes: number;
  completed: boolean;
  completedAt?: string;
  createdAt: string;
  xpReward?: number;
}

export interface UpcomingExam {
  id: string;
  title: string;
  track: 'college' | 'competitive';
  category: ExamCategory;
  subjectId?: string;
  dueDate: string; // YYYY-MM-DD
  time?: string;
  weight?: string;
  completed: boolean;
  notes?: string;
}

export interface FocusSession {
  id: string;
  durationMinutes: number;
  track: 'college' | 'competitive';
  subjectId?: string;
  completedAt: string; // ISO date string
  xpEarned?: number;
}

export interface QuickNote {
  id: string;
  title: string;
  content: string;
  subjectId?: string;
  track: 'college' | 'competitive' | 'general';
  tags: string[];
  isPinned: boolean;
  updatedAt: string;
}

export interface GamificationState {
  totalXp: number;
  todayXp: number;
  currentStreak: number;
  lastActiveDate: string; // YYYY-MM-DD
  activeDates: string[]; // List of YYYY-MM-DD
  level: number;
  dailyBonusClaimedDate?: string; // YYYY-MM-DD when all daily missions bonus (+50 XP) was awarded
}

export interface AppState {
  profile: StudentProfile;
  gamification: GamificationState;
  subjects: Subject[];
  topics: Topic[];
  tasks: Task[];
  upcomingExams: UpcomingExam[];
  focusSessions: FocusSession[];
  notes: QuickNote[];
}

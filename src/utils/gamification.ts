import { TopicMastery } from '../types';

export interface LevelInfo {
  level: number;
  title: string;
  minXp: number;
  maxXp: number;
  currentProgressXp: number;
  neededForNextLevel: number;
  progressPercent: number;
}

export const LEVELS = [
  { level: 1, title: 'Getting Started', minXp: 0, maxXp: 200 },
  { level: 2, title: 'Consistent Learner', minXp: 200, maxXp: 500 },
  { level: 3, title: 'Focused Scholar', minXp: 500, maxXp: 1000 },
  { level: 4, title: 'Knowledge Builder', minXp: 1000, maxXp: 2000 },
  { level: 5, title: 'Exam Ready', minXp: 2000, maxXp: 4000 }
];

export function getLevelInfo(totalXp: number): LevelInfo {
  for (let i = 0; i < LEVELS.length; i++) {
    const lvl = LEVELS[i];
    if (totalXp <= lvl.maxXp || i === LEVELS.length - 1) {
      const range = lvl.maxXp - lvl.minXp;
      const currentProgressXp = Math.max(0, totalXp - lvl.minXp);
      const neededForNextLevel = Math.max(0, lvl.maxXp - totalXp);
      const progressPercent = Math.min(100, Math.round((currentProgressXp / range) * 100));

      return {
        level: lvl.level,
        title: lvl.title,
        minXp: lvl.minXp,
        maxXp: lvl.maxXp,
        currentProgressXp,
        neededForNextLevel,
        progressPercent
      };
    }
  }

  return {
    level: 5,
    title: 'Exam Ready',
    minXp: 2000,
    maxXp: 4000,
    currentProgressXp: 2000,
    neededForNextLevel: 0,
    progressPercent: 100
  };
}

export const MASTERY_CONFIG: Record<TopicMastery, { label: string; icon: string; color: string; badgeClass: string }> = {
  started: {
    label: 'Started',
    icon: '🌱',
    color: 'slate',
    badgeClass: 'bg-slate-100 text-slate-800 border-slate-300'
  },
  learning: {
    label: 'Learning',
    icon: '📖',
    color: 'amber',
    badgeClass: 'bg-amber-100 text-amber-950 border-amber-300'
  },
  practicing: {
    label: 'Practicing',
    icon: '💪',
    color: 'sky',
    badgeClass: 'bg-sky-100 text-sky-950 border-sky-300'
  },
  strong: {
    label: 'Strong',
    icon: '⭐',
    color: 'indigo',
    badgeClass: 'bg-indigo-100 text-indigo-950 border-indigo-300'
  },
  mastered: {
    label: 'Mastered',
    icon: '🏆',
    color: 'emerald',
    badgeClass: 'bg-emerald-100 text-emerald-950 border-emerald-300'
  }
};

export function getEncouragingMessage(progressPercent: number, streak: number, neededForNextLevel?: number): string {
  if (neededForNextLevel && neededForNextLevel <= 30 && neededForNextLevel > 0) {
    return "⭐ One more topic and you'll level up!";
  }
  if (progressPercent === 100) {
    return '🎉 All daily missions crushed! Take a well-deserved break or level up further!';
  }
  if (progressPercent >= 75) {
    return "🔥 You're on fire today! Just one more push to complete today's mission!";
  }
  if (progressPercent >= 50) {
    return "⚡ You're building momentum!";
  }
  if (streak >= 3) {
    return `🔥 ${streak}-day study streak! Consistency is your superpower.`;
  }
  if (progressPercent > 0) {
    return '✨ Small progress is still progress.';
  }
  return '🌱 Ready to unlock today’s learning mission? Start with a quick revision!';
}

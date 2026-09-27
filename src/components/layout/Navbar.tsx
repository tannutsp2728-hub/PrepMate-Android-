import React from 'react';
import { 
  GraduationCap, 
  Flame, 
  Timer, 
  Settings, 
  Plus, 
  CheckCircle2, 
  Calendar as CalendarIcon,
  Star,
  Award
} from 'lucide-react';
import { AppState } from '../../types';
import { getTodayDateString } from '../../data/sampleData';
import { getLevelInfo } from '../../utils/gamification';

interface NavbarProps {
  state: AppState;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenQuickAdd: () => void;
  onOpenSettings: () => void;
  timerActive: boolean;
  timerSecondsLeft: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  state,
  activeTab,
  setActiveTab,
  onOpenQuickAdd,
  onOpenSettings,
  timerActive,
  timerSecondsLeft
}) => {
  const today = getTodayDateString();
  const todayTasks = state.tasks.filter(t => t.dueDate === today);
  const completedTodayTasks = todayTasks.filter(t => t.completed);
  
  // Completed sessions today
  const todaySessions = state.focusSessions.filter(s => s.completedAt.startsWith(today));
  const todayFocusMinutes = todaySessions.reduce((acc, s) => acc + s.durationMinutes, 0);

  const levelInfo = getLevelInfo(state.gamification?.totalXp || 420);

  const formatTimerMinSec = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <header className="sticky top-0 z-30 bg-[#faf7f2]/95 backdrop-blur-md border-b border-amber-200/60 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setActiveTab('dashboard')} 
              className="flex items-center gap-2.5 text-left group focus:outline-none"
            >
              <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-900 border border-amber-300/80 flex items-center justify-center shadow-xs group-hover:bg-amber-200 transition-colors">
                <GraduationCap className="w-5 h-5 text-amber-700" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-lg text-slate-900 tracking-tight leading-tight">PrepMate</span>
                  <span className="text-[11px] font-extrabold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 hidden sm:inline">
                    Study Space
                  </span>
                </div>
                <p className="text-xs text-slate-600 font-bold truncate max-w-[160px] sm:max-w-xs">
                  {state.profile.name} · {state.profile.targetExam}
                </p>
              </div>
            </button>
          </div>

          {/* Quick Metrics & Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Gamification Pills: Streak 🔥 & Total XP ⭐ */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              {/* Streak */}
              <div 
                className="flex items-center gap-1 px-3 py-1.5 rounded-2xl bg-orange-50/80 border border-orange-200 text-amber-950 text-xs font-black shadow-2xs"
                title={`${state.gamification?.currentStreak || 1} day study streak`}
              >
                <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-400" />
                <span>{state.gamification?.currentStreak || 1}d</span>
              </div>

              {/* XP */}
              <div 
                className="flex items-center gap-1 px-3 py-1.5 rounded-2xl bg-amber-50/80 border border-amber-200 text-amber-950 text-xs font-black shadow-2xs"
                title={`${state.gamification?.totalXp || 420} Total XP · ${levelInfo.title}`}
              >
                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                <span>{state.gamification?.totalXp || 420} XP</span>
              </div>

              {/* Level Badge (Tablet/Desktop) */}
              <div 
                className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-emerald-950 text-xs font-black shadow-2xs"
                title={`Level ${levelInfo.level}: ${levelInfo.title}`}
              >
                <Award className="w-3.5 h-3.5 text-emerald-700" />
                <span>Lvl {levelInfo.level}</span>
              </div>
            </div>

            {/* Focus Timer status indicator */}
            {timerActive && (
              <button
                onClick={() => setActiveTab('timer')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-950 text-xs font-mono font-black shadow-xs transition-colors animate-pulse"
                title="Active Pomodoro Session"
              >
                <Timer className="w-3.5 h-3.5 text-rose-600" />
                <span>{formatTimerMinSec(timerSecondsLeft)}</span>
              </button>
            )}

            {/* Quick stats on desktop */}
            <div className="hidden lg:flex items-center gap-3 text-xs font-bold text-slate-700 border-l border-amber-200/80 pl-3">
              <div className="flex items-center gap-1.5" title="Tasks completed today">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>{completedTodayTasks.length}/{todayTasks.length}</span>
              </div>
              <div className="flex items-center gap-1.5" title="Focus time logged today">
                <Timer className="w-3.5 h-3.5 text-indigo-600" />
                <span>{todayFocusMinutes}m</span>
              </div>
            </div>

            {/* Add Task Button */}
            <button
              onClick={onOpenQuickAdd}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-slate-900 text-white text-xs sm:text-sm font-black hover:bg-slate-800 transition-colors shadow-xs focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-1 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">New Task</span>
            </button>

            {/* Student Settings/Profile Button */}
            <button
              onClick={onOpenSettings}
              className="p-2 rounded-2xl text-slate-700 hover:text-slate-950 hover:bg-amber-100/60 transition-colors focus:outline-none border border-amber-200/70 bg-white/70"
              title="Student Profile & Settings"
              aria-label="Settings"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

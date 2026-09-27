import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  Calendar as CalendarIcon, 
  RotateCcw, 
  GraduationCap, 
  Target, 
  Plus, 
  ArrowRight, 
  Timer, 
  BookOpen, 
  Check, 
  Flame,
  Star,
  Award,
  Sparkles,
  Zap,
  TrendingUp,
  Brain,
  ChevronRight,
  Info
} from 'lucide-react';
import { AppState, Task, Topic, UpcomingExam } from '../../types';
import { getTodayDateString, getDateOffset } from '../../data/sampleData';
import { getLevelInfo, getEncouragingMessage, MASTERY_CONFIG } from '../../utils/gamification';

import { 
  StudyCompanion, 
  CampfireStreakIllustration, 
  StarTrophyIllustration, 
  SproutPlantIllustration, 
  BrainSparkIllustration, 
  StackOfBooksIllustration 
} from '../illustrations/StudyIllustrations';

interface DashboardViewProps {
  state: AppState;
  onToggleTask: (taskId: string) => void;
  onQuickMarkRevised: (topicId: string) => void;
  onReviseNow: (topic: Topic) => void;
  onNavigateTab: (tab: string) => void;
  onOpenTaskModal: () => void;
  onOpenExamModal: () => void;
  onOpenSettings: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  state,
  onToggleTask,
  onQuickMarkRevised,
  onReviseNow,
  onNavigateTab,
  onOpenTaskModal,
  onOpenExamModal,
  onOpenSettings
}) => {
  const today = getTodayDateString();

  // Dynamic greeting based on time of day
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  // Level & XP
  const levelInfo = getLevelInfo(state.gamification?.totalXp || 420);

  // Today's Missions
  const todayMissions = state.tasks.filter((t) => t.dueDate === today);
  const completedMissions = todayMissions.filter((t) => t.completed);
  const missionProgressPct = todayMissions.length > 0 
    ? Math.round((completedMissions.length / todayMissions.length) * 100) 
    : 0;

  // Encouraging message
  const encouragingMessage = getEncouragingMessage(
    missionProgressPct,
    state.gamification?.currentStreak || 1,
    levelInfo.neededForNextLevel
  );

  // Weekly streak days (last 7 days: Mon -> Sun)
  const daysOfWeek = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
  // Map last 7 days ending today
  const activeDateSet = new Set(state.gamification?.activeDates || [today]);

  const streakDaysList = [-6, -5, -4, -3, -2, -1, 0].map((offset) => {
    const dStr = getDateOffset(offset);
    const dateObj = new Date(dStr + 'T00:00:00');
    // Day of week index (0=Sun, 1=Mon...): map to Mon=0..Sun=6
    const dayIndex = (dateObj.getDay() + 6) % 7;
    const isCompleted = activeDateSet.has(dStr) || offset === 0;
    return {
      dateStr: dStr,
      dayLabel: daysOfWeek[dayIndex],
      isCompleted,
      isToday: offset === 0
    };
  });

  // Weekly progress calculation
  const last7DaysStrings = [-6, -5, -4, -3, -2, -1, 0].map(offset => getDateOffset(offset));
  const weekSessions = state.focusSessions.filter(s => {
    const sDate = s.completedAt.split('T')[0];
    return last7DaysStrings.includes(sDate);
  });
  const totalWeeklyMinutes = weekSessions.reduce((acc, s) => acc + s.durationMinutes, 0);
  const totalWeeklyHours = (totalWeeklyMinutes / 60).toFixed(1);
  const weeklyGoalHours = (state.profile.dailyGoalHours || 3) * 6;
  const weeklyGoalPct = Math.min(100, Math.round(((totalWeeklyMinutes / 60) / weeklyGoalHours) * 100));

  const dailyFocusBars = [-6, -5, -4, -3, -2, -1, 0].map((offset) => {
    const dStr = getDateOffset(offset);
    const dateObj = new Date(dStr + 'T00:00:00');
    const dayLabel = daysOfWeek[(dateObj.getDay() + 6) % 7];
    const daySessions = state.focusSessions.filter(s => s.completedAt.startsWith(dStr));
    const mins = daySessions.reduce((acc, s) => acc + s.durationMinutes, 0);
    return {
      dayLabel,
      mins,
      isToday: offset === 0
    };
  });
  const maxDayMins = Math.max(...dailyFocusBars.map(b => b.mins), 60);

  // Topics completed / mastered
  const totalTopics = state.topics.length;
  const masteredTopics = state.topics.filter(
    (t) => t.mastery === 'strong' || t.mastery === 'mastered' || t.status === 'strong'
  ).length;

  // Revisions due
  const dueRevisionTopics = state.topics.filter((t) => t.nextRevisionDate && t.nextRevisionDate <= today);

  // Upcoming Exams
  const sortedExams = [...state.upcomingExams]
    .filter((e) => !e.completed)
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate));

  const getDaysLeft = (targetDateStr: string) => {
    const target = new Date(targetDateStr + 'T00:00:00');
    const now = new Date(today + 'T00:00:00');
    const diffTime = target.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays < 0) return `${Math.abs(diffDays)}d overdue`;
    return `${diffDays} days left`;
  };

  const getSubject = (subId?: string) => state.subjects.find((s) => s.id === subId);

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      {/* Sample Banner if exploring sample data */}
      {state.profile.isSampleContent && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-sm">
          <div className="flex items-center gap-2.5 text-amber-950 font-medium">
            <Info className="w-5 h-5 text-amber-700 shrink-0" />
            <div>
              <span className="font-extrabold">Sample Study Space Active: </span>
              <span>Cell Biology, Human Physiology, General Chemistry, Quantitative Aptitude.</span>
            </div>
          </div>
          <button
            onClick={onOpenSettings}
            className="px-3.5 py-1.5 rounded-xl bg-amber-900 hover:bg-amber-950 text-white font-bold text-xs shrink-0 transition-colors"
          >
            Customize My Space
          </button>
        </div>
      )}

      {/* HERO SECTION: Greeting & Fun Gamified Status Cards */}
      <div className="bg-white rounded-3xl border border-amber-200/70 p-6 sm:p-8 shadow-xs relative overflow-hidden bg-gradient-to-br from-white via-[#fffdfa] to-amber-50/40">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="max-w-xl">
            <div className="flex items-center gap-2 text-xs font-black text-amber-800 uppercase tracking-wider mb-2">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span>Target Exam: {state.profile.targetExam}</span>
              {state.profile.targetExamDate && (
                <>
                  <span className="text-amber-300">·</span>
                  <span className="text-slate-500 font-bold">{state.profile.targetExamDate}</span>
                </>
              )}
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <span>{greeting}, {state.profile.name}!</span>
              <span className="inline-block hover:rotate-12 transition-transform cursor-pointer">👋</span>
            </h1>
            <p className="text-sm sm:text-base font-bold text-slate-700 mt-2 leading-relaxed">
              {encouragingMessage}
            </p>

            <div className="mt-5 flex items-center gap-3 flex-wrap">
              <button
                onClick={() => onNavigateTab('timer')}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs sm:text-sm shadow-md transition-all active:scale-95"
              >
                <Timer className="w-4 h-4 text-amber-400" />
                <span>Start 25m Focus (+20 XP)</span>
              </button>

              <button
                onClick={() => onNavigateTab('planner')}
                className="inline-flex items-center gap-1.5 px-4 py-3 rounded-2xl bg-amber-100/70 hover:bg-amber-100 text-amber-950 font-extrabold text-xs sm:text-sm transition-all border border-amber-200 active:scale-95"
              >
                <BookOpen className="w-4 h-4 text-amber-700" />
                <span>Study Journey</span>
              </button>
            </div>
          </div>

          {/* Cute Study Companion Mascot Illustration */}
          <div className="hidden sm:flex items-center justify-center shrink-0 pr-2">
            <div className="relative group">
              <StudyCompanion size={108} />
              <div className="absolute -bottom-2 -left-2 bg-white/95 px-2.5 py-1 rounded-full text-[10px] font-black text-slate-700 shadow-xs border border-amber-200/80 whitespace-nowrap">
                Pip · Study Buddy ✨
              </div>
            </div>
          </div>
        </div>

        {/* 3 Prominent Gamified Cards: Streak 🔥, XP ⭐, Level Progress */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-amber-200/60">
          {/* Card 1: Daily Study Streak 🔥 */}
          <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-br from-amber-50/90 to-orange-50/50 border border-amber-200/90 shadow-2xs flex flex-col justify-between relative overflow-hidden">
            <div className="flex items-start justify-between mb-2">
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-amber-950 flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-amber-600 fill-amber-500" />
                  <span>Daily Study Streak</span>
                </span>
                <span className="text-xs font-bold text-amber-800">Consistency pays off!</span>
              </div>
              <div className="shrink-0 -mr-1 -mt-1">
                <CampfireStreakIllustration size={44} />
              </div>
            </div>

            <div className="flex items-baseline gap-2 my-1">
              <span className="text-3xl sm:text-4xl font-black text-amber-950">
                {state.gamification?.currentStreak || 1}
              </span>
              <span className="text-sm font-extrabold text-amber-800">day streak 🔥</span>
            </div>

            {/* Streak Calendar Mini Row */}
            <div className="flex items-center justify-between gap-1 pt-3 border-t border-amber-200/60 mt-2">
              {streakDaysList.map((d, i) => (
                <div key={i} className="flex flex-col items-center">
                  <span className="text-[10px] font-black text-amber-900 mb-1">{d.dayLabel}</span>
                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold transition-transform ${
                      d.isCompleted
                        ? 'bg-amber-500 text-white shadow-xs'
                        : 'bg-white/80 border border-amber-300 text-slate-400'
                    }`}
                  >
                    {d.isCompleted ? '🔥' : '○'}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Card 2: XP Earned Today & Total ⭐ */}
          <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-br from-amber-50/60 via-yellow-50/40 to-indigo-50/30 border border-amber-200/90 shadow-2xs flex flex-col justify-between relative overflow-hidden">
            <div className="flex items-start justify-between mb-2">
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-indigo-950 flex items-center gap-1.5">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
                  <span>Experience Points</span>
                </span>
                <span className="text-xs font-extrabold text-indigo-800">+{state.gamification?.todayXp || 0} XP Today</span>
              </div>
              <div className="shrink-0 -mr-1 -mt-1">
                <StarTrophyIllustration size={44} />
              </div>
            </div>

            <div className="flex items-baseline gap-2 my-1">
              <span className="text-3xl sm:text-4xl font-black text-indigo-950">
                {state.gamification?.totalXp || 420}
              </span>
              <span className="text-sm font-extrabold text-indigo-800">Total XP ⭐</span>
            </div>

            <div className="pt-3 border-t border-amber-200/60 text-xs font-black text-indigo-900 flex items-center justify-between">
              <span>Task: +10</span>
              <span>Focus: +20</span>
              <span>Revise: +15</span>
              <span className="text-amber-700">Missions: +50</span>
            </div>
          </div>

          {/* Card 3: Visual Level Progress */}
          <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-br from-emerald-50/80 to-teal-50/40 border border-emerald-200/90 shadow-2xs flex flex-col justify-between relative overflow-hidden">
            <div className="flex items-start justify-between mb-2">
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-emerald-950 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-emerald-700" />
                  <span>LEVEL {levelInfo.level}</span>
                </span>
                <span className="text-xs font-black text-emerald-800 block mt-0.5">
                  {levelInfo.title}
                </span>
              </div>
              <div className="shrink-0 -mr-1 -mt-1">
                <SproutPlantIllustration size={44} />
              </div>
            </div>

            <div className="my-1">
              <div className="flex justify-between text-xs font-black text-emerald-950 mb-1.5">
                <span>Next: {levelInfo.level < 5 ? `Level ${levelInfo.level + 1}` : 'Max Master'}</span>
                <span>{levelInfo.currentProgressXp} / {levelInfo.maxXp - levelInfo.minXp} XP</span>
              </div>
              <div className="w-full bg-emerald-200/80 rounded-full h-3 overflow-hidden shadow-inner border border-emerald-300/40">
                <div
                  className="bg-emerald-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${levelInfo.progressPercent}%` }}
                />
              </div>
            </div>

            <div className="text-[11px] font-bold text-emerald-900 pt-2 border-t border-emerald-200/60">
              {levelInfo.neededForNextLevel > 0 
                ? `${levelInfo.neededForNextLevel} XP needed to level up!` 
                : '🏆 Top Scholar Tier Reached!'}
            </div>
          </div>
        </div>
      </div>

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
        {/* Left Column: Today's Missions 🎯 & Topics Due for Revision 🧠 */}
        <div className="lg:col-span-7 space-y-6 sm:space-y-8">
          {/* Today's Missions Card */}
          <div className="bg-white rounded-3xl border border-slate-300 p-5 sm:p-7 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl">🎯</span>
                  <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
                    Today's Missions
                  </h2>
                </div>
                <p className="text-xs sm:text-sm font-semibold text-slate-700 mt-0.5">
                  Complete missions to earn XP and level up your study rank
                </p>
              </div>

              {/* Progress pill */}
              <div className="flex items-center gap-2">
                <div className="text-right">
                  <span className="text-xs font-extrabold text-slate-900 block">{missionProgressPct}%</span>
                  <span className="text-[10px] font-bold text-slate-500">
                    {completedMissions.length}/{todayMissions.length} done
                  </span>
                </div>
                <button
                  onClick={onOpenTaskModal}
                  className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white shadow-xs"
                  title="Add new study mission"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Mission Progress Bar */}
            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden mb-5 border border-slate-200">
              <div
                className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${missionProgressPct}%` }}
              />
            </div>

            {todayMissions.length === 0 ? (
              <div className="py-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                <p className="text-sm font-bold text-slate-700">No active missions for today.</p>
                <button
                  onClick={onOpenTaskModal}
                  className="mt-2 text-xs font-bold text-indigo-700 hover:text-indigo-900 underline"
                >
                  + Add your first study mission
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {todayMissions.map((mission) => {
                  const subject = getSubject(mission.subjectId);
                  const isCollege = mission.category === 'college';
                  const xp = mission.xpReward || 15;

                  return (
                    <div
                      key={mission.id}
                      onClick={() => onToggleTask(mission.id)}
                      className={`group p-4 rounded-2xl border transition-all cursor-pointer flex items-start sm:items-center justify-between gap-3 ${
                        mission.completed
                          ? 'bg-slate-100/80 border-slate-300 text-slate-500'
                          : 'bg-white border-slate-300 hover:border-slate-400 hover:shadow-xs text-slate-900'
                      }`}
                    >
                      <div className="flex items-start gap-3.5 min-w-0 flex-1">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleTask(mission.id);
                          }}
                          className="mt-0.5 text-slate-400 group-hover:text-indigo-600 transition-colors focus:outline-none shrink-0"
                        >
                          {mission.completed ? (
                            <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                          ) : (
                            <Circle className="w-6 h-6 stroke-[2]" />
                          )}
                        </button>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 text-xs font-bold mb-1 flex-wrap">
                            <span className={isCollege ? 'text-indigo-900' : 'text-amber-900'}>
                              {isCollege ? 'College' : 'Competitive'}
                            </span>
                            {subject && (
                              <>
                                <span className="text-slate-400 font-bold">·</span>
                                <span className="text-slate-700 truncate max-w-[150px]">
                                  {subject.name}
                                </span>
                              </>
                            )}
                            <span className="text-slate-400 font-bold">·</span>
                            <span className="text-slate-600 flex items-center gap-1 font-mono text-[11px]">
                              <Clock className="w-3 h-3 text-slate-500" />
                              {mission.estimatedMinutes}m
                            </span>
                          </div>

                          <h4 className={`text-sm sm:text-base font-extrabold leading-snug ${
                            mission.completed ? 'line-through text-slate-500' : 'text-slate-900'
                          }`}>
                            {mission.title}
                          </h4>
                        </div>
                      </div>

                      {/* XP Badge */}
                      <div className="shrink-0 flex items-center">
                        <span
                          className={`text-xs font-black px-2.5 py-1 rounded-xl border ${
                            mission.completed
                              ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                              : 'bg-amber-50 text-amber-900 border-amber-300'
                          }`}
                        >
                          +{xp} XP ⭐
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Topics Due for Revision 🧠 */}
          <div className="bg-white rounded-3xl border border-amber-200/70 p-5 sm:p-7 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="shrink-0">
                  <BrainSparkIllustration size={42} />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                    Topics Due for Revision
                  </h2>
                  <p className="text-xs sm:text-sm font-semibold text-slate-600">
                    Spaced memory retention (+15 XP per revision)
                  </p>
                </div>
              </div>
              <button
                onClick={() => onNavigateTab('revision')}
                className="text-xs sm:text-sm font-bold text-amber-900 hover:text-amber-950 flex items-center gap-1"
              >
                <span>View All ({dueRevisionTopics.length})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {dueRevisionTopics.length === 0 ? (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 flex items-center gap-3">
                <Check className="w-5 h-5 text-emerald-700 shrink-0" />
                <p className="text-xs sm:text-sm text-emerald-950 font-bold">
                  All caught up on revisions for today! Your retention strength is soaring.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {dueRevisionTopics.slice(0, 3).map((topic) => {
                  const subject = getSubject(topic.subjectId);
                  return (
                    <div
                      key={topic.id}
                      className="p-4 rounded-2xl border border-slate-300 bg-slate-50/70 hover:bg-white transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-700 mb-1">
                          <span className="text-indigo-900">{subject?.name || 'Subject'}</span>
                          <span>·</span>
                          <span>{topic.chapter}</span>
                          <span>·</span>
                          <span className="text-rose-700 font-extrabold">Due Today</span>
                        </div>
                        <h4 className="text-sm sm:text-base font-extrabold text-slate-900 truncate">
                          {topic.name}
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-slate-600 font-medium mt-1">
                          <span>Revision stage: {topic.revisionCount} / 5</span>
                          <span>·</span>
                          <span>Last studied: {topic.lastStudiedDate || 'Earlier'}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => onReviseNow(topic)}
                          className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
                          title="Start focus timer for this revision"
                        >
                          <Timer className="w-3.5 h-3.5 text-amber-400" />
                          <span>Revise Now</span>
                        </button>
                        <button
                          onClick={() => onQuickMarkRevised(topic.id)}
                          className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
                          title="Mark completed (+15 XP)"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Complete (+15 XP)</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Visual Progress, Mastery Map Snippet & Deadlines (5 cols) */}
        <div className="lg:col-span-5 space-y-6 sm:space-y-8">
          {/* Weekly Progress 📈 Card */}
          <div className="bg-white rounded-3xl border border-slate-300 p-5 sm:p-7 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-xl">📈</span>
                <div>
                  <h2 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
                    Weekly Progress
                  </h2>
                  <p className="text-xs text-slate-700 font-semibold">
                    {totalWeeklyHours} hrs focus logged this week
                  </p>
                </div>
              </div>
              <button
                onClick={() => onNavigateTab('progress')}
                className="text-xs font-bold text-indigo-700 hover:text-indigo-900 flex items-center gap-1"
              >
                <span>Analytics</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Weekly Target Progress bar */}
            <div className="mb-4">
              <div className="flex justify-between text-xs font-extrabold text-slate-800 mb-1">
                <span>Goal: {weeklyGoalHours}h / week</span>
                <span>{weeklyGoalPct}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200">
                <div
                  className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${weeklyGoalPct}%` }}
                />
              </div>
            </div>

            {/* Mini 7-day Bar Chart */}
            <div className="flex items-end justify-between gap-1.5 pt-2 pb-1 border-t border-slate-100 h-24">
              {dailyFocusBars.map((b, idx) => {
                const heightPct = Math.max(8, Math.round((b.mins / maxDayMins) * 100));
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                    <span className="text-[10px] font-mono font-bold text-slate-500">
                      {b.mins > 0 ? `${b.mins}m` : '-'}
                    </span>
                    <div className="w-full max-w-[28px] bg-slate-100 rounded-lg overflow-hidden flex items-end h-14">
                      <div
                        className={`w-full rounded-md transition-all duration-500 ${
                          b.isToday
                            ? 'bg-amber-500'
                            : b.mins > 0
                            ? 'bg-indigo-500'
                            : 'bg-slate-200'
                        }`}
                        style={{ height: `${heightPct}%` }}
                      />
                    </div>
                    <span className={`text-[10px] font-black ${b.isToday ? 'text-indigo-700' : 'text-slate-600'}`}>
                      {b.dayLabel}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Topics Completed / Learning Journey Card */}
          <div className="bg-white rounded-3xl border border-amber-200/70 p-5 sm:p-7 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="shrink-0">
                  <StackOfBooksIllustration size={42} />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                    Topics Completed
                  </h2>
                  <p className="text-xs text-slate-600 font-semibold">
                    {masteredTopics} of {totalTopics} concepts mastered
                  </p>
                </div>
              </div>

              <button
                onClick={() => onNavigateTab('planner')}
                className="text-xs font-bold text-amber-900 hover:text-amber-950 flex items-center gap-1"
              >
                <span>Roadmap</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Visual Subject Progress */}
            <div className="space-y-3">
              {state.subjects.slice(0, 3).map((sub) => {
                const subTopics = state.topics.filter((t) => t.subjectId === sub.id);
                const done = subTopics.filter(
                  (t) => t.mastery === 'strong' || t.mastery === 'mastered' || t.status === 'strong'
                ).length;
                const pct = subTopics.length > 0 ? Math.round((done / subTopics.length) * 100) : 0;

                return (
                  <div key={sub.id} className="p-3 rounded-2xl border border-slate-200 bg-slate-50">
                    <div className="flex justify-between text-xs font-bold text-slate-900 mb-1.5">
                      <span className="truncate max-w-[180px]">{sub.name}</span>
                      <span>{pct}% ({done}/{subTopics.length})</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-2 rounded-full ${
                          sub.track === 'college' ? 'bg-indigo-600' : 'bg-amber-500'
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Upcoming Exams Card */}
          <div className="bg-white rounded-3xl border border-slate-300 p-5 sm:p-7 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-xl">🏆</span>
                <div>
                  <h2 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
                    Exam Countdown
                  </h2>
                  <p className="text-xs text-slate-700 font-semibold">Targets & Deadlines</p>
                </div>
              </div>
              <button
                onClick={onOpenExamModal}
                className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {sortedExams.length === 0 ? (
              <p className="text-xs text-slate-600 py-4 text-center">No upcoming deadlines.</p>
            ) : (
              <div className="space-y-3">
                {sortedExams.slice(0, 3).map((exam) => {
                  const daysLeft = getDaysLeft(exam.dueDate);
                  const isUrgent = daysLeft.includes('Today') || daysLeft.includes('Tomorrow') || daysLeft.includes('2 days') || daysLeft.includes('3 days');

                  return (
                    <div
                      key={exam.id}
                      className="p-3.5 rounded-2xl border border-slate-300 bg-white shadow-xs"
                    >
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <span className="text-xs font-bold text-indigo-900 capitalize">
                          {exam.track} · {exam.category.replace('_', ' ')}
                        </span>
                        <span
                          className={`text-[11px] font-mono font-extrabold px-2 py-0.5 rounded-md ${
                            isUrgent ? 'bg-rose-100 text-rose-950 border border-rose-300' : 'bg-slate-100 text-slate-900'
                          }`}
                        >
                          {daysLeft}
                        </span>
                      </div>
                      <h4 className="text-sm font-extrabold text-slate-900 leading-snug">
                        {exam.title}
                      </h4>
                      <div className="text-xs text-slate-600 font-semibold mt-1">
                        {exam.dueDate} {exam.time && `· ${exam.time}`}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

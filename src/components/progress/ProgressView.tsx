import React from 'react';
import { 
  TrendingUp, 
  CheckCircle2, 
  Timer, 
  BookOpen, 
  RotateCcw, 
  GraduationCap, 
  Target, 
  Award, 
  Flame,
  Calendar,
  Star,
  Sparkles,
  Zap
} from 'lucide-react';
import { AppState } from '../../types';
import { getTodayDateString, getDateOffset } from '../../data/sampleData';
import { getLevelInfo, LEVELS } from '../../utils/gamification';

interface ProgressViewProps {
  state: AppState;
}

export const ProgressView: React.FC<ProgressViewProps> = ({ state }) => {
  const today = getTodayDateString();

  // Gamification info
  const levelInfo = getLevelInfo(state.gamification?.totalXp || 420);
  const activeDateSet = new Set(state.gamification?.activeDates || [today]);
  const daysOfWeek = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

  const streakDaysList = [-6, -5, -4, -3, -2, -1, 0].map((offset) => {
    const dStr = getDateOffset(offset);
    const dateObj = new Date(dStr + 'T00:00:00');
    const dayIndex = (dateObj.getDay() + 6) % 7;
    const isCompleted = activeDateSet.has(dStr) || offset === 0;
    return {
      dateStr: dStr,
      dayLabel: daysOfWeek[dayIndex],
      isCompleted,
      isToday: offset === 0
    };
  });

  // Metrics calculation
  const totalTasks = state.tasks.length;
  const completedTasks = state.tasks.filter(t => t.completed).length;
  const taskCompletionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // College vs Competitive Tasks
  const collegeTasks = state.tasks.filter(t => t.category === 'college');
  const competitiveTasks = state.tasks.filter(t => t.category === 'competitive');
  const collegeDone = collegeTasks.filter(t => t.completed).length;
  const competitiveDone = competitiveTasks.filter(t => t.completed).length;

  // Focus Minutes
  const totalFocusMinutes = state.focusSessions.reduce((acc, s) => acc + s.durationMinutes, 0);
  const collegeFocusMinutes = state.focusSessions
    .filter(s => s.track === 'college')
    .reduce((acc, s) => acc + s.durationMinutes, 0);
  const competitiveFocusMinutes = state.focusSessions
    .filter(s => s.track === 'competitive')
    .reduce((acc, s) => acc + s.durationMinutes, 0);

  // Topics breakdown
  const totalTopics = state.topics.length;
  const strongTopics = state.topics.filter(t => t.status === 'strong').length;
  const revisedTopics = state.topics.filter(t => t.status === 'revised').length;
  const learningTopics = state.topics.filter(t => t.status === 'learning').length;
  const notStartedTopics = state.topics.filter(t => t.status === 'not_started').length;

  // 7-day past activity breakdown (Mon - Sun or last 7 days)
  const last7Days = [-6, -5, -4, -3, -2, -1, 0].map(offset => {
    const dateStr = getDateOffset(offset);
    const dateObj = new Date(dateStr + 'T00:00:00');
    const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });

    // Focus sessions for this day
    const daySessions = state.focusSessions.filter(s => s.completedAt.startsWith(dateStr));
    const collegeMins = daySessions.filter(s => s.track === 'college').reduce((acc, s) => acc + s.durationMinutes, 0);
    const compMins = daySessions.filter(s => s.track === 'competitive').reduce((acc, s) => acc + s.durationMinutes, 0);
    const totalDayMins = collegeMins + compMins;

    // Completed tasks for this day
    const completedOnDay = state.tasks.filter(t => t.completedAt?.startsWith(dateStr)).length;

    return {
      dateStr,
      dayName,
      collegeMins,
      compMins,
      totalDayMins,
      completedOnDay
    };
  });

  const maxDailyMinutes = Math.max(120, ...last7Days.map(d => d.totalDayMins));

  // Time allocation percentage
  const totalTrackMinutes = collegeFocusMinutes + competitiveFocusMinutes;
  const collegeTrackPct = totalTrackMinutes > 0 ? Math.round((collegeFocusMinutes / totalTrackMinutes) * 100) : 50;
  const compTrackPct = 100 - collegeTrackPct;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-300 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-700 uppercase tracking-wider mb-1">
            <TrendingUp className="w-4 h-4 text-indigo-600" />
            <span>Study Performance & Analytics</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Academic & Exam Progress
          </h1>
          <p className="text-xs sm:text-sm text-slate-700 font-medium mt-0.5">
            Real-time tracking of study consistency, deep focus allocation, and concept mastery
          </p>
        </div>

        {/* Target goal callout */}
        <div className="px-4 py-2.5 rounded-xl bg-slate-100 border border-slate-300 text-xs text-slate-800 font-bold">
          <span>Daily Target: </span>
          <strong className="text-slate-950 font-extrabold">{state.profile.dailyGoalHours} hours</strong>
          <span className="text-slate-600 font-semibold"> ({state.profile.dailyGoalSessions} focus sessions)</span>
        </div>
      </div>

      {/* Gamification Level & Streak Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Level Progression Card */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-300 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-black uppercase tracking-wider text-emerald-950 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-emerald-700" />
              <span>Academic Rank & XP Progress</span>
            </span>
            <span className="text-xs font-black px-2.5 py-0.5 rounded-lg bg-emerald-100 text-emerald-950 border border-emerald-300">
              LEVEL {levelInfo.level} · {levelInfo.title}
            </span>
          </div>

          <div className="my-2">
            <div className="flex justify-between text-xs font-black text-slate-900 mb-1.5">
              <span>{levelInfo.title}</span>
              <span>{levelInfo.currentProgressXp} / {levelInfo.maxXp - levelInfo.minXp} XP</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-3.5 overflow-hidden border border-slate-200">
              <div
                className="bg-emerald-600 h-3.5 rounded-full transition-all duration-500"
                style={{ width: `${levelInfo.progressPercent}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-5 gap-1.5 pt-3 border-t border-slate-100 mt-2">
            {LEVELS.map((lvl) => {
              const isCurrent = lvl.level === levelInfo.level;
              const isPassed = lvl.level < levelInfo.level;
              return (
                <div key={lvl.level} className="text-center">
                  <div
                    className={`h-1.5 rounded-full mb-1 ${
                      isPassed || isCurrent ? 'bg-emerald-600' : 'bg-slate-200'
                    }`}
                  />
                  <span className={`text-[10px] font-black block truncate ${
                    isCurrent ? 'text-emerald-900 font-black' : 'text-slate-500 font-semibold'
                  }`}>
                    L{lvl.level}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Weekly Study Streak Calendar Card */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-300 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-black uppercase tracking-wider text-amber-950 flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-amber-600 fill-amber-500" />
              <span>Weekly Streak Calendar</span>
            </span>
            <span className="text-xs font-extrabold text-amber-900">
              {state.gamification?.currentStreak || 1} Days Active 🔥
            </span>
          </div>

          {/* 7 Days Row */}
          <div className="flex items-center justify-between gap-1.5 py-2">
            {streakDaysList.map((d, i) => (
              <div key={i} className="flex flex-col items-center flex-1">
                <span className="text-[10px] font-extrabold text-slate-700 mb-1">{d.dayLabel}</span>
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold transition-transform ${
                    d.isCompleted
                      ? 'bg-amber-500 text-white shadow-xs'
                      : 'bg-slate-100 border border-slate-300 text-slate-400'
                  }`}
                >
                  {d.isCompleted ? '🔥' : '○'}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 text-xs font-bold text-slate-600 flex items-center justify-between">
            <span>Study daily to protect your streak</span>
            <span className="text-amber-900 font-extrabold">Next Milestone: 7 Days</span>
          </div>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-300 shadow-xs">
          <div className="flex items-center justify-between text-slate-700 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Focus</span>
            <Timer className="w-4 h-4 text-indigo-700" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-950">
            {Math.floor(totalFocusMinutes / 60)}h {totalFocusMinutes % 60}m
          </div>
          <p className="text-xs text-slate-700 mt-1 font-semibold">
            {state.focusSessions.length} total Pomodoro cycles
          </p>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-300 shadow-xs">
          <div className="flex items-center justify-between text-slate-700 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Tasks Done</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-950">
            {completedTasks} / {totalTasks}
          </div>
          <p className="text-xs text-slate-700 mt-1 font-semibold">
            {taskCompletionRate}% completion rate
          </p>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-300 shadow-xs">
          <div className="flex items-center justify-between text-slate-700 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Mastered Topics</span>
            <Award className="w-4 h-4 text-amber-700" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-950">
            {strongTopics} / {totalTopics}
          </div>
          <p className="text-xs text-slate-700 mt-1 font-semibold">
            {totalTopics > 0 ? Math.round((strongTopics / totalTopics) * 100) : 0}% strong retention
          </p>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-300 shadow-xs">
          <div className="flex items-center justify-between text-slate-700 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Active Subjects</span>
            <BookOpen className="w-4 h-4 text-sky-700" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-950">
            {state.subjects.length}
          </div>
          <p className="text-xs text-slate-700 mt-1 font-semibold">
            College & Exam syllabus courses
          </p>
        </div>
      </div>

      {/* 7-Day Study Hours Visual Bar Chart */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-300 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <h3 className="font-extrabold text-base sm:text-lg text-slate-900">Weekly Study Minutes (Past 7 Days)</h3>
            <p className="text-xs sm:text-sm text-slate-700 font-medium">Distribution between College coursework and Competitive Exam prep</p>
          </div>
          <div className="flex items-center gap-4 text-xs font-bold">
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded bg-indigo-700 inline-block" />
              <span className="text-slate-800">College Studies</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded bg-amber-600 inline-block" />
              <span className="text-slate-800">Competitive Exam</span>
            </div>
          </div>
        </div>

        {/* Bar Chart Container */}
        <div className="grid grid-cols-7 gap-2 sm:gap-4 h-56 pt-8 pb-2 items-end border-b border-slate-200">
          {last7Days.map((day) => {
            const heightPercent = maxDailyMinutes > 0 
              ? Math.min(100, Math.round((day.totalDayMins / maxDailyMinutes) * 100)) 
              : 0;

            const collegePartPercent = day.totalDayMins > 0 
              ? Math.round((day.collegeMins / day.totalDayMins) * 100) 
              : 50;

            return (
              <div key={day.dateStr} className="flex flex-col items-center h-full justify-end group">
                <div className="text-[11px] font-mono font-bold text-slate-800 mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {day.totalDayMins}m
                </div>

                <div 
                  className="w-full max-w-[48px] bg-slate-200 rounded-t-lg overflow-hidden flex flex-col justify-end transition-all group-hover:brightness-95 border border-slate-300"
                  style={{ height: `${Math.max(14, heightPercent)}%` }}
                >
                  {/* Competitive exam block */}
                  <div 
                    className="bg-amber-600 w-full"
                    style={{ height: `${100 - collegePartPercent}%` }}
                    title={`Competitive: ${day.compMins}m`}
                  />
                  {/* College block */}
                  <div 
                    className="bg-indigo-700 w-full" 
                    style={{ height: `${collegePartPercent}%` }}
                    title={`College: ${day.collegeMins}m`}
                  />
                </div>

                <div className="text-center mt-2">
                  <div className="text-xs font-extrabold text-slate-800">{day.dayName}</div>
                  <div className="text-[11px] font-semibold text-slate-600">{day.dateStr.split('-').slice(1).join('/')}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2-Column: Balance Breakdown & Topic Mastery Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Track Balance Ratio */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-300 shadow-xs">
          <h3 className="font-extrabold text-base text-slate-900 mb-1">Dual-Track Balance Ratio</h3>
          <p className="text-xs sm:text-sm text-slate-700 font-medium mb-4">
            Evaluate whether your focus aligns with your academic and competitive priorities
          </p>

          <div className="p-4 bg-slate-100 rounded-xl border border-slate-200 mb-4">
            <div className="flex justify-between text-xs font-extrabold mb-2">
              <span className="text-indigo-900">College: {collegeTrackPct}%</span>
              <span className="text-amber-950">Competitive: {compTrackPct}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-3.5 overflow-hidden flex border border-slate-300">
              <div className="bg-indigo-700 h-3.5" style={{ width: `${collegeTrackPct}%` }} />
              <div className="bg-amber-600 h-3.5" style={{ width: `${compTrackPct}%` }} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl border border-slate-300 bg-white">
              <div className="font-bold text-indigo-900 flex items-center gap-1.5 mb-1">
                <GraduationCap className="w-4 h-4 text-indigo-700" />
                <span>College Prep</span>
              </div>
              <p className="text-slate-800 font-semibold">{collegeDone} of {collegeTasks.length} tasks done</p>
              <p className="text-slate-600 font-mono text-[11px] mt-0.5">{collegeFocusMinutes} mins logged</p>
            </div>

            <div className="p-3 rounded-xl border border-slate-300 bg-white">
              <div className="font-bold text-amber-950 flex items-center gap-1.5 mb-1">
                <Target className="w-4 h-4 text-amber-700" />
                <span>Competitive Prep</span>
              </div>
              <p className="text-slate-800 font-semibold">{competitiveDone} of {competitiveTasks.length} tasks done</p>
              <p className="text-slate-600 font-mono text-[11px] mt-0.5">{competitiveFocusMinutes} mins logged</p>
            </div>
          </div>
        </div>

        {/* Topic Mastery Distribution */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-300 shadow-xs">
          <h3 className="font-extrabold text-base text-slate-900 mb-1">Topic Mastery Distribution</h3>
          <p className="text-xs sm:text-sm text-slate-700 font-medium mb-4">
            Readiness status across all {totalTopics} syllabus concepts
          </p>

          <div className="space-y-3.5">
            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-emerald-900">Strong (Mastered)</span>
                <span className="text-slate-800">{strongTopics} topics ({totalTopics > 0 ? Math.round((strongTopics / totalTopics) * 100) : 0}%)</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                <div className="bg-emerald-600 h-2.5 rounded-full" style={{ width: `${(strongTopics / (totalTopics || 1)) * 100}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-indigo-900">Revised</span>
                <span className="text-slate-800">{revisedTopics} topics ({totalTopics > 0 ? Math.round((revisedTopics / totalTopics) * 100) : 0}%)</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                <div className="bg-indigo-700 h-2.5 rounded-full" style={{ width: `${(revisedTopics / (totalTopics || 1)) * 100}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-amber-950">Learning</span>
                <span className="text-slate-800">{learningTopics} topics ({totalTopics > 0 ? Math.round((learningTopics / totalTopics) * 100) : 0}%)</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                <div className="bg-amber-600 h-2.5 rounded-full" style={{ width: `${(learningTopics / (totalTopics || 1)) * 100}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-slate-700">Not Started</span>
                <span className="text-slate-800">{notStartedTopics} topics ({totalTopics > 0 ? Math.round((notStartedTopics / totalTopics) * 100) : 0}%)</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                <div className="bg-slate-400 h-2.5 rounded-full" style={{ width: `${(notStartedTopics / (totalTopics || 1)) * 100}%` }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

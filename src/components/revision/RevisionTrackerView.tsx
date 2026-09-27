import React, { useState } from 'react';
import { 
  RotateCcw, 
  Check, 
  Calendar, 
  Clock, 
  AlertCircle, 
  BookOpen, 
  CheckCircle2,
  Brain,
  Timer,
  ArrowRight
} from 'lucide-react';
import { AppState, Topic } from '../../types';
import { getTodayDateString, getDateOffset } from '../../data/sampleData';

interface RevisionTrackerViewProps {
  state: AppState;
  onMarkTopicRevised: (topicId: string) => void;
  onSetTopicStudiedDate: (topicId: string, studiedDate: string) => void;
  onReviseNow: (topic: Topic) => void;
  onNavigateTab: (tab: string) => void;
}

export const RevisionTrackerView: React.FC<RevisionTrackerViewProps> = ({
  state,
  onMarkTopicRevised,
  onSetTopicStudiedDate,
  onReviseNow,
  onNavigateTab
}) => {
  const [activeTab, setActiveTab] = useState<'due_today' | 'upcoming' | 'all'>('due_today');
  const [searchQuery, setSearchQuery] = useState('');

  const today = getTodayDateString();

  // Topics categorization
  const dueTodayTopics = state.topics.filter(t => t.nextRevisionDate && t.nextRevisionDate <= today);
  const upcomingTopics = state.topics.filter(t => t.nextRevisionDate && t.nextRevisionDate > today);

  const getSubject = (subId: string) => state.subjects.find(s => s.id === subId);

  // Filter topics for the active tab
  let displayedTopics: Topic[] = [];
  if (activeTab === 'due_today') {
    displayedTopics = dueTodayTopics;
  } else if (activeTab === 'upcoming') {
    displayedTopics = [...upcomingTopics].sort((a, b) => (a.nextRevisionDate || '').localeCompare(b.nextRevisionDate || ''));
  } else {
    displayedTopics = [...state.topics].sort((a, b) => {
      if (a.nextRevisionDate && b.nextRevisionDate) return a.nextRevisionDate.localeCompare(b.nextRevisionDate);
      if (a.nextRevisionDate) return -1;
      return 1;
    });
  }

  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    displayedTopics = displayedTopics.filter(t => {
      const matchName = t.name.toLowerCase().includes(q);
      const matchChap = t.chapter.toLowerCase().includes(q);
      const sub = getSubject(t.subjectId);
      const matchSub = sub?.name.toLowerCase().includes(q);
      return matchName || matchChap || matchSub;
    });
  }

  // Calculate days difference
  const getDaysDiff = (targetDateStr?: string) => {
    if (!targetDateStr) return { text: 'Not Scheduled', isOverdue: false, isToday: false };
    const target = new Date(targetDateStr + 'T00:00:00');
    const now = new Date(today + 'T00:00:00');
    const diffDays = Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return { text: 'Due Today', isOverdue: false, isToday: true };
    if (diffDays < 0) return { text: `${Math.abs(diffDays)}d overdue`, isOverdue: true, isToday: false };
    if (diffDays === 1) return { text: 'Due Tomorrow', isOverdue: false, isToday: false };
    return { text: `Due in ${diffDays} days (${targetDateStr})`, isOverdue: false, isToday: false };
  };

  const getRevisionStageLabel = (count: number) => {
    if (count === 0) return 'Stage 0 (Initial Study)';
    if (count === 1) return 'Revision 1 (1 day)';
    if (count === 2) return 'Revision 2 (3 days)';
    if (count === 3) return 'Revision 3 (7 days)';
    if (count === 4) return 'Revision 4 (14 days)';
    return 'Revision 5 (30 days - Mastered)';
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="bg-white p-5 sm:p-7 rounded-2xl border border-slate-300 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-rose-700 uppercase tracking-wider mb-1">
              <Brain className="w-4 h-4 text-rose-600" />
              <span>Scientific Spaced-Revision System</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Revision Tracker
            </h1>
            <p className="text-sm text-slate-700 font-medium mt-1 max-w-2xl">
              Automatic spaced-revision sequence: 
              <span className="font-bold text-slate-900"> Rev 1 (1d) &rarr; Rev 2 (3d) &rarr; Rev 3 (7d) &rarr; Rev 4 (14d) &rarr; Rev 5 (30d)</span>.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="px-4 py-2.5 rounded-xl bg-rose-50 border border-rose-200 text-center min-w-[100px]">
              <div className="text-2xl font-extrabold text-rose-900 leading-tight">
                {dueTodayTopics.length}
              </div>
              <div className="text-xs font-bold text-rose-800">Due Today</div>
            </div>
            <div className="px-4 py-2.5 rounded-xl bg-slate-100 border border-slate-300 text-center min-w-[100px]">
              <div className="text-2xl font-extrabold text-slate-900 leading-tight">
                {upcomingTopics.length}
              </div>
              <div className="text-xs font-bold text-slate-700">Upcoming</div>
            </div>
          </div>
        </div>

        {/* 5-Stage Schedule Visualizer */}
        <div className="mt-6 pt-5 border-t border-slate-200">
          <div className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2.5">
            Spaced Revision Schedule
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-center">
              <span className="font-extrabold text-slate-900">Revision 1</span>
              <p className="text-xs font-semibold text-slate-700 mt-0.5">1 day later</p>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-center">
              <span className="font-extrabold text-slate-900">Revision 2</span>
              <p className="text-xs font-semibold text-slate-700 mt-0.5">3 days later</p>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-center">
              <span className="font-extrabold text-slate-900">Revision 3</span>
              <p className="text-xs font-semibold text-slate-700 mt-0.5">7 days later</p>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-center">
              <span className="font-extrabold text-slate-900">Revision 4</span>
              <p className="text-xs font-semibold text-slate-700 mt-0.5">14 days later</p>
            </div>
            <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-300 text-center">
              <span className="font-extrabold text-emerald-950">Revision 5</span>
              <p className="text-xs font-semibold text-emerald-800 mt-0.5">30 days (Mastered)</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs & Search */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-300 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-bold">
            <button
              onClick={() => setActiveTab('due_today')}
              className={`px-3.5 py-2 rounded-lg transition-all flex items-center gap-2 ${
                activeTab === 'due_today'
                  ? 'bg-white text-rose-900 shadow-xs border border-slate-200 font-extrabold'
                  : 'text-slate-700 hover:text-slate-950'
              }`}
            >
              <span>Due Today</span>
              {dueTodayTopics.length > 0 && (
                <span className="w-5 h-5 rounded-full bg-rose-600 text-white text-[10px] flex items-center justify-center font-bold">
                  {dueTodayTopics.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`px-3.5 py-2 rounded-lg transition-all ${
                activeTab === 'upcoming'
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-200 font-extrabold'
                  : 'text-slate-700 hover:text-slate-950'
              }`}
            >
              Upcoming ({upcomingTopics.length})
            </button>
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3.5 py-2 rounded-lg transition-all ${
                activeTab === 'all'
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-200 font-extrabold'
                  : 'text-slate-700 hover:text-slate-950'
              }`}
            >
              All Topics ({state.topics.length})
            </button>
          </div>

          <div className="w-full sm:w-72">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search topic or subject..."
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-600 bg-white text-slate-900"
            />
          </div>
        </div>

        {/* Topics List with All 5 Required Fields & Revise Now / Mark Complete buttons */}
        {displayedTopics.length === 0 ? (
          <div className="py-12 text-center">
            {activeTab === 'due_today' ? (
              <div className="max-w-md mx-auto">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto mb-2" />
                <h3 className="font-extrabold text-slate-900 text-base">No Revisions Due Today!</h3>
                <p className="text-xs sm:text-sm text-slate-700 mt-1 font-medium">
                  You are completely caught up on your spaced revisions. Check upcoming topics or study new concepts.
                </p>
                <button
                  onClick={() => setActiveTab('upcoming')}
                  className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 shadow-xs"
                >
                  <span>View Upcoming Schedule</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div>
                <p className="text-sm font-semibold text-slate-700">No topics match this view.</p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-3.5">
            {displayedTopics.map((topic) => {
              const sub = getSubject(topic.subjectId);
              const dueInfo = getDaysDiff(topic.nextRevisionDate);

              return (
                <div
                  key={topic.id}
                  className="p-4 sm:p-5 rounded-2xl border border-slate-300 hover:border-slate-400 transition-all bg-white shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="min-w-0 flex-1 space-y-2">
                    {/* Required Field 1: Topic Name & Required Field 2: Subject */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap text-xs text-slate-700 mb-1">
                          {/* Subject */}
                          <span className="font-extrabold text-indigo-900 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-md">
                            {sub?.name || 'General Course'}
                          </span>
                          <span className="text-slate-400 font-bold">·</span>
                          <span className="font-semibold text-slate-700">{topic.chapter}</span>
                        </div>

                        {/* Topic Name */}
                        <h3 className="text-base sm:text-lg font-extrabold text-slate-900 leading-snug">
                          {topic.name}
                        </h3>
                      </div>
                    </div>

                    {/* Required Fields 3, 4, 5 Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 border-t border-slate-100 text-xs">
                      {/* Required Field 3: Last Studied Date */}
                      <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
                        <span className="text-[11px] font-bold text-slate-600 block uppercase">Last Studied Date</span>
                        <span className="font-bold text-slate-900">
                          {topic.lastStudiedDate ? topic.lastStudiedDate : 'Not studied yet'}
                        </span>
                      </div>

                      {/* Required Field 4: Next Revision Date */}
                      <div className={`p-2 rounded-lg border ${
                        dueInfo.isOverdue || dueInfo.isToday
                          ? 'bg-rose-50 border-rose-200'
                          : 'bg-slate-50 border-slate-200'
                      }`}>
                        <span className="text-[11px] font-bold text-slate-600 block uppercase">Next Revision Date</span>
                        <div className="flex items-center gap-1.5">
                          <span className={`font-bold ${
                            dueInfo.isOverdue || dueInfo.isToday ? 'text-rose-900' : 'text-slate-900'
                          }`}>
                            {topic.nextRevisionDate || 'Not scheduled'}
                          </span>
                          <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                            dueInfo.isToday
                              ? 'bg-rose-600 text-white'
                              : dueInfo.isOverdue
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-slate-200 text-slate-800'
                          }`}>
                            {dueInfo.text}
                          </span>
                        </div>
                      </div>

                      {/* Required Field 5: Revision Status */}
                      <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
                        <span className="text-[11px] font-bold text-slate-600 block uppercase">Revision Status</span>
                        <span className="font-bold text-indigo-950 capitalize">
                          {getRevisionStageLabel(topic.revisionCount)} ({topic.status.replace('_', ' ')})
                        </span>
                      </div>
                    </div>

                    {topic.notesSummary && (
                      <p className="text-xs text-slate-700 font-mono mt-1 line-clamp-1 bg-slate-50 px-2 py-1 rounded border border-slate-100">
                        Anchor: {topic.notesSummary}
                      </p>
                    )}
                  </div>

                  {/* Required Buttons: Revise Now & Mark Complete */}
                  <div className="flex items-center gap-2.5 self-start md:self-center shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-200 w-full md:w-auto justify-end">
                    {/* Button 1: Revise Now */}
                    <button
                      onClick={() => onReviseNow(topic)}
                      className="flex-1 md:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs active:scale-95"
                      title="Launch Pomodoro focus session for this topic"
                    >
                      <Timer className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Revise Now</span>
                    </button>

                    {/* Button 2: Mark Complete */}
                    <button
                      onClick={() => onMarkTopicRevised(topic.id)}
                      className="flex-1 md:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs active:scale-95"
                      title="Advance to next spaced revision stage and earn +15 XP"
                    >
                      <Check className="w-4 h-4" />
                      <span>Mark Complete (+15 XP)</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

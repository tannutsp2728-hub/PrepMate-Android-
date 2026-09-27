import React, { useState } from 'react';
import { 
  Check, 
  Lock, 
  ArrowDown, 
  Sparkles, 
  Trophy, 
  Star, 
  BookOpen, 
  RotateCcw,
  Plus,
  Play
} from 'lucide-react';
import { AppState, Subject, Topic, TopicMastery } from '../../types';
import { MASTERY_CONFIG } from '../../utils/gamification';

interface LearningJourneyViewProps {
  state: AppState;
  onUpdateTopicMastery: (topicId: string, mastery: TopicMastery) => void;
  onReviseNow: (topic: Topic) => void;
  onOpenTopicModal: (subjectId?: string) => void;
}

export const LearningJourneyView: React.FC<LearningJourneyViewProps> = ({
  state,
  onUpdateTopicMastery,
  onReviseNow,
  onOpenTopicModal
}) => {
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(
    state.subjects[0]?.id || ''
  );

  const selectedSubject = state.subjects.find((s) => s.id === selectedSubjectId) || state.subjects[0];

  // Topics for this subject, sorted by orderIndex
  const subjectTopics = state.topics
    .filter((t) => t.subjectId === selectedSubject?.id)
    .sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));

  const masteredCount = subjectTopics.filter(
    (t) => t.mastery === 'strong' || t.mastery === 'mastered' || t.status === 'strong'
  ).length;

  const totalCount = subjectTopics.length;
  const progressPct = totalCount > 0 ? Math.round((masteredCount / totalCount) * 100) : 0;

  const cycleMastery = (current?: TopicMastery): TopicMastery => {
    if (!current || current === 'started') return 'learning';
    if (current === 'learning') return 'practicing';
    if (current === 'practicing') return 'strong';
    if (current === 'strong') return 'mastered';
    return 'started';
  };

  const getNodeVisual = (topic: Topic, idx: number) => {
    const mastery: TopicMastery = topic.mastery || (
      topic.status === 'strong' ? 'strong' :
      topic.status === 'revised' ? 'practicing' :
      topic.status === 'learning' ? 'learning' : 'started'
    );

    const isLocked = mastery === 'started' && idx > 0 && 
      !['strong', 'mastered', 'practicing', 'learning'].includes(
        subjectTopics[idx - 1]?.mastery || subjectTopics[idx - 1]?.status || ''
      );

    if (mastery === 'mastered') {
      return {
        bg: 'bg-emerald-500 text-white border-emerald-600 shadow-md ring-4 ring-emerald-100',
        dot: 'bg-emerald-500',
        statusColor: 'text-emerald-800',
        icon: '🏆',
        label: 'Mastered',
        isLocked: false
      };
    }
    if (mastery === 'strong') {
      return {
        bg: 'bg-emerald-600 text-white border-emerald-700 shadow-md ring-4 ring-emerald-100',
        dot: 'bg-emerald-600',
        statusColor: 'text-emerald-800',
        icon: '⭐',
        label: 'Strong',
        isLocked: false
      };
    }
    if (mastery === 'practicing') {
      return {
        bg: 'bg-sky-500 text-white border-sky-600 shadow-md ring-4 ring-sky-100',
        dot: 'bg-sky-500',
        statusColor: 'text-sky-800',
        icon: '💪',
        label: 'Practicing',
        isLocked: false
      };
    }
    if (mastery === 'learning') {
      return {
        bg: 'bg-amber-500 text-white border-amber-600 shadow-md ring-4 ring-amber-100',
        dot: 'bg-amber-500',
        statusColor: 'text-amber-800',
        icon: '📖',
        label: 'Learning',
        isLocked: false
      };
    }
    return {
      bg: 'bg-slate-200 text-slate-700 border-slate-300 ring-4 ring-slate-100',
      dot: 'bg-slate-400',
      statusColor: 'text-slate-600',
      icon: isLocked ? '🔒' : '🌱',
      label: isLocked ? 'Locked' : 'Started',
      isLocked
    };
  };

  return (
    <div className="space-y-6">
      {/* Subject Carousel Selector */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        {state.subjects.map((sub) => {
          const isSelected = sub.id === selectedSubject?.id;
          const subTopics = state.topics.filter((t) => t.subjectId === sub.id);
          const done = subTopics.filter(
            (t) => t.mastery === 'strong' || t.mastery === 'mastered' || t.status === 'strong'
          ).length;

          return (
            <button
              key={sub.id}
              onClick={() => setSelectedSubjectId(sub.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl whitespace-nowrap font-bold text-xs sm:text-sm transition-all border shrink-0 ${
                isSelected
                  ? 'bg-slate-900 text-white border-slate-900 shadow-sm scale-102'
                  : 'bg-white text-slate-800 border-slate-300 hover:border-slate-400'
              }`}
            >
              <span>{sub.name}</span>
              <span
                className={`text-[11px] px-1.5 py-0.2 rounded-full font-extrabold ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
                }`}
              >
                {done}/{subTopics.length}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Roadmap Container */}
      <div className="bg-white rounded-3xl border border-slate-300 p-6 sm:p-9 shadow-xs relative">
        {/* Roadmap Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-700 uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Learning Roadmap & Mastery Path</span>
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {selectedSubject?.name}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-medium mt-0.5">
              Unlock nodes step-by-step as you learn, practice, and master concepts.
            </p>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <div className="p-3 rounded-2xl bg-indigo-50 border border-indigo-200 text-center min-w-[110px]">
              <span className="text-xl font-extrabold text-indigo-950 block">{progressPct}%</span>
              <span className="text-[11px] font-bold text-indigo-800">Mastered</span>
            </div>

            <button
              onClick={() => onOpenTopicModal(selectedSubject?.id)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Add Node</span>
            </button>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-3 sm:gap-6 flex-wrap py-4 text-xs font-bold text-slate-700 border-b border-slate-100">
          <span className="flex items-center gap-1.5">
            <span>🌱</span> <span>Started</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span>📖</span> <span>Learning</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span>💪</span> <span>Practicing</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span>⭐</span> <span>Strong</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span>🏆</span> <span>Mastered</span>
          </span>
        </div>

        {/* Vertical Journey Nodes */}
        {subjectTopics.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-sm font-bold text-slate-700">No topics in this subject yet.</p>
            <button
              onClick={() => onOpenTopicModal(selectedSubject?.id)}
              className="mt-3 text-xs font-bold text-indigo-700 hover:text-indigo-900 underline"
            >
              + Add the first topic for {selectedSubject?.name}
            </button>
          </div>
        ) : (
          <div className="max-w-md mx-auto py-8 relative">
            <div className="space-y-6">
              {subjectTopics.map((topic, idx) => {
                const visual = getNodeVisual(topic, idx);
                const currentMastery = topic.mastery || (
                  topic.status === 'strong' ? 'strong' :
                  topic.status === 'revised' ? 'practicing' :
                  topic.status === 'learning' ? 'learning' : 'started'
                );

                return (
                  <React.Fragment key={topic.id}>
                    {/* Node Card */}
                    <div className="relative group">
                      <div className="flex items-center gap-4 bg-slate-50 hover:bg-slate-100 p-4 rounded-2xl border border-slate-300 transition-all shadow-xs">
                        {/* Circular Milestone Icon */}
                        <div
                          className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shrink-0 border-2 transition-transform group-hover:scale-105 ${visual.bg}`}
                        >
                          <span>{visual.icon}</span>
                        </div>

                        {/* Node Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 text-[11px] font-bold text-slate-500 mb-0.5">
                            <span>Step {idx + 1}</span>
                            <span>·</span>
                            <span className="truncate">{topic.chapter}</span>
                          </div>
                          <h4 className="text-sm sm:text-base font-extrabold text-slate-900 leading-snug truncate">
                            {topic.name}
                          </h4>
                          {topic.notesSummary && (
                            <p className="text-xs text-slate-600 font-mono mt-0.5 line-clamp-1">
                              {topic.notesSummary}
                            </p>
                          )}
                        </div>

                        {/* Interactive Status Changer & Revise Button */}
                        <div className="flex flex-col items-end gap-1.5 shrink-0">
                          <button
                            onClick={() => onUpdateTopicMastery(topic.id, cycleMastery(currentMastery))}
                            className="px-2.5 py-1 text-xs font-bold rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-900 shadow-xs transition-transform active:scale-95 flex items-center gap-1"
                            title="Click to cycle mastery level"
                          >
                            <span>{MASTERY_CONFIG[currentMastery].icon}</span>
                            <span className="capitalize">{currentMastery}</span>
                          </button>

                          <button
                            onClick={() => onReviseNow(topic)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-700 hover:bg-white transition-colors"
                            title="Start study session for this topic"
                          >
                            <Play className="w-3.5 h-3.5 fill-current" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Connecting Arrow (if not last) */}
                    {idx < subjectTopics.length - 1 && (
                      <div className="flex justify-center my-1">
                        <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center text-slate-500 shadow-xs">
                          <ArrowDown className="w-4 h-4 stroke-[2.5]" />
                        </div>
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

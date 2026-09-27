import React, { useState } from 'react';
import { 
  BookOpen, 
  Plus, 
  Search, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  GraduationCap, 
  Target, 
  ChevronRight, 
  ChevronDown,
  Layers,
  Sparkles,
  RotateCcw,
  Map,
  List
} from 'lucide-react';
import { AppState, Subject, Topic, TopicStatus, TopicMastery, TrackType } from '../../types';
import { LearningJourneyView } from './LearningJourneyView';
import { MASTERY_CONFIG } from '../../utils/gamification';
import { StackOfBooksIllustration } from '../illustrations/StudyIllustrations';

interface StudyPlannerViewProps {
  state: AppState;
  onOpenTopicModal: (subjectId?: string, topic?: Topic) => void;
  onUpdateTopicStatus: (topicId: string, newStatus: TopicStatus) => void;
  onUpdateTopicMastery: (topicId: string, mastery: TopicMastery) => void;
  onDeleteTopic: (topicId: string) => void;
  onDeleteSubject: (subjectId: string) => void;
  onReviseNow: (topic: Topic) => void;
}

export const StudyPlannerView: React.FC<StudyPlannerViewProps> = ({
  state,
  onOpenTopicModal,
  onUpdateTopicStatus,
  onUpdateTopicMastery,
  onDeleteTopic,
  onDeleteSubject,
  onReviseNow
}) => {
  const [plannerMode, setPlannerMode] = useState<'journey' | 'list'>('journey');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('all');
  const [trackFilter, setTrackFilter] = useState<'all' | 'college' | 'competitive'>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [collapsedChapters, setCollapsedChapters] = useState<Record<string, boolean>>({});

  // Cycle 5 mastery levels: started -> learning -> practicing -> strong -> mastered
  const cycleMastery = (current?: TopicMastery): TopicMastery => {
    if (!current || current === 'started') return 'learning';
    if (current === 'learning') return 'practicing';
    if (current === 'practicing') return 'strong';
    if (current === 'strong') return 'mastered';
    return 'started';
  };

  // Filter subjects by track
  const filteredSubjects = state.subjects.filter((sub) => {
    if (trackFilter === 'college' && sub.track === 'competitive') return false;
    if (trackFilter === 'competitive' && sub.track === 'college') return false;
    return true;
  });

  // Filter topics
  const filteredTopics = state.topics.filter((topic) => {
    // Subject filter
    if (selectedSubjectId !== 'all' && topic.subjectId !== selectedSubjectId) return false;

    // Track filter through parent subject
    const parentSub = state.subjects.find(s => s.id === topic.subjectId);
    if (parentSub) {
      if (trackFilter === 'college' && parentSub.track === 'competitive') return false;
      if (trackFilter === 'competitive' && parentSub.track === 'college') return false;
    }

    // Status filter
    if (statusFilter !== 'all' && topic.status !== statusFilter) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = topic.name.toLowerCase().includes(q);
      const matchChap = topic.chapter.toLowerCase().includes(q);
      const matchSub = parentSub?.name.toLowerCase().includes(q);
      if (!matchName && !matchChap && !matchSub) return false;
    }

    return true;
  });

  // Group filtered topics by Chapter
  const topicsByChapter: Record<string, Topic[]> = {};
  filteredTopics.forEach((t) => {
    const key = `${t.subjectId}__${t.chapter}`;
    if (!topicsByChapter[key]) topicsByChapter[key] = [];
    topicsByChapter[key].push(t);
  });

  const toggleChapter = (key: string) => {
    setCollapsedChapters(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const getSubject = (subId: string) => state.subjects.find(s => s.id === subId);

  // Status cycling helper: Not Started -> Learning -> Revised -> Strong
  const cycleNextStatus = (curr: TopicStatus): TopicStatus => {
    if (curr === 'not_started') return 'learning';
    if (curr === 'learning') return 'revised';
    if (curr === 'revised') return 'strong';
    return 'not_started';
  };

  const getStatusBadge = (status: TopicStatus) => {
    switch (status) {
      case 'strong':
        return { text: 'Strong (Mastered)', color: 'text-emerald-950 bg-emerald-100 border-emerald-300 font-extrabold' };
      case 'revised':
        return { text: 'Revised', color: 'text-indigo-950 bg-indigo-100 border-indigo-300 font-extrabold' };
      case 'learning':
        return { text: 'Learning', color: 'text-amber-950 bg-amber-100 border-amber-300 font-extrabold' };
      case 'not_started':
      default:
        return { text: 'Not Started', color: 'text-slate-800 bg-slate-200 border-slate-300 font-bold' };
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-3xl border border-amber-200/70 shadow-xs relative overflow-hidden bg-gradient-to-r from-white via-white to-emerald-50/30">
        <div className="flex items-center gap-3.5">
          <div className="shrink-0 hidden sm:block">
            <StackOfBooksIllustration size={50} />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Study Planner</h1>
            <p className="text-xs sm:text-sm text-slate-600 font-semibold mt-0.5">
              Follow your visual learning journey and track topic mastery
            </p>
          </div>
        </div>

        {/* View Switcher & Add Topic Button */}
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-amber-50/70 p-1 rounded-2xl border border-amber-200 text-xs font-bold">
            <button
              onClick={() => setPlannerMode('journey')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl transition-all ${
                plannerMode === 'journey'
                  ? 'bg-white text-slate-900 shadow-xs font-black'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Map className="w-3.5 h-3.5 text-emerald-600" />
              <span>Journey Map</span>
            </button>
            <button
              onClick={() => setPlannerMode('list')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl transition-all ${
                plannerMode === 'list'
                  ? 'bg-white text-slate-900 shadow-xs font-black'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <List className="w-3.5 h-3.5 text-amber-700" />
              <span>Chapter List</span>
            </button>
          </div>

          <button
            onClick={() => onOpenTopicModal(selectedSubjectId !== 'all' ? selectedSubjectId : undefined)}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-slate-900 text-white hover:bg-slate-800 text-xs sm:text-sm font-black transition-all shadow-xs active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add Topic</span>
          </button>
        </div>
      </div>

      {plannerMode === 'journey' ? (
        <LearningJourneyView
          state={state}
          onUpdateTopicMastery={onUpdateTopicMastery}
          onReviseNow={onReviseNow}
          onOpenTopicModal={onOpenTopicModal}
        />
      ) : (
        <>
          {/* Subject Cards Grid */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Your Subjects ({state.subjects.length})
              </h2>
              <div className="flex items-center gap-1 bg-slate-200 p-1 rounded-xl text-xs font-bold">
                <button
                  onClick={() => setTrackFilter('all')}
                  className={`px-3 py-1 rounded-lg transition-colors ${
                    trackFilter === 'all' ? 'bg-white text-slate-900 shadow-xs font-extrabold' : 'text-slate-700'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setTrackFilter('college')}
                  className={`px-3 py-1 rounded-lg transition-colors ${
                    trackFilter === 'college' ? 'bg-white text-indigo-900 shadow-xs font-extrabold' : 'text-slate-700'
                  }`}
                >
                  College
                </button>
                <button
                  onClick={() => setTrackFilter('competitive')}
                  className={`px-3 py-1 rounded-lg transition-colors ${
                    trackFilter === 'competitive' ? 'bg-white text-amber-900 shadow-xs font-extrabold' : 'text-slate-700'
                  }`}
                >
                  Competitive
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {/* All Subjects pill card */}
              <button
                onClick={() => setSelectedSubjectId('all')}
                className={`p-4 sm:p-5 rounded-2xl border text-left transition-all ${
                  selectedSubjectId === 'all'
                    ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                    : 'bg-white text-slate-900 border-slate-300 hover:border-slate-400'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-extrabold uppercase tracking-wider opacity-90">All Combined</span>
                  <Layers className="w-4 h-4 opacity-80" />
                </div>
                <h3 className="font-extrabold text-base leading-snug">All Subjects Overview</h3>
                <p className={`text-xs mt-2 font-medium ${selectedSubjectId === 'all' ? 'text-slate-200' : 'text-slate-700'}`}>
                  {state.topics.length} total topics across {state.subjects.length} courses
                </p>
              </button>

              {/* Individual Subjects */}
              {filteredSubjects.map((sub) => {
                const subTopics = state.topics.filter(t => t.subjectId === sub.id);
                const masteredCount = subTopics.filter(t => t.mastery === 'strong' || t.mastery === 'mastered' || t.status === 'strong').length;
                const pct = subTopics.length > 0 ? Math.round((masteredCount / subTopics.length) * 100) : 0;
                const isSelected = selectedSubjectId === sub.id;

                return (
                  <div
                    key={sub.id}
                    onClick={() => setSelectedSubjectId(sub.id)}
                    className={`p-4 sm:p-5 rounded-2xl border text-left transition-all cursor-pointer relative group ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/60 shadow-xs ring-2 ring-indigo-600'
                        : 'bg-white border-slate-300 hover:border-slate-400'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-1.5 text-xs font-bold">
                        <span className={`uppercase tracking-wider ${
                          sub.track === 'college' ? 'text-indigo-900' : sub.track === 'competitive' ? 'text-amber-900' : 'text-slate-800'
                        }`}>
                          {sub.code || sub.track}
                        </span>
                        <span className="text-slate-400 font-bold">·</span>
                        <span className="text-slate-700">{subTopics.length} topics</span>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (window.confirm(`Delete subject "${sub.name}" and all its topics?`)) {
                            onDeleteSubject(sub.id);
                          }
                        }}
                        className="p-1.5 rounded-lg hover:bg-rose-50 text-slate-500 hover:text-rose-700 transition-all border border-slate-200"
                        title="Delete Subject"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <h3 className="font-extrabold text-base text-slate-900 leading-snug line-clamp-1">
                      {sub.name}
                    </h3>

                    {/* Progress bar */}
                    <div className="mt-3">
                      <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                        <span>{masteredCount}/{subTopics.length} mastered</span>
                        <span>{pct}%</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                        <div 
                          className={`h-2 rounded-full transition-all ${
                            sub.track === 'college' ? 'bg-indigo-700' : 'bg-amber-600'
                          }`}
                          style={{ width: `${pct}%` }} 
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Topics Filtering & List */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-300 shadow-xs space-y-4">
            {/* Search & Status Filters */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 text-slate-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search topics, chapters or formulas..."
                  className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-600 bg-white text-slate-900 placeholder:text-slate-500"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <span className="text-xs font-bold text-slate-700 whitespace-nowrap">Status:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-600 bg-white text-slate-800"
                >
                  <option value="all">All Statuses</option>
                  <option value="not_started">Not Started (🌱)</option>
                  <option value="learning">Learning (📖)</option>
                  <option value="revised">Revised / Strong (⭐)</option>
                  <option value="strong">Mastered (🏆)</option>
                </select>
              </div>
            </div>

            {/* Grouped Chapters & Topics */}
            {Object.keys(topicsByChapter).length === 0 ? (
              <div className="py-12 text-center">
                <BookOpen className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                <p className="text-sm font-bold text-slate-700">No study topics found.</p>
                <p className="text-xs text-slate-600 mt-1">Add your syllabus topics to start tracking study progress.</p>
                <button
                  onClick={() => onOpenTopicModal(selectedSubjectId !== 'all' ? selectedSubjectId : undefined)}
                  className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Topic</span>
                </button>
              </div>
            ) : (
              <div className="space-y-4 pt-2">
                {Object.entries(topicsByChapter).map(([chapterKey, topics]) => {
                  const [subId, chapterTitle] = chapterKey.split('__');
                  const sub = getSubject(subId);
                  const isCollapsed = collapsedChapters[chapterKey];
                  const masteredInChap = topics.filter(t => t.mastery === 'strong' || t.mastery === 'mastered' || t.status === 'strong').length;

                  return (
                    <div key={chapterKey} className="border border-slate-300 rounded-2xl overflow-hidden shadow-xs">
                      {/* Chapter Header */}
                      <div
                        onClick={() => toggleChapter(chapterKey)}
                        className="flex items-center justify-between p-4 bg-slate-100/90 hover:bg-slate-200 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          {isCollapsed ? (
                            <ChevronRight className="w-5 h-5 text-slate-700 shrink-0" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-slate-700 shrink-0" />
                          )}
                          <div>
                            <span className="font-extrabold text-sm sm:text-base text-slate-900">{chapterTitle}</span>
                            {sub && (
                              <span className="text-xs font-bold text-indigo-900 ml-2">
                                ({sub.name})
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-3 text-xs text-slate-800 font-bold">
                          <span>{masteredInChap}/{topics.length} mastered</span>
                        </div>
                      </div>

                      {/* Topics List */}
                      {!isCollapsed && (
                        <div className="divide-y divide-slate-200 bg-white">
                          {topics.map((topic) => {
                            const mastery: TopicMastery = topic.mastery || (
                              topic.status === 'strong' ? 'strong' :
                              topic.status === 'revised' ? 'practicing' :
                              topic.status === 'learning' ? 'learning' : 'started'
                            );
                            const config = MASTERY_CONFIG[mastery];

                            return (
                              <div
                                key={topic.id}
                                className="p-4 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                              >
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center gap-2 text-xs text-slate-700 mb-1 flex-wrap font-semibold">
                                    <span className={`capitalize font-bold text-xs ${
                                      topic.difficulty === 'hard' ? 'text-rose-700' : topic.difficulty === 'medium' ? 'text-amber-800' : 'text-emerald-700'
                                    }`}>
                                      {topic.difficulty} difficulty
                                    </span>
                                    {topic.lastStudiedDate && (
                                      <>
                                        <span>·</span>
                                        <span>Studied: {topic.lastStudiedDate}</span>
                                      </>
                                    )}
                                    {topic.revisionCount > 0 && (
                                      <>
                                        <span>·</span>
                                        <span>{topic.revisionCount} revisions</span>
                                      </>
                                    )}
                                  </div>

                                  <h4 className="text-sm sm:text-base font-extrabold text-slate-900 leading-snug">
                                    {topic.name}
                                  </h4>

                                  {topic.notesSummary && (
                                    <p className="text-xs text-slate-700 mt-1 line-clamp-2 font-mono">
                                      {topic.notesSummary}
                                    </p>
                                  )}
                                </div>

                                {/* Mastery selector & Actions */}
                                <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
                                  <button
                                    onClick={() => onUpdateTopicMastery(topic.id, cycleMastery(mastery))}
                                    className={`px-3 py-1.5 text-xs rounded-xl border transition-all hover:scale-105 active:scale-95 flex items-center gap-1.5 font-bold ${config.badgeClass}`}
                                    title="Click to cycle mastery level: Started -> Learning -> Practicing -> Strong -> Mastered"
                                  >
                                    <span>{config.icon}</span>
                                    <span>{config.label}</span>
                                  </button>

                                  <button
                                    onClick={() => onOpenTopicModal(topic.subjectId, topic)}
                                    className="p-2 rounded-xl text-slate-600 hover:text-slate-950 hover:bg-slate-100 transition-colors border border-slate-200"
                                    title="Edit Topic"
                                  >
                                    <Edit3 className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => onDeleteTopic(topic.id)}
                                    className="p-2 rounded-xl text-slate-600 hover:text-rose-700 hover:bg-rose-50 transition-colors border border-slate-200"
                                    title="Delete Topic"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Subject, Topic, TopicStatus, TopicMastery, DifficultyLevel, TrackType } from '../../types';
import { getTodayDateString, getDateOffset } from '../../data/sampleData';
import { MASTERY_CONFIG } from '../../utils/gamification';

interface TopicModalProps {
  isOpen: boolean;
  onClose: () => void;
  subjects: Subject[];
  initialTopic?: Topic | null;
  defaultSubjectId?: string;
  onSaveTopic: (topic: Partial<Topic>) => void;
  onSaveSubject: (subject: Subject) => void;
}

export const TopicModal: React.FC<TopicModalProps> = ({
  isOpen,
  onClose,
  subjects,
  initialTopic,
  defaultSubjectId,
  onSaveTopic,
  onSaveSubject
}) => {
  const [mode, setMode] = useState<'topic' | 'subject'>('topic');

  // Topic form state
  const [subjectId, setSubjectId] = useState(defaultSubjectId || (subjects[0]?.id ?? ''));
  const [chapter, setChapter] = useState('');
  const [name, setName] = useState('');
  const [status, setStatus] = useState<TopicStatus>('not_started');
  const [mastery, setMastery] = useState<TopicMastery>('started');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('medium');
  const [notesSummary, setNotesSummary] = useState('');

  // Subject form state
  const [newSubName, setNewSubName] = useState('');
  const [newSubCode, setNewSubCode] = useState('');
  const [newSubTrack, setNewSubTrack] = useState<TrackType>('college');
  const [newSubColor, setNewSubColor] = useState<'indigo' | 'emerald' | 'amber' | 'rose' | 'sky' | 'purple' | 'slate'>('indigo');
  const [newSubDesc, setNewSubDesc] = useState('');

  useEffect(() => {
    if (initialTopic) {
      setMode('topic');
      setSubjectId(initialTopic.subjectId);
      setChapter(initialTopic.chapter);
      setName(initialTopic.name);
      setStatus(initialTopic.status);
      setMastery(initialTopic.mastery || (
        initialTopic.status === 'strong' ? 'strong' :
        initialTopic.status === 'revised' ? 'practicing' :
        initialTopic.status === 'learning' ? 'learning' : 'started'
      ));
      setDifficulty(initialTopic.difficulty);
      setNotesSummary(initialTopic.notesSummary || '');
    } else {
      setChapter('');
      setName('');
      setStatus('not_started');
      setMastery('started');
      setDifficulty('medium');
      setNotesSummary('');
      if (defaultSubjectId) {
        setSubjectId(defaultSubjectId);
      } else if (subjects[0]) {
        setSubjectId(subjects[0].id);
      }
    }
  }, [initialTopic, defaultSubjectId, subjects, isOpen]);

  if (!isOpen) return null;

  const handleTopicSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const computedStatus: TopicStatus = 
      mastery === 'mastered' || mastery === 'strong' ? 'strong' :
      mastery === 'practicing' ? 'revised' :
      mastery === 'learning' ? 'learning' : 'not_started';

    const topicData: Partial<Topic> = {
      id: initialTopic ? initialTopic.id : `top-${Date.now()}`,
      subjectId: subjectId || subjects[0]?.id || 'sub-1',
      chapter: chapter.trim() || 'General Topics',
      name: name.trim(),
      status: computedStatus,
      mastery,
      difficulty,
      notesSummary: notesSummary.trim() || undefined,
      revisionCount: initialTopic ? initialTopic.revisionCount : 0
    };

    if (computedStatus === 'learning' || computedStatus === 'revised' || computedStatus === 'strong') {
      topicData.lastStudiedDate = initialTopic?.lastStudiedDate || getTodayDateString();
      topicData.nextRevisionDate = initialTopic?.nextRevisionDate || getDateOffset(3);
    }

    onSaveTopic(topicData);
    onClose();
  };

  const handleSubjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubName.trim()) return;

    const newSub: Subject = {
      id: `sub-${Date.now()}`,
      name: newSubName.trim(),
      code: newSubCode.trim() || undefined,
      track: newSubTrack,
      color: newSubColor,
      description: newSubDesc.trim() || undefined
    };

    onSaveSubject(newSub);
    setSubjectId(newSub.id);
    setMode('topic');
    setNewSubName('');
    setNewSubCode('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            {!initialTopic && (
              <div className="flex items-center bg-slate-100 p-0.5 rounded-lg text-xs font-medium">
                <button
                  type="button"
                  onClick={() => setMode('topic')}
                  className={`px-3 py-1 rounded-md transition-colors ${
                    mode === 'topic' ? 'bg-white text-slate-900 shadow-sm font-semibold' : 'text-slate-600'
                  }`}
                >
                  Topic / Chapter
                </button>
                <button
                  type="button"
                  onClick={() => setMode('subject')}
                  className={`px-3 py-1 rounded-md transition-colors ${
                    mode === 'subject' ? 'bg-white text-slate-900 shadow-sm font-semibold' : 'text-slate-600'
                  }`}
                >
                  New Subject
                </button>
              </div>
            )}
            {initialTopic && (
              <h2 className="text-base font-bold text-slate-900">Edit Study Topic</h2>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {mode === 'topic' ? (
          <form onSubmit={handleTopicSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Subject *
              </label>
              <select
                required
                value={subjectId}
                onChange={(e) => setSubjectId(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 bg-white"
              >
                {subjects.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.name} ({sub.track.toUpperCase()})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Chapter / Unit Name
              </label>
              <input
                type="text"
                value={chapter}
                onChange={(e) => setChapter(e.target.value)}
                placeholder="e.g., Unit 2: Process Synchronization"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 placeholder:text-slate-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Topic Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Critical Section & Peterson's Algorithm"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 placeholder:text-slate-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Topic Mastery Level
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200">
                {(['started', 'learning', 'practicing', 'strong', 'mastered'] as TopicMastery[]).map((lvl) => {
                  const cfg = MASTERY_CONFIG[lvl];
                  const isSelected = mastery === lvl;
                  return (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setMastery(lvl)}
                      className={`px-2 py-2 rounded-lg text-xs font-extrabold transition-all flex items-center justify-center gap-1 ${
                        isSelected
                          ? 'bg-white text-slate-900 shadow-sm border border-slate-200 ring-2 ring-indigo-500'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                      }`}
                    >
                      <span>{cfg.icon}</span>
                      <span>{cfg.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Difficulty
                </label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as DifficultyLevel)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 bg-white"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Associated Chapter
                </label>
                <input
                  type="text"
                  value={chapter}
                  onChange={(e) => setChapter(e.target.value)}
                  placeholder="e.g. Cell Physiology"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Key Formula / Concept Note (Optional)
              </label>
              <textarea
                rows={2}
                value={notesSummary}
                onChange={(e) => setNotesSummary(e.target.value)}
                placeholder="Quick memory anchor or reference"
                className="w-full px-3.5 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 placeholder:text-slate-400 resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {initialTopic ? 'Update Topic' : 'Save Topic'}
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleSubjectSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Subject Name *
              </label>
              <input
                type="text"
                required
                value={newSubName}
                onChange={(e) => setNewSubName(e.target.value)}
                placeholder="e.g., Computer Organization & Architecture"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 placeholder:text-slate-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Course / Subject Code
                </label>
                <input
                  type="text"
                  value={newSubCode}
                  onChange={(e) => setNewSubCode(e.target.value)}
                  placeholder="e.g., CS-302"
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 placeholder:text-slate-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Track
                </label>
                <select
                  value={newSubTrack}
                  onChange={(e) => setNewSubTrack(e.target.value as TrackType)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 bg-white"
                >
                  <option value="college">College Only</option>
                  <option value="competitive">Competitive Exam Only</option>
                  <option value="both">Both College & Exam</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Accent Color
              </label>
              <div className="flex items-center gap-3">
                {(['indigo', 'emerald', 'amber', 'rose', 'sky', 'purple', 'slate'] as const).map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setNewSubColor(c)}
                    className={`w-7 h-7 rounded-full border-2 transition-transform ${
                      c === 'indigo' ? 'bg-indigo-500' :
                      c === 'emerald' ? 'bg-emerald-500' :
                      c === 'amber' ? 'bg-amber-500' :
                      c === 'rose' ? 'bg-rose-500' :
                      c === 'sky' ? 'bg-sky-500' :
                      c === 'purple' ? 'bg-purple-500' : 'bg-slate-500'
                    } ${newSubColor === c ? 'scale-125 border-slate-900 shadow-sm' : 'border-transparent hover:scale-110'}`}
                  />
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Short Description (Optional)
              </label>
              <input
                type="text"
                value={newSubDesc}
                onChange={(e) => setNewSubDesc(e.target.value)}
                placeholder="e.g., Pipelining, caches, and instruction sets"
                className="w-full px-3.5 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 placeholder:text-slate-400"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setMode('topic')}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Back to Topic
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Create Subject
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

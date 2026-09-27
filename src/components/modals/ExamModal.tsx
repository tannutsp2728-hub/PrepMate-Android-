import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { UpcomingExam, Subject, ExamCategory } from '../../types';
import { getTodayDateString, getDateOffset } from '../../data/sampleData';

interface ExamModalProps {
  isOpen: boolean;
  onClose: () => void;
  subjects: Subject[];
  initialExam?: UpcomingExam | null;
  onSave: (exam: Partial<UpcomingExam>) => void;
}

export const ExamModal: React.FC<ExamModalProps> = ({
  isOpen,
  onClose,
  subjects,
  initialExam,
  onSave
}) => {
  const [title, setTitle] = useState('');
  const [track, setTrack] = useState<'college' | 'competitive'>('college');
  const [category, setCategory] = useState<ExamCategory>('exam');
  const [subjectId, setSubjectId] = useState('');
  const [dueDate, setDueDate] = useState(getDateOffset(7));
  const [time, setTime] = useState('10:00 AM');
  const [weight, setWeight] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (initialExam) {
      setTitle(initialExam.title);
      setTrack(initialExam.track);
      setCategory(initialExam.category);
      setSubjectId(initialExam.subjectId || '');
      setDueDate(initialExam.dueDate);
      setTime(initialExam.time || '10:00 AM');
      setWeight(initialExam.weight || '');
      setNotes(initialExam.notes || '');
    } else {
      setTitle('');
      setTrack('college');
      setCategory('exam');
      setSubjectId(subjects[0]?.id || '');
      setDueDate(getDateOffset(7));
      setTime('10:00 AM');
      setWeight('');
      setNotes('');
    }
  }, [initialExam, subjects, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSave({
      id: initialExam ? initialExam.id : `exam-${Date.now()}`,
      title: title.trim(),
      track,
      category,
      subjectId: subjectId || undefined,
      dueDate,
      time: time.trim() || undefined,
      weight: weight.trim() || undefined,
      notes: notes.trim() || undefined,
      completed: initialExam ? initialExam.completed : false
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-base font-bold text-slate-900">
            {initialExam ? 'Edit Exam / Deadline' : 'Add Upcoming Exam or Assignment'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Category & Track
            </label>
            <div className="grid grid-cols-2 gap-3">
              <select
                value={track}
                onChange={(e) => setTrack(e.target.value as 'college' | 'competitive')}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-slate-800"
              >
                <option value="college">College Course</option>
                <option value="competitive">Competitive Exam Track</option>
              </select>

              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ExamCategory)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-slate-800"
              >
                <option value="exam">Midterm / Final Exam</option>
                <option value="mock_test">Full Mock Test</option>
                <option value="assignment">Assignment Due</option>
                <option value="project">Project Milestone</option>
                <option value="quiz">Quiz / Sectional Test</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Computer Architecture Midterm Exam"
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 placeholder:text-slate-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Related Subject
              </label>
              <select
                value={subjectId}
                onChange={(e) => setSubjectId(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-slate-800"
              >
                <option value="">(General / Multiple)</option>
                {subjects.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Weight / Importance
              </label>
              <input
                type="text"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="e.g., 25% of Final Grade"
                className="w-full px-3.5 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 placeholder:text-slate-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Date *
              </label>
              <input
                type="date"
                required
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Time (Optional)
              </label>
              <input
                type="text"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="09:30 AM"
                className="w-full px-3.5 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 placeholder:text-slate-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Syllabus Coverage / Notes
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g., Units 1 to 4; bring scientific calculator; focus on formula proofs"
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
              {initialExam ? 'Update Deadline' : 'Add Deadline'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

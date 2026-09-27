import React, { useState } from 'react';
import { 
  StickyNote, 
  Plus, 
  Search, 
  Trash2, 
  Edit3, 
  Copy, 
  Check, 
  Pin, 
  Tag, 
  GraduationCap, 
  Target 
} from 'lucide-react';
import { AppState, QuickNote } from '../../types';

interface QuickNotesViewProps {
  state: AppState;
  onOpenNoteModal: (note?: QuickNote) => void;
  onDeleteNote: (noteId: string) => void;
  onTogglePinNote: (noteId: string) => void;
}

export const QuickNotesView: React.FC<QuickNotesViewProps> = ({
  state,
  onOpenNoteModal,
  onDeleteNote,
  onTogglePinNote
}) => {
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('all');
  const [trackFilter, setTrackFilter] = useState<'all' | 'college' | 'competitive' | 'general'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const getSubject = (subId?: string) => state.subjects.find(s => s.id === subId);

  // Filter notes
  const filteredNotes = state.notes.filter((note) => {
    if (selectedSubjectId !== 'all' && note.subjectId !== selectedSubjectId) return false;
    if (trackFilter !== 'all' && note.track !== trackFilter) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = note.title.toLowerCase().includes(q);
      const matchContent = note.content.toLowerCase().includes(q);
      const matchTag = note.tags?.some(t => t.toLowerCase().includes(q));
      if (!matchTitle && !matchContent && !matchTag) return false;
    }

    return true;
  });

  // Sort pinned first, then by updated date
  const sortedNotes = [...filteredNotes].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return b.updatedAt.localeCompare(a.updatedAt);
  });

  const handleCopyNote = (note: QuickNote) => {
    navigator.clipboard.writeText(`${note.title}\n\n${note.content}`);
    setCopiedId(note.id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-slate-300 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">Quick Study Notes</h1>
          <p className="text-xs sm:text-sm text-slate-700 font-medium mt-0.5">
            Formula sheets, key concepts, mnemonics, and exam review notes
          </p>
        </div>
        <button
          onClick={() => onOpenNoteModal()}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 text-xs sm:text-sm font-bold transition-colors shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>New Study Note</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-300 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search notes, formulas or tags..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-600 bg-white text-slate-900 placeholder:text-slate-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs font-bold text-slate-700 whitespace-nowrap">Subject:</span>
            <select
              value={selectedSubjectId}
              onChange={(e) => setSelectedSubjectId(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-600 bg-white text-slate-800"
            >
              <option value="all">All Subjects</option>
              {state.subjects.map((sub) => (
                <option key={sub.id} value={sub.id}>
                  {sub.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-bold w-fit border border-slate-200">
          <button
            onClick={() => setTrackFilter('all')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              trackFilter === 'all' ? 'bg-white text-slate-900 shadow-xs font-extrabold' : 'text-slate-700 hover:text-slate-950'
            }`}
          >
            All Notes ({state.notes.length})
          </button>
          <button
            onClick={() => setTrackFilter('college')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              trackFilter === 'college' ? 'bg-white text-indigo-900 shadow-xs font-extrabold' : 'text-slate-700 hover:text-slate-950'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5 text-indigo-700" />
            <span>College</span>
          </button>
          <button
            onClick={() => setTrackFilter('competitive')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              trackFilter === 'competitive' ? 'bg-white text-amber-950 shadow-xs font-extrabold' : 'text-slate-700 hover:text-slate-950'
            }`}
          >
            <Target className="w-3.5 h-3.5 text-amber-700" />
            <span>Competitive</span>
          </button>
          <button
            onClick={() => setTrackFilter('general')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              trackFilter === 'general' ? 'bg-white text-slate-900 shadow-xs font-extrabold' : 'text-slate-700 hover:text-slate-950'
            }`}
          >
            General
          </button>
        </div>
      </div>

      {/* Notes Grid */}
      {sortedNotes.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-300 p-12 text-center">
          <StickyNote className="w-10 h-10 text-slate-400 mx-auto mb-2" />
          <p className="text-sm font-bold text-slate-700">No notes found.</p>
          <p className="text-xs text-slate-600 mt-1">Capture tricky concepts, formulas, or short study summaries.</p>
          <button
            onClick={() => onOpenNoteModal()}
            className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create First Note</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedNotes.map((note) => {
            const sub = getSubject(note.subjectId);
            const isCopied = copiedId === note.id;

            return (
              <div
                key={note.id}
                className={`bg-white rounded-2xl border p-5 flex flex-col justify-between transition-all hover:shadow-xs ${
                  note.isPinned
                    ? 'border-amber-300 bg-amber-50/30'
                    : 'border-slate-300 hover:border-slate-400'
                }`}
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-1.5 text-xs flex-wrap font-bold">
                      <span className={`${
                        note.track === 'college' ? 'text-indigo-900' : note.track === 'competitive' ? 'text-amber-950' : 'text-slate-800'
                      }`}>
                        {note.track === 'college' ? 'College' : note.track === 'competitive' ? 'Competitive' : 'General'}
                      </span>
                      {sub && (
                        <>
                          <span className="text-slate-400">·</span>
                          <span className="text-slate-700 truncate max-w-[140px]">
                            {sub.name}
                          </span>
                        </>
                      )}
                    </div>

                    <button
                      onClick={() => onTogglePinNote(note.id)}
                      className={`p-1.5 rounded-lg transition-colors border ${
                        note.isPinned 
                          ? 'text-amber-700 bg-amber-100 border-amber-300' 
                          : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100 border-transparent'
                      }`}
                      title={note.isPinned ? 'Unpin note' : 'Pin note to top'}
                    >
                      <Pin className={`w-3.5 h-3.5 ${note.isPinned ? 'fill-amber-700 text-amber-700' : ''}`} />
                    </button>
                  </div>

                  {/* Title */}
                  <h3 className="font-extrabold text-slate-900 text-base leading-snug mb-2">
                    {note.title}
                  </h3>

                  {/* Content snippet */}
                  <div className="text-xs sm:text-sm text-slate-800 font-mono leading-relaxed whitespace-pre-wrap line-clamp-6 bg-slate-50 p-3 rounded-xl border border-slate-200">
                    {note.content}
                  </div>

                  {/* Tags */}
                  {note.tags && note.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {note.tags.map((t) => (
                        <span key={t} className="text-xs font-mono font-bold text-slate-700 bg-slate-200 px-2 py-0.5 rounded-md">
                          #{t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer Actions */}
                <div className="flex items-center justify-between pt-3 mt-4 border-t border-slate-200 text-xs text-slate-600 font-medium">
                  <span>{note.updatedAt}</span>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleCopyNote(note)}
                      className="p-1.5 rounded-lg text-slate-700 hover:text-slate-950 hover:bg-slate-100 transition-colors border border-slate-200"
                      title="Copy note content"
                    >
                      {isCopied ? (
                        <Check className="w-3.5 h-3.5 text-emerald-700" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <button
                      onClick={() => onOpenNoteModal(note)}
                      className="p-1.5 rounded-lg text-slate-700 hover:text-slate-950 hover:bg-slate-100 transition-colors border border-slate-200"
                      title="Edit note"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteNote(note.id)}
                      className="p-1.5 rounded-lg text-slate-700 hover:text-rose-700 hover:bg-rose-50 transition-colors border border-slate-200"
                      title="Delete note"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

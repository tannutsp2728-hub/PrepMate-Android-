import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Circle, 
  Plus, 
  Search, 
  Filter, 
  Trash2, 
  Edit3, 
  Clock, 
  Calendar, 
  AlertCircle,
  GraduationCap,
  Target
} from 'lucide-react';
import { AppState, Task, TaskPriority } from '../../types';
import { getTodayDateString } from '../../data/sampleData';
import { PencilNotesIllustration } from '../illustrations/StudyIllustrations';

interface TasksViewProps {
  state: AppState;
  onToggleTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onEditTask: (task: Task) => void;
  onAddNewTask: (category?: 'college' | 'competitive') => void;
}

export const TasksView: React.FC<TasksViewProps> = ({
  state,
  onToggleTask,
  onDeleteTask,
  onEditTask,
  onAddNewTask
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'college' | 'competitive'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const today = getTodayDateString();

  // Filter tasks
  const filteredTasks = state.tasks.filter((task) => {
    // Tab filter
    if (activeTab === 'college' && task.category !== 'college') return false;
    if (activeTab === 'competitive' && task.category !== 'competitive') return false;

    // Status filter
    if (statusFilter === 'pending' && task.completed) return false;
    if (statusFilter === 'completed' && !task.completed) return false;

    // Priority filter
    if (priorityFilter !== 'all' && task.priority !== priorityFilter) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = task.title.toLowerCase().includes(q);
      const matchDesc = task.description?.toLowerCase().includes(q);
      const sub = state.subjects.find(s => s.id === task.subjectId);
      const matchSub = sub?.name.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchSub) return false;
    }

    return true;
  });

  // Task Counts
  const totalCount = state.tasks.length;
  const collegeCount = state.tasks.filter(t => t.category === 'college').length;
  const competitiveCount = state.tasks.filter(t => t.category === 'competitive').length;
  const completedCount = state.tasks.filter(t => t.completed).length;
  const pendingCount = totalCount - completedCount;

  const getSubject = (subId?: string) => state.subjects.find(s => s.id === subId);

  const getDueDateLabel = (dueDateStr: string) => {
    if (dueDateStr === today) return { label: 'Due Today', isOverdue: false, isToday: true };
    if (dueDateStr < today) return { label: `Overdue (${dueDateStr})`, isOverdue: true, isToday: false };
    return { label: `Due ${dueDateStr}`, isOverdue: false, isToday: false };
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header and Quick Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-3xl border border-amber-200/70 shadow-xs relative overflow-hidden bg-gradient-to-r from-white via-white to-amber-50/30">
        <div className="flex items-center gap-3.5">
          <div className="shrink-0 hidden sm:block">
            <PencilNotesIllustration size={50} />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Study Tasks</h1>
            <p className="text-xs sm:text-sm text-slate-600 font-semibold mt-0.5">
              Organize coursework deadlines and competitive exam targets in parallel
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => onAddNewTask('college')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-950 hover:bg-indigo-100 text-xs font-black transition-colors"
          >
            <GraduationCap className="w-4 h-4 text-indigo-700" />
            <span>+ College Task</span>
          </button>
          <button
            onClick={() => onAddNewTask('competitive')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 hover:bg-amber-100 text-xs font-black transition-colors"
          >
            <Target className="w-4 h-4 text-amber-700" />
            <span>+ Competitive Task</span>
          </button>
        </div>
      </div>

      {/* Main Filter Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-amber-200/70 shadow-xs space-y-4">
        {/* Track Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'all'
                  ? 'bg-white text-slate-900 shadow-xs font-extrabold'
                  : 'text-slate-700 hover:text-slate-950'
              }`}
            >
              All Tracks ({totalCount})
            </button>
            <button
              onClick={() => setActiveTab('college')}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'college'
                  ? 'bg-white text-indigo-900 shadow-xs font-extrabold'
                  : 'text-slate-700 hover:text-slate-950'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5 text-indigo-700" />
              <span>College ({collegeCount})</span>
            </button>
            <button
              onClick={() => setActiveTab('competitive')}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'competitive'
                  ? 'bg-white text-amber-950 shadow-xs font-extrabold'
                  : 'text-slate-700 hover:text-slate-950'
              }`}
            >
              <Target className="w-3.5 h-3.5 text-amber-700" />
              <span>Competitive Exam ({competitiveCount})</span>
            </button>
          </div>

          {/* Status Segmented Control */}
          <div className="flex items-center gap-1 text-xs">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
                statusFilter === 'all' ? 'bg-slate-200 text-slate-900' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All ({totalCount})
            </button>
            <button
              onClick={() => setStatusFilter('pending')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
                statusFilter === 'pending' ? 'bg-slate-200 text-slate-900 font-extrabold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Pending ({pendingCount})
            </button>
            <button
              onClick={() => setStatusFilter('completed')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
                statusFilter === 'completed' ? 'bg-slate-200 text-slate-900 font-extrabold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Completed ({completedCount})
            </button>
          </div>
        </div>

        {/* Search & Priority Selector */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tasks, descriptions, or subjects..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-600 bg-white text-slate-900 placeholder:text-slate-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs font-bold text-slate-700 whitespace-nowrap">Priority:</span>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-600 bg-white text-slate-800"
            >
              <option value="all">All Priorities</option>
              <option value="high">High Only</option>
              <option value="medium">Medium Only</option>
              <option value="low">Low Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-300 p-12 text-center">
            <p className="text-sm font-bold text-slate-700">No tasks match the selected filters.</p>
            <p className="text-xs text-slate-600 mt-1">Try resetting the search or filter options.</p>
            <button
              onClick={() => onAddNewTask(activeTab === 'all' ? 'college' : activeTab)}
              className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Task</span>
            </button>
          </div>
        ) : (
          filteredTasks.map((task) => {
            const subject = getSubject(task.subjectId);
            const isCollege = task.category === 'college';
            const dueInfo = getDueDateLabel(task.dueDate);

            return (
              <div
                key={task.id}
                className={`bg-white rounded-2xl border transition-all p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  task.completed
                    ? 'border-slate-200 bg-slate-100/70 text-slate-500'
                    : 'border-slate-300 hover:border-slate-400 hover:shadow-xs'
                }`}
              >
                {/* Checkbox and task content */}
                <div className="flex items-start gap-3.5 flex-1 min-w-0">
                  <button
                    type="button"
                    onClick={() => onToggleTask(task.id)}
                    className="mt-0.5 text-slate-500 hover:text-indigo-700 transition-colors focus:outline-none shrink-0"
                  >
                    {task.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <Circle className="w-5 h-5 stroke-[2]" />
                    )}
                  </button>

                  <div className="min-w-0 flex-1">
                    {/* Unboxed Metadata Header */}
                    <div className="flex items-center gap-2 flex-wrap text-xs text-slate-700 mb-1">
                      <span className={`font-extrabold ${isCollege ? 'text-indigo-900' : 'text-amber-900'}`}>
                        {isCollege ? 'College' : 'Competitive Exam'}
                      </span>
                      {subject && (
                        <>
                          <span className="text-slate-400 font-bold">·</span>
                          <span className="truncate max-w-[220px] text-slate-800 font-bold">
                            {subject.name}
                          </span>
                        </>
                      )}
                      <span className="text-slate-400 font-bold">·</span>
                      <span className={`font-bold ${
                        dueInfo.isOverdue && !task.completed
                          ? 'text-rose-700 font-extrabold'
                          : dueInfo.isToday && !task.completed
                          ? 'text-amber-800 font-extrabold'
                          : 'text-slate-700'
                      }`}>
                        {dueInfo.label}
                      </span>
                      <span className="text-slate-400 font-bold">·</span>
                      <span className="flex items-center gap-1 font-mono text-[11px] font-semibold text-slate-700">
                        <Clock className="w-3 h-3 text-slate-500" />
                        {task.estimatedMinutes}m
                      </span>
                      {task.priority === 'high' && (
                        <>
                          <span className="text-slate-400 font-bold">·</span>
                          <span className="text-rose-700 font-extrabold">High Priority</span>
                        </>
                      )}
                    </div>

                    {/* Task Title */}
                    <h3 className={`text-sm sm:text-base font-bold leading-snug ${
                      task.completed ? 'line-through text-slate-500' : 'text-slate-900'
                    }`}>
                      {task.title}
                    </h3>

                    {/* Description */}
                    {task.description && (
                      <p className={`text-xs mt-1 leading-relaxed font-medium ${task.completed ? 'text-slate-500' : 'text-slate-600'}`}>
                        {task.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Actions & XP reward */}
                <div className="flex items-center gap-2 sm:self-center shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-200 justify-end">
                  <span
                    className={`text-xs font-black px-2.5 py-1 rounded-xl border ${
                      task.completed
                        ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                        : 'bg-amber-50 text-amber-950 border-amber-300'
                    }`}
                  >
                    +{task.xpReward || 10} XP ⭐
                  </span>
                  <button
                    onClick={() => onEditTask(task)}
                    className="p-2 rounded-xl text-slate-600 hover:text-slate-950 hover:bg-slate-100 transition-colors border border-slate-200"
                    title="Edit Task"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDeleteTask(task.id)}
                    className="p-2 rounded-xl text-slate-600 hover:text-rose-700 hover:bg-rose-50 transition-colors border border-slate-200"
                    title="Delete Task"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

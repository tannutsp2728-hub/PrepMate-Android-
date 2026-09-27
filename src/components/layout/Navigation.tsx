import React from 'react';
import { 
  LayoutDashboard, 
  ListTodo, 
  BookOpen, 
  RotateCcw, 
  Timer, 
  StickyNote, 
  TrendingUp 
} from 'lucide-react';
import { AppState } from '../../types';
import { getTodayDateString } from '../../data/sampleData';

interface NavigationProps {
  state: AppState;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  state,
  activeTab,
  setActiveTab
}) => {
  const today = getTodayDateString();

  // Counts for badges
  const pendingTasksToday = state.tasks.filter(t => t.dueDate === today && !t.completed).length;
  const revisionsDueCount = state.topics.filter(t => t.nextRevisionDate && t.nextRevisionDate <= today).length;

  // Desktop / Tablet full navigation
  const desktopNavItems = [
    {
      id: 'dashboard',
      label: 'Home',
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: 'tasks',
      label: 'Tasks',
      icon: ListTodo,
      badge: pendingTasksToday > 0 ? pendingTasksToday : null,
      badgeColor: 'bg-amber-100 text-amber-900 border border-amber-300'
    },
    {
      id: 'planner',
      label: 'Plan',
      icon: BookOpen,
      badge: null
    },
    {
      id: 'revision',
      label: 'Revision',
      icon: RotateCcw,
      badge: revisionsDueCount > 0 ? revisionsDueCount : null,
      badgeColor: 'bg-rose-100 text-rose-900 border border-rose-300'
    },
    {
      id: 'timer',
      label: 'Focus',
      icon: Timer,
      badge: null
    },
    {
      id: 'notes',
      label: 'Notes',
      icon: StickyNote,
      badge: null
    },
    {
      id: 'progress',
      label: 'Progress',
      icon: TrendingUp,
      badge: null
    }
  ];

  // Mobile Bottom Navigation: exactly Home, Tasks, Plan, Focus, Notes
  const mobileNavItems = [
    {
      id: 'dashboard',
      label: 'Home',
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: 'tasks',
      label: 'Tasks',
      icon: ListTodo,
      badge: pendingTasksToday > 0 ? pendingTasksToday : null
    },
    {
      id: 'planner',
      label: 'Plan',
      icon: BookOpen,
      badge: null
    },
    {
      id: 'timer',
      label: 'Focus',
      icon: Timer,
      badge: null
    },
    {
      id: 'notes',
      label: 'Notes',
      icon: StickyNote,
      badge: null
    }
  ];

  return (
    <>
      {/* Desktop / Tablet Navigation Bar */}
      <nav aria-label="Desktop Primary Navigation" className="bg-[#faf7f2] border-b border-amber-200/60 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1 sm:space-x-2 overflow-x-auto py-2.5 no-scrollbar">
            {desktopNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-bold rounded-2xl whitespace-nowrap transition-all focus:outline-none ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-xs scale-102 font-extrabold'
                      : 'text-slate-700 hover:text-slate-950 hover:bg-amber-100/50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-amber-300' : 'text-slate-600'}`} />
                  <span>{item.label}</span>
                  {item.badge !== null && (
                    <span
                      className={`ml-1 text-[11px] font-bold px-1.5 py-0.2 rounded-full ${
                        isActive ? 'bg-white/20 text-white' : item.badgeColor
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Mobile Fixed Bottom Navigation Bar: Home, Tasks, Plan, Focus, Notes */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#faf7f2]/95 backdrop-blur-md border-t border-amber-200/70 px-2 py-1.5 shadow-lg">
        <div className="grid grid-cols-5 gap-1">
          {mobileNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-2xl text-[11px] font-bold transition-all relative ${
                  isActive ? 'text-amber-950 bg-amber-100/80 font-black shadow-2xs' : 'text-slate-600 hover:text-slate-950'
                }`}
              >
                <div className="relative">
                  <Icon className={`w-5 h-5 mb-0.5 ${isActive ? 'text-amber-800 stroke-[2.4]' : 'text-slate-500'}`} />
                  {item.badge !== null && (
                    <span className="absolute -top-1 -right-2 w-4 h-4 bg-rose-500 text-white rounded-full text-[9px] flex items-center justify-center font-bold shadow-xs">
                      {item.badge}
                    </span>
                  )}
                </div>
                <span className="truncate max-w-[60px] tracking-tight">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
};

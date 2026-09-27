import React from 'react';
import { Star, Flame, Target, Trophy, Sparkles, CheckCircle2 } from 'lucide-react';

export interface XpNotification {
  id: string;
  amount: number;
  message: string;
}

interface XpToastProps {
  notifications: XpNotification[];
}

export const XpToastContainer: React.FC<XpToastProps> = ({ notifications }) => {
  if (notifications.length === 0) return null;

  const getToastIcon = (message: string) => {
    const lower = message.toLowerCase();
    if (lower.includes('streak')) {
      return (
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-400 text-white flex items-center justify-center font-black text-xs shrink-0 shadow-sm animate-bounce">
          <Flame className="w-4 h-4 fill-white" />
        </div>
      );
    }
    if (lower.includes('quest') || lower.includes('task')) {
      return (
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center font-black text-xs shrink-0 shadow-sm">
          <Target className="w-4 h-4" />
        </div>
      );
    }
    if (lower.includes('level') || lower.includes('rank')) {
      return (
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-400 text-white flex items-center justify-center font-black text-xs shrink-0 shadow-sm animate-pulse">
          <Trophy className="w-4 h-4 text-amber-200" />
        </div>
      );
    }
    return (
      <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-400 to-yellow-300 text-amber-950 flex items-center justify-center font-black text-xs shrink-0 shadow-sm">
        <Star className="w-4 h-4 fill-amber-950 text-amber-950" />
      </div>
    );
  };

  return (
    <div className="fixed bottom-20 right-4 sm:bottom-8 sm:right-8 z-50 flex flex-col gap-2.5 pointer-events-none max-w-sm">
      {notifications.map((n) => (
        <div
          key={n.id}
          className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-slate-900/95 text-white shadow-2xl border border-amber-300/40 backdrop-blur-md animate-in slide-in-from-bottom-3 zoom-in-95 duration-200 pointer-events-auto transition-transform hover:scale-102"
        >
          {getToastIcon(n.message)}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="font-black text-sm text-amber-300 tracking-tight">
                +{n.amount} XP
              </span>
              <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded-full bg-white/10 text-slate-300 tracking-wide">
                Progress
              </span>
            </div>
            <p className="text-xs font-bold text-slate-100 truncate mt-0.5">
              {n.message}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};


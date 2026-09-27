import React from 'react';
import { Award, Sparkles, ArrowRight, Flame, Star, Check } from 'lucide-react';
import { LevelInfo } from '../../utils/gamification';

interface LevelUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  levelInfo: LevelInfo;
  previousLevel: number;
}

export const LevelUpModal: React.FC<LevelUpModalProps> = ({
  isOpen,
  onClose,
  levelInfo,
  previousLevel
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border-2 border-amber-300 text-center relative overflow-hidden transform animate-in zoom-in-95 duration-300">
        {/* Glow decoration */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-amber-200/50 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-indigo-200/50 rounded-full blur-2xl pointer-events-none" />

        {/* Level badge icon */}
        <div className="relative mx-auto w-24 h-24 mb-4 flex items-center justify-center">
          <div className="absolute inset-0 bg-amber-100 rounded-3xl rotate-6 animate-pulse" />
          <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-400 text-white flex flex-col items-center justify-center shadow-lg border-2 border-white">
            <Award className="w-9 h-9 drop-shadow" />
            <span className="text-[11px] font-black tracking-widest uppercase">LVL {levelInfo.level}</span>
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-950 font-black text-xs uppercase tracking-wider mb-2 border border-amber-300">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>Level Up Achieved!</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-1">
          {levelInfo.title}
        </h2>
        <p className="text-xs sm:text-sm font-semibold text-slate-700 max-w-xs mx-auto mb-6">
          Congratulations! You advanced from Level {previousLevel} to Level {levelInfo.level}. Your consistency and focus are paving the way to exam excellence.
        </p>

        {/* Level Perks Card */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left mb-6 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Unlocked new academic rank: {levelInfo.title}</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
            <Star className="w-4 h-4 text-amber-500 shrink-0" />
            <span>XP Range: {levelInfo.minXp} - {levelInfo.maxXp} XP</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
            <Flame className="w-4 h-4 text-orange-500 shrink-0" />
            <span>Daily study momentum multiplier active</span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3.5 px-6 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black text-sm shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2"
        >
          <span>Claim Rank & Keep Going</span>
          <ArrowRight className="w-4 h-4 text-amber-400" />
        </button>
      </div>
    </div>
  );
};

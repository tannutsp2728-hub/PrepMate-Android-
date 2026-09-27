import React, { useState } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Clock, 
  CheckCircle2, 
  GraduationCap, 
  Target, 
  Sparkles,
  Flame,
  Award
} from 'lucide-react';
import { AppState, FocusSession, TrackType } from '../../types';
import { soundManager } from '../../utils/sound';
import { getTodayDateString } from '../../data/sampleData';
import { CozyClockIllustration } from '../illustrations/StudyIllustrations';

interface FocusTimerViewProps {
  state: AppState;
  onRecordSession: (session: FocusSession) => void;
  timerSecondsLeft: number;
  timerActive: boolean;
  timerMode: 'focus' | 'short_break' | 'long_break';
  activeTrack: 'college' | 'competitive';
  activeSubjectId: string;
  onStartTimer: () => void;
  onPauseTimer: () => void;
  onResetTimer: (mode?: 'focus' | 'short_break' | 'long_break') => void;
  onSelectTrack: (track: 'college' | 'competitive') => void;
  onSelectSubject: (subId: string) => void;
}

export const FocusTimerView: React.FC<FocusTimerViewProps> = ({
  state,
  onRecordSession,
  timerSecondsLeft,
  timerActive,
  timerMode,
  activeTrack,
  activeSubjectId,
  onStartTimer,
  onPauseTimer,
  onResetTimer,
  onSelectTrack,
  onSelectSubject
}) => {
  const [ambientSound, setAmbientSound] = useState<'off' | 'brown' | 'rain'>('off');

  const today = getTodayDateString();

  // Completed sessions today
  const todaySessions = state.focusSessions.filter(s => s.completedAt.startsWith(today));
  const todayFocusMinutes = todaySessions.reduce((acc, s) => acc + s.durationMinutes, 0);

  const totalDuration = timerMode === 'focus' ? 25 * 60 : timerMode === 'short_break' ? 5 * 60 : 15 * 60;
  const progressPercent = Math.min(100, Math.max(0, ((totalDuration - timerSecondsLeft) / totalDuration) * 100));

  const minutes = Math.floor(timerSecondsLeft / 60);
  const seconds = timerSecondsLeft % 60;
  const timeFormatted = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  const handleToggleAmbient = (type: 'brown' | 'rain') => {
    if (ambientSound === type) {
      soundManager.stopAmbientNoise();
      setAmbientSound('off');
    } else {
      soundManager.startAmbientNoise(type, 0.15);
      setAmbientSound(type);
    }
  };

  const getSubject = (subId?: string) => state.subjects.find(s => s.id === subId);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-300 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">Focus Pomodoro Timer</h1>
          <p className="text-xs sm:text-sm text-slate-700 font-medium mt-0.5">
            25-minute deep focus intervals with scientific short break recovery
          </p>
        </div>

        {/* Today's Focus Summary */}
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-xl bg-slate-100 border border-slate-300 text-center">
            <span className="text-lg font-extrabold text-slate-900">{todaySessions.length}</span>
            <span className="text-xs text-slate-700 block font-bold">Sessions Today</span>
          </div>
          <div className="px-4 py-2 rounded-xl bg-indigo-50 border border-indigo-200 text-center">
            <span className="text-lg font-extrabold text-indigo-900">{todayFocusMinutes}m</span>
            <span className="text-xs text-indigo-800 block font-bold">Total Focus</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
        {/* Main Timer Display (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-300 p-6 sm:p-8 shadow-xs flex flex-col items-center text-center">
          {/* Mode Switcher */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl mb-6 text-xs font-bold border border-slate-200">
            <button
              onClick={() => onResetTimer('focus')}
              className={`px-4 py-2 rounded-lg transition-all ${
                timerMode === 'focus' ? 'bg-white text-slate-900 shadow-xs font-extrabold' : 'text-slate-700 hover:text-slate-950'
              }`}
            >
              25m Focus
            </button>
            <button
              onClick={() => onResetTimer('short_break')}
              className={`px-4 py-2 rounded-lg transition-all ${
                timerMode === 'short_break' ? 'bg-white text-emerald-900 shadow-xs font-extrabold' : 'text-slate-700 hover:text-slate-950'
              }`}
            >
              5m Short Break
            </button>
            <button
              onClick={() => onResetTimer('long_break')}
              className={`px-4 py-2 rounded-lg transition-all ${
                timerMode === 'long_break' ? 'bg-white text-indigo-900 shadow-xs font-extrabold' : 'text-slate-700 hover:text-slate-950'
              }`}
            >
              15m Long Break
            </button>
          </div>

          {/* Circular Visual & Large Digital Clock */}
          <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center my-2">
            {/* SVG Circular Progress Ring */}
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="44"
                className="stroke-slate-200"
                strokeWidth="7"
                fill="none"
              />
              <circle
                cx="50"
                cy="50"
                r="44"
                className={`transition-all duration-300 ${
                  timerMode === 'focus'
                    ? activeTrack === 'college' ? 'stroke-indigo-700' : 'stroke-amber-600'
                    : 'stroke-emerald-600'
                }`}
                strokeWidth="7"
                strokeDasharray="276.46"
                strokeDashoffset={276.46 - (276.46 * progressPercent) / 100}
                strokeLinecap="round"
                fill="none"
              />
            </svg>

            {/* Inner Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-5xl sm:text-6xl font-extrabold font-mono tracking-tighter text-slate-950">
                {timeFormatted}
              </span>
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider mt-2.5">
                {timerMode === 'focus' ? `${activeTrack.toUpperCase()} FOCUS` : 'REST & RECOVER'}
              </span>
              {timerActive && (
                <div className="flex items-center gap-1.5 mt-2 text-xs text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
                  <span>Session Active</span>
                </div>
              )}
            </div>
          </div>

          {/* Primary Controls */}
          <div className="flex items-center gap-3 mt-6">
            {!timerActive ? (
              <button
                onClick={onStartTimer}
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-sm sm:text-base shadow-sm transition-transform active:scale-95"
              >
                <Play className="w-5 h-5 fill-white" />
                <span>Start Session</span>
              </button>
            ) : (
              <button
                onClick={onPauseTimer}
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-sm sm:text-base shadow-sm transition-transform active:scale-95"
              >
                <Pause className="w-5 h-5" />
                <span>Pause</span>
              </button>
            )}

            <button
              onClick={() => onResetTimer()}
              className="p-3.5 rounded-xl border border-slate-300 text-slate-700 hover:text-slate-950 hover:bg-slate-100 transition-colors"
              title="Reset Timer"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>

          {/* Ambient Background Noise Selector */}
          <div className="mt-8 pt-6 border-t border-slate-200 w-full flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <span className="font-bold text-slate-800 flex items-center gap-1.5">
              <Volume2 className="w-4 h-4 text-slate-600" />
              <span>Ambient Focus Sound (Web Audio):</span>
            </span>
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                onClick={() => {
                  soundManager.stopAmbientNoise();
                  setAmbientSound('off');
                }}
                className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
                  ambientSound === 'off' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-700'
                }`}
              >
                Mute
              </button>
              <button
                onClick={() => handleToggleAmbient('brown')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
                  ambientSound === 'brown' ? 'bg-white text-indigo-900 shadow-xs' : 'text-slate-700'
                }`}
              >
                Brown Noise
              </button>
              <button
                onClick={() => handleToggleAmbient('rain')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
                  ambientSound === 'rain' ? 'bg-white text-sky-900 shadow-xs' : 'text-slate-700'
                }`}
              >
                Gentle Rain
              </button>
            </div>
          </div>
        </div>

        {/* Right Settings & History Column (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Session Tagging */}
          <div className="bg-white rounded-3xl border border-slate-300 p-5 sm:p-6 shadow-xs">
            <h3 className="text-base font-extrabold text-slate-900 mb-3">Tag Active Session</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">Study Track</label>
                <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl border border-slate-200">
                  <button
                    type="button"
                    onClick={() => onSelectTrack('college')}
                    className={`py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                      activeTrack === 'college'
                        ? 'bg-white text-indigo-900 shadow-xs font-extrabold'
                        : 'text-slate-700 hover:text-slate-950'
                    }`}
                  >
                    <GraduationCap className="w-4 h-4 text-indigo-700" />
                    <span>College</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onSelectTrack('competitive')}
                    className={`py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                      activeTrack === 'competitive'
                        ? 'bg-white text-amber-950 shadow-xs font-extrabold'
                        : 'text-slate-700 hover:text-slate-950'
                    }`}
                  >
                    <Target className="w-4 h-4 text-amber-700" />
                    <span>Competitive</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">Subject</label>
                <select
                  value={activeSubjectId}
                  onChange={(e) => onSelectSubject(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-600 bg-white text-slate-900"
                >
                  <option value="">(No specific subject)</option>
                  {state.subjects.map((sub) => (
                    <option key={sub.id} value={sub.id}>
                      {sub.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Today's Completed Sessions Log */}
          <div className="bg-white rounded-3xl border border-slate-300 p-5 sm:p-6 shadow-xs">
            <h3 className="text-base font-extrabold text-slate-900 mb-3">Completed Sessions Log</h3>

            {state.focusSessions.length === 0 ? (
              <p className="text-xs sm:text-sm text-slate-600 py-4 text-center font-medium">No focus sessions recorded yet today.</p>
            ) : (
              <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                {state.focusSessions.slice(0, 8).map((session) => {
                  const sub = getSubject(session.subjectId);
                  const isCollege = session.track === 'college';
                  const timeStr = new Date(session.completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                  return (
                    <div
                      key={session.id}
                      className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between text-xs"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 text-slate-700 text-xs font-semibold">
                          <span className={`font-extrabold ${isCollege ? 'text-indigo-900' : 'text-amber-900'}`}>
                            {isCollege ? 'College' : 'Competitive'}
                          </span>
                          <span>·</span>
                          <span>{timeStr}</span>
                        </div>
                        <div className="font-bold text-slate-900 truncate mt-0.5">
                          {sub ? sub.name : 'Focus Session'}
                        </div>
                      </div>

                      <span className="font-mono font-extrabold text-slate-900 shrink-0 ml-2">
                        +{session.durationMinutes}m
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { X, Download, Upload, RefreshCw, User, Award, Check } from 'lucide-react';
import { StudentProfile, AppState } from '../../types';
import { exportDataAsJSON, importDataFromJSON, resetToSampleData } from '../../utils/storage';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: StudentProfile;
  onUpdateProfile: (profile: StudentProfile) => void;
  fullState: AppState;
  onStateReload: (newState: AppState) => void;
  onRerunOnboarding: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onUpdateProfile,
  fullState,
  onStateReload,
  onRerunOnboarding
}) => {
  const [name, setName] = useState(profile.name);
  const [collegeName, setCollegeName] = useState(profile.collegeName || 'State University');
  const [collegeMajor, setCollegeMajor] = useState(profile.collegeMajor);
  const [collegeYear, setCollegeYear] = useState(profile.collegeYear);
  const [targetExam, setTargetExam] = useState(profile.targetExam);
  const [targetExamDate, setTargetExamDate] = useState(profile.targetExamDate || '');
  const [dailyGoalHours, setDailyGoalHours] = useState(profile.dailyGoalHours);
  const [dailyGoalSessions, setDailyGoalSessions] = useState(profile.dailyGoalSessions);

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      ...profile,
      name: name.trim(),
      collegeName: collegeName.trim(),
      collegeMajor: collegeMajor.trim(),
      collegeYear: collegeYear.trim(),
      targetExam: targetExam.trim(),
      targetExamDate: targetExamDate || undefined,
      dailyGoalHours: Number(dailyGoalHours) || 4,
      dailyGoalSessions: Number(dailyGoalSessions) || 5
    });
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 600);
  };

  const handleExport = () => {
    exportDataAsJSON(fullState);
    setStatusMessage('Backup JSON downloaded successfully');
    setTimeout(() => setStatusMessage(null), 3000);
  };

  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const imported = await importDataFromJSON(file);
      onStateReload(imported);
      setStatusMessage('Data restored successfully!');
      setTimeout(() => setStatusMessage(null), 3000);
    } catch (err) {
      setStatusMessage('Failed to import backup file. Ensure it is valid PrepMate JSON.');
      setTimeout(() => setStatusMessage(null), 4000);
    }
  };

  const handleResetData = () => {
    const resetState = resetToSampleData();
    onStateReload(resetState);
    setName(resetState.profile.name);
    setCollegeName(resetState.profile.collegeName);
    setCollegeMajor(resetState.profile.collegeMajor);
    setCollegeYear(resetState.profile.collegeYear);
    setTargetExam(resetState.profile.targetExam);
    setTargetExamDate(resetState.profile.targetExamDate || '');
    setStatusMessage('Reset to neutral sample data completed.');
    setTimeout(() => setStatusMessage(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-300 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-800 border border-indigo-200 flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900">Student Profile & Settings</h2>
              <p className="text-xs font-semibold text-slate-700">Study targets and storage configuration</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {statusMessage && (
          <div className="px-6 py-2.5 bg-emerald-50 border-b border-emerald-200 text-xs text-emerald-900 font-bold flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-700" />
            <span>{statusMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                Your Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Alex Rivera"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-600 text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                College / University
              </label>
              <input
                type="text"
                required
                value={collegeName}
                onChange={(e) => setCollegeName(e.target.value)}
                placeholder="e.g. State University"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-600 text-slate-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                Target Competitive Exam
              </label>
              <input
                type="text"
                required
                value={targetExam}
                onChange={(e) => setTargetExam(e.target.value)}
                placeholder="e.g., GRE / MCAT / Civil Services"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-600 text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                Target Exam Date
              </label>
              <input
                type="date"
                value={targetExamDate}
                onChange={(e) => setTargetExamDate(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-600 text-slate-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-1">
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                Daily Study Target (Hours)
              </label>
              <input
                type="number"
                min="1"
                max="16"
                value={dailyGoalHours}
                onChange={(e) => setDailyGoalHours(Number(e.target.value))}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-600 text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                Daily Focus Sessions
              </label>
              <input
                type="number"
                min="1"
                max="25"
                value={dailyGoalSessions}
                onChange={(e) => setDailyGoalSessions(Number(e.target.value))}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-600 text-slate-900"
              />
            </div>
          </div>

          {/* Backup, Restore & Reset */}
          <div className="pt-4 border-t border-slate-200">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
              Browser Data & Study Space Setup
            </h3>
            <p className="text-xs text-slate-700 mb-3">
              Your study data is kept persistently in this browser via localStorage.
            </p>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleExport}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors border border-slate-300"
              >
                <Download className="w-3.5 h-3.5 text-slate-700" />
                <span>Export Backup</span>
              </button>

              <label className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl cursor-pointer transition-colors border border-slate-300">
                <Upload className="w-3.5 h-3.5 text-slate-700" />
                <span>Import Backup</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportFile}
                  className="hidden"
                />
              </label>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  onRerunOnboarding();
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-indigo-800 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors border border-indigo-200"
              >
                <span>Rerun Setup Flow</span>
              </button>

              <button
                type="button"
                onClick={handleResetData}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-rose-800 bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors border border-rose-200 ml-auto"
              >
                <RefreshCw className="w-3.5 h-3.5 text-rose-600" />
                <span>Reset Neutral Data</span>
              </button>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-bold text-slate-700 hover:text-slate-950 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-xs transition-colors focus:outline-none focus:ring-2 focus:ring-slate-900"
            >
              {savedSuccess ? 'Saved!' : 'Save Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

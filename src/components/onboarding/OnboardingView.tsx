import React, { useState } from 'react';
import { 
  GraduationCap, 
  Target, 
  Calendar, 
  Plus, 
  X, 
  ArrowRight, 
  ArrowLeft,
  Sparkles, 
  BookOpen, 
  CheckCircle2,
  Building2,
  User,
  Flame,
  Rocket
} from 'lucide-react';
import { AppState } from '../../types';
import { createCustomStudySpace, generateInitialSampleData, getDateOffset } from '../../data/sampleData';
import { triggerConfetti } from '../../utils/confetti';

interface OnboardingViewProps {
  onComplete: (newState: AppState) => void;
}

export const OnboardingView: React.FC<OnboardingViewProps> = ({ onComplete }) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Step 1: Name
  const [name, setName] = useState('');

  // Step 2: College & Subjects
  const [collegeName, setCollegeName] = useState('');
  const [collegeSubjectInput, setCollegeSubjectInput] = useState('');
  const [collegeSubjects, setCollegeSubjects] = useState<string[]>([
    'Cell Biology',
    'Human Physiology',
    'General Chemistry'
  ]);

  // Step 3: Competitive Exam & Date
  const [targetExam, setTargetExam] = useState('');
  const [targetExamDate, setTargetExamDate] = useState(getDateOffset(90));

  // Step 4: Competitive Subjects / Topics
  const [compSubjectInput, setCompSubjectInput] = useState('');
  const [competitiveSubjects, setCompetitiveSubjects] = useState<string[]>([
    'Quantitative Aptitude',
    'General Knowledge'
  ]);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const suggestedExams = [
    'Graduate Record Exam (GRE)',
    'Medical College Admission (MCAT)',
    'Civil Services / UPSC',
    'GATE Exam',
    'GMAT / Business Admission',
    'USMLE / Medical Board'
  ];

  const handleAddCollegeSubject = () => {
    const trimmed = collegeSubjectInput.trim();
    if (trimmed && !collegeSubjects.includes(trimmed)) {
      setCollegeSubjects([...collegeSubjects, trimmed]);
      setCollegeSubjectInput('');
    }
  };

  const handleRemoveCollegeSubject = (sub: string) => {
    setCollegeSubjects(collegeSubjects.filter((s) => s !== sub));
  };

  const handleAddCompSubject = () => {
    const trimmed = compSubjectInput.trim();
    if (trimmed && !competitiveSubjects.includes(trimmed)) {
      setCompetitiveSubjects([...competitiveSubjects, trimmed]);
      setCompSubjectInput('');
    }
  };

  const handleRemoveCompSubject = (sub: string) => {
    setCompetitiveSubjects(competitiveSubjects.filter((s) => s !== sub));
  };

  // Step validation
  const goToNextStep = () => {
    setErrorMsg(null);
    if (step === 1) {
      if (!name.trim()) {
        setErrorMsg('Please enter your name to continue!');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!collegeName.trim()) {
        setErrorMsg('Please tell us your college or university!');
        return;
      }
      if (collegeSubjects.length === 0) {
        setErrorMsg('Add at least one college subject to build your path.');
        return;
      }
      setStep(3);
    } else if (step === 3) {
      if (!targetExam.trim()) {
        setErrorMsg('Please enter your target competitive exam.');
        return;
      }
      setStep(4);
    } else if (step === 4) {
      if (competitiveSubjects.length === 0) {
        setErrorMsg('Add at least one subject or topic for your exam preparation.');
        return;
      }
      setStep(5);
      triggerConfetti();
    }
  };

  const handleFinish = () => {
    const customState = createCustomStudySpace({
      name: name.trim() || 'Student',
      collegeName: collegeName.trim() || 'University',
      collegeSubjects,
      targetExam: targetExam.trim() || 'Competitive Exam',
      targetExamDate,
      competitiveSubjects
    });
    onComplete(customState);
  };

  const handleUseNeutralSample = () => {
    const sampleState = generateInitialSampleData('Priya Sharma', true);
    sampleState.profile.hasCompletedOnboarding = true;
    onComplete(sampleState);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50/60 via-slate-50 to-amber-50/40 flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-xl w-full mx-auto">
        {/* Brand Logo & Fun Tagline */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-3xl bg-slate-900 text-white shadow-lg mb-3">
            <GraduationCap className="w-8 h-8 text-amber-400" />
          </div>
          <div className="flex items-center justify-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-indigo-700">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Dual Academic & Exam Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            PrepMate
          </h1>
        </div>

        {/* Multi-step progress bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-2">
            <span>Step {step} of 5</span>
            <span className="text-indigo-700">
              {step === 1 && 'Introduction'}
              {step === 2 && 'College Studies'}
              {step === 3 && 'Target Exam'}
              {step === 4 && 'Learning Path'}
              {step === 5 && 'Ready!'}
            </span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
            <div
              className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / 5) * 100}%` }}
            />
          </div>
        </div>

        {/* Setup Card */}
        <div className="bg-white rounded-3xl border border-slate-300 shadow-xl p-6 sm:p-9 relative overflow-hidden">
          {errorMsg && (
            <div className="mb-5 p-3.5 rounded-2xl bg-rose-50 border border-rose-300 text-rose-900 text-xs sm:text-sm font-bold flex items-center justify-between">
              <span>{errorMsg}</span>
              <button onClick={() => setErrorMsg(null)} className="text-rose-600 hover:text-rose-800">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* STEP 1: Let's get to know you */}
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
              <div className="text-center">
                <span className="text-4xl">👋</span>
                <h2 className="text-2xl font-extrabold text-slate-900 mt-2">
                  Let's get to know you
                </h2>
                <p className="text-sm font-medium text-slate-600 mt-1">
                  What should we call you in your study space?
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                  Your Name *
                </label>
                <input
                  type="text"
                  autoFocus
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && goToNextStep()}
                  placeholder="e.g. Priya Sharma"
                  className="w-full px-4 py-3 rounded-2xl border-2 border-slate-300 text-base font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-600 bg-white"
                />
              </div>

              <div className="pt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleUseNeutralSample}
                  className="text-xs font-bold text-slate-500 hover:text-slate-800 underline"
                >
                  Quick demo with sample subjects
                </button>
                <button
                  type="button"
                  onClick={goToNextStep}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-sm shadow-md transition-all active:scale-95"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: What are you studying? */}
          {step === 2 && (
            <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
              <div className="text-center">
                <span className="text-4xl">📚</span>
                <h2 className="text-2xl font-extrabold text-slate-900 mt-2">
                  What are you studying?
                </h2>
                <p className="text-sm font-medium text-slate-600 mt-1">
                  Tell us your university and coursework subjects.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                    College / University *
                  </label>
                  <input
                    type="text"
                    required
                    value={collegeName}
                    onChange={(e) => setCollegeName(e.target.value)}
                    placeholder="e.g. State University / Stanford"
                    className="w-full px-4 py-2.5 rounded-2xl border-2 border-slate-300 text-sm font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-600 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                    College Subjects ({collegeSubjects.length})
                  </label>
                  <div className="flex items-center gap-2 mb-2">
                    <input
                      type="text"
                      value={collegeSubjectInput}
                      onChange={(e) => setCollegeSubjectInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddCollegeSubject();
                        }
                      }}
                      placeholder="Add course (e.g. Cell Biology)"
                      className="flex-1 px-3.5 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:border-indigo-600 bg-white"
                    />
                    <button
                      type="button"
                      onClick={handleAddCollegeSubject}
                      className="px-3 py-2 rounded-xl bg-indigo-50 text-indigo-900 border border-indigo-200 hover:bg-indigo-100 text-xs font-bold shrink-0"
                    >
                      + Add
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2 p-2.5 rounded-2xl bg-slate-50 border border-slate-200 min-h-[48px] items-center">
                    {collegeSubjects.map((sub) => (
                      <span
                        key={sub}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white border border-indigo-200 text-indigo-950 font-bold text-xs shadow-xs"
                      >
                        <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                        <span>{sub}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveCollegeSubject(sub)}
                          className="text-slate-400 hover:text-rose-600 ml-1 font-extrabold"
                        >
                          &times;
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-700 hover:text-slate-950"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={goToNextStep}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-sm shadow-md transition-all active:scale-95"
                >
                  <span>Next Step</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: What are you preparing for? */}
          {step === 3 && (
            <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
              <div className="text-center">
                <span className="text-4xl">🎯</span>
                <h2 className="text-2xl font-extrabold text-slate-900 mt-2">
                  What are you preparing for?
                </h2>
                <p className="text-sm font-medium text-slate-600 mt-1">
                  We'll tailor your daily missions and countdown timer.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                    Target Competitive Exam *
                  </label>
                  <input
                    type="text"
                    required
                    value={targetExam}
                    onChange={(e) => setTargetExam(e.target.value)}
                    placeholder="e.g. GRE / MCAT / Civil Services"
                    className="w-full px-4 py-2.5 rounded-2xl border-2 border-slate-300 text-sm font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-amber-600 bg-white"
                  />
                </div>

                <div>
                  <span className="text-[11px] font-bold text-slate-600 block mb-1">Quick Select:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {suggestedExams.map((exam) => (
                      <button
                        key={exam}
                        type="button"
                        onClick={() => setTargetExam(exam)}
                        className={`text-[11px] font-bold px-2.5 py-1 rounded-lg transition-colors ${
                          targetExam === exam
                            ? 'bg-amber-100 text-amber-950 border border-amber-400'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                        }`}
                      >
                        {exam}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                    Target Exam Date
                  </label>
                  <input
                    type="date"
                    value={targetExamDate}
                    onChange={(e) => setTargetExamDate(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl border-2 border-slate-300 text-sm font-bold text-slate-900 focus:outline-none focus:border-amber-600 bg-white"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-700 hover:text-slate-950"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={goToNextStep}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-sm shadow-md transition-all active:scale-95"
                >
                  <span>Next Step</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Build your learning path */}
          {step === 4 && (
            <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
              <div className="text-center">
                <span className="text-4xl">🚀</span>
                <h2 className="text-2xl font-extrabold text-slate-900 mt-2">
                  Build your learning path
                </h2>
                <p className="text-sm font-medium text-slate-600 mt-1">
                  Add key subjects and topics for {targetExam || 'your competitive exam'}.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                  Competitive Exam Topics ({competitiveSubjects.length})
                </label>
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="text"
                    value={compSubjectInput}
                    onChange={(e) => setCompSubjectInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddCompSubject();
                      }
                    }}
                    placeholder="Add topic (e.g. Quantitative Aptitude)"
                    className="flex-1 px-3.5 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:border-amber-600 bg-white"
                  />
                  <button
                    type="button"
                    onClick={handleAddCompSubject}
                    className="px-3 py-2 rounded-xl bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100 text-xs font-bold shrink-0"
                  >
                    + Add
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 p-2.5 rounded-2xl bg-slate-50 border border-slate-200 min-h-[48px] items-center">
                  {competitiveSubjects.map((sub) => (
                    <span
                      key={sub}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white border border-amber-200 text-amber-950 font-bold text-xs shadow-xs"
                    >
                      <Target className="w-3.5 h-3.5 text-amber-600" />
                      <span>{sub}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveCompSubject(sub)}
                        className="text-slate-400 hover:text-rose-600 ml-1 font-extrabold"
                      >
                        &times;
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-indigo-50/70 border border-indigo-200 text-xs text-indigo-950 font-medium">
                ⭐ <strong>Bonus:</strong> You'll start with <strong>100 Starter XP</strong> and an active study mission when you create your space!
              </div>

              <div className="pt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-700 hover:text-slate-950"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={goToNextStep}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm shadow-md transition-all active:scale-95"
                >
                  <span>Build My Space</span>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: Ready! */}
          {step === 5 && (
            <div className="space-y-6 text-center animate-in fade-in zoom-in-95 duration-300 py-3">
              <span className="text-5xl animate-bounce inline-block">🎉</span>
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                  Your PrepMate space is ready!
                </h2>
                <p className="text-sm sm:text-base text-slate-700 font-medium mt-2 max-w-md mx-auto">
                  Welcome aboard, <strong className="text-indigo-900">{name}</strong>! Your dual learning missions for <strong className="text-indigo-900">{collegeName}</strong> and <strong className="text-amber-900">{targetExam}</strong> have been customized.
                </p>
              </div>

              {/* Ready summary preview */}
              <div className="grid grid-cols-2 gap-3 text-left p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
                <div>
                  <span className="text-[11px] font-bold text-slate-500 uppercase block">College Courses</span>
                  <span className="font-extrabold text-slate-900">{collegeSubjects.length} subjects</span>
                </div>
                <div>
                  <span className="text-[11px] font-bold text-slate-500 uppercase block">Competitive Track</span>
                  <span className="font-extrabold text-amber-900">{targetExam}</span>
                </div>
                <div>
                  <span className="text-[11px] font-bold text-slate-500 uppercase block">Starting Level</span>
                  <span className="font-extrabold text-indigo-900">Level 1 · Getting Started</span>
                </div>
                <div>
                  <span className="text-[11px] font-bold text-slate-500 uppercase block">Initial XP</span>
                  <span className="font-extrabold text-amber-600">+100 XP Welcome ⭐</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleFinish}
                  className="w-full inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-base shadow-xl transition-all active:scale-95"
                >
                  <Rocket className="w-5 h-5 text-amber-400" />
                  <span>Let's Start!</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

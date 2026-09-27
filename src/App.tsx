import React, { useState, useEffect } from 'react';
import { Navbar } from './components/layout/Navbar';
import { Navigation } from './components/layout/Navigation';
import { OnboardingView } from './components/onboarding/OnboardingView';
import { DashboardView } from './components/dashboard/DashboardView';
import { TasksView } from './components/tasks/TasksView';
import { StudyPlannerView } from './components/planner/StudyPlannerView';
import { RevisionTrackerView } from './components/revision/RevisionTrackerView';
import { FocusTimerView } from './components/timer/FocusTimerView';
import { QuickNotesView } from './components/notes/QuickNotesView';
import { ProgressView } from './components/progress/ProgressView';

import { TaskModal } from './components/modals/TaskModal';
import { TopicModal } from './components/modals/TopicModal';
import { ExamModal } from './components/modals/ExamModal';
import { NoteModal } from './components/modals/NoteModal';
import { ProfileModal } from './components/modals/ProfileModal';
import { LevelUpModal } from './components/modals/LevelUpModal';
import { XpToastContainer, XpNotification } from './components/common/XpToast';

import { AppState, Task, Topic, Subject, UpcomingExam, QuickNote, FocusSession, StudentProfile, TopicStatus, TopicMastery } from './types';
import { loadAppState, saveAppState, calculateNextRevision } from './utils/storage';
import { getTodayDateString, getDateOffset } from './data/sampleData';
import { soundManager } from './utils/sound';
import { getLevelInfo, LevelInfo } from './utils/gamification';
import { triggerConfetti } from './utils/confetti';

export default function App() {
  const [state, setState] = useState<AppState>(() => loadAppState());
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // Gamification & Celebration state
  const [levelUpModalData, setLevelUpModalData] = useState<{
    isOpen: boolean;
    levelInfo: LevelInfo;
    previousLevel: number;
  }>({
    isOpen: false,
    levelInfo: getLevelInfo(state.gamification?.totalXp || 420),
    previousLevel: 1
  });

  const [xpToasts, setXpToasts] = useState<XpNotification[]>([]);

  const showXpToast = (amount: number, message: string) => {
    const id = `xp-${Date.now()}-${Math.random()}`;
    setXpToasts((prev) => [...prev, { id, amount, message }]);
    setTimeout(() => {
      setXpToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  };

  const awardXp = (amount: number, message: string) => {
    const today = getTodayDateString();
    let triggerLevelUp = false;
    let oldLevel = 1;
    let newLvlInfo = getLevelInfo(0);

    setState((prev) => {
      const currentGamification = prev.gamification || {
        totalXp: 0,
        todayXp: 0,
        currentStreak: 1,
        lastActiveDate: today,
        activeDates: [today],
        level: 1
      };

      const oldLevelInfo = getLevelInfo(currentGamification.totalXp);
      oldLevel = oldLevelInfo.level;
      const newTotalXp = currentGamification.totalXp + amount;
      const newTodayXp = currentGamification.todayXp + amount;
      const newLevelInfo = getLevelInfo(newTotalXp);
      newLvlInfo = newLevelInfo;

      // Streak tracking
      const activeSet = new Set(currentGamification.activeDates || []);
      const wasActiveToday = activeSet.has(today);
      activeSet.add(today);

      let newStreak = currentGamification.currentStreak || 1;
      let streakJustSaved = false;
      if (!wasActiveToday) {
        const yesterday = getDateOffset(-1);
        if (currentGamification.activeDates?.includes(yesterday)) {
          newStreak += 1;
        }
        streakJustSaved = true;
      }

      if (newLevelInfo.level > oldLevelInfo.level) {
        triggerLevelUp = true;
      }

      return {
        ...prev,
        gamification: {
          ...currentGamification,
          totalXp: newTotalXp,
          todayXp: newTodayXp,
          currentStreak: newStreak,
          lastActiveDate: today,
          activeDates: Array.from(activeSet),
          level: newLevelInfo.level
        }
      };
    });

    showXpToast(amount, message);

    if (triggerLevelUp) {
      setTimeout(() => {
        triggerConfetti();
        soundManager.playChime();
        showXpToast(0, `New level unlocked! 🏆 Level ${newLvlInfo.level} — ${newLvlInfo.title}`);
        setLevelUpModalData({
          isOpen: true,
          levelInfo: newLvlInfo,
          previousLevel: oldLevel
        });
      }, 300);
    }
  };

  // Modals state
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [defaultTaskCategory, setDefaultTaskCategory] = useState<'college' | 'competitive'>('college');

  const [isTopicModalOpen, setIsTopicModalOpen] = useState(false);
  const [editingTopic, setEditingTopic] = useState<Topic | null>(null);
  const [defaultTopicSubjectId, setDefaultTopicSubjectId] = useState<string | undefined>(undefined);

  const [isExamModalOpen, setIsExamModalOpen] = useState(false);
  const [editingExam, setEditingExam] = useState<UpcomingExam | null>(null);

  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<QuickNote | null>(null);

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Background Pomodoro Timer State (keeps running across tabs)
  const [timerMode, setTimerMode] = useState<'focus' | 'short_break' | 'long_break'>('focus');
  const [timerSecondsLeft, setTimerSecondsLeft] = useState(25 * 60);
  const [timerActive, setTimerActive] = useState(false);
  const [activeTrack, setActiveTrack] = useState<'college' | 'competitive'>('college');
  const [activeSubjectId, setActiveSubjectId] = useState<string>('');

  // Persist state changes
  useEffect(() => {
    saveAppState(state);
  }, [state]);

  // Pomodoro Interval Ticker
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (timerActive && timerSecondsLeft > 0) {
      interval = setInterval(() => {
        setTimerSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (timerActive && timerSecondsLeft === 0) {
      // Session finished!
      soundManager.playChime();

      if (timerMode === 'focus') {
        const completedSession: FocusSession = {
          id: `foc-${Date.now()}`,
          durationMinutes: 25,
          track: activeTrack,
          subjectId: activeSubjectId || undefined,
          completedAt: new Date().toISOString()
        };

        setState((prev) => ({
          ...prev,
          focusSessions: [completedSession, ...prev.focusSessions]
        }));

        awardXp(20, 'Focus quest conquered! (+20 XP)');

        // Transition to short break
        setTimerMode('short_break');
        setTimerSecondsLeft(5 * 60);
      } else {
        // Break finished, back to focus mode
        setTimerMode('focus');
        setTimerSecondsLeft(25 * 60);
      }
      setTimerActive(false);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerActive, timerSecondsLeft, timerMode, activeTrack, activeSubjectId]);

  // Timer controls
  const handleStartTimer = () => setTimerActive(true);
  const handlePauseTimer = () => setTimerActive(false);
  const handleResetTimer = (mode?: 'focus' | 'short_break' | 'long_break') => {
    setTimerActive(false);
    const newMode = mode || timerMode;
    setTimerMode(newMode);
    if (newMode === 'focus') setTimerSecondsLeft(25 * 60);
    else if (newMode === 'short_break') setTimerSecondsLeft(5 * 60);
    else setTimerSecondsLeft(15 * 60);
  };

  // Launch focus session from revision item ("Revise Now")
  const handleReviseNow = (topic: Topic) => {
    const sub = state.subjects.find(s => s.id === topic.subjectId);
    setActiveSubjectId(topic.subjectId);
    if (sub) {
      setActiveTrack(sub.track === 'competitive' ? 'competitive' : 'college');
    }
    setTimerMode('focus');
    setTimerSecondsLeft(25 * 60);
    setTimerActive(true);
    setActiveTab('timer');
  };

  // Onboarding completion
  const handleOnboardingComplete = (newState: AppState) => {
    setState(newState);
    saveAppState(newState);
    setActiveTab('dashboard');
  };

  const handleRerunOnboarding = () => {
    setState((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        hasCompletedOnboarding: false
      }
    }));
  };

  // Task Handlers
  const handleToggleTask = (taskId: string) => {
    let completedNow = false;
    let taskTitle = '';
    let xpVal = 10;

    setState((prev) => {
      const today = getTodayDateString();
      const updated = prev.tasks.map((task) => {
        if (task.id === taskId) {
          const willBeComplete = !task.completed;
          if (willBeComplete) {
            completedNow = true;
            taskTitle = task.title;
            xpVal = task.xpReward || 10;
            soundManager.playTaskComplete();
          }
          return {
            ...task,
            completed: willBeComplete,
            completedAt: willBeComplete ? `${today}T${new Date().toTimeString().slice(0, 8)}` : undefined
          };
        }
        return task;
      });
      return { ...prev, tasks: updated };
    });

    if (completedNow) {
      awardXp(xpVal, `Quest complete! ${taskTitle} (+${xpVal} XP)`);

      // Check if all today's missions are completed for the bonus +50 XP
      setTimeout(() => {
        setState((latest) => {
          const today = getTodayDateString();
          const todayTasks = latest.tasks.filter((t) => t.dueDate === today);
          const allDone = todayTasks.length > 0 && todayTasks.every((t) => t.completed);
          if (allDone && latest.gamification?.dailyBonusClaimedDate !== today) {
            setTimeout(() => {
              awardXp(50, "🎯 All Daily Quests Crushed! +50 XP Bonus!");
              triggerConfetti();
            }, 400);
            return {
              ...latest,
              gamification: {
                ...latest.gamification,
                dailyBonusClaimedDate: today
              }
            };
          }
          return latest;
        });
      }, 100);
    }
  };

  const handleSaveTask = (taskData: Partial<Task>) => {
    setState((prev) => {
      const exists = prev.tasks.some((t) => t.id === taskData.id);
      let updatedTasks: Task[];
      if (exists) {
        updatedTasks = prev.tasks.map((t) => (t.id === taskData.id ? ({ ...t, ...taskData } as Task) : t));
      } else {
        updatedTasks = [taskData as Task, ...prev.tasks];
      }
      return { ...prev, tasks: updatedTasks };
    });
  };

  const handleDeleteTask = (taskId: string) => {
    setState((prev) => ({
      ...prev,
      tasks: prev.tasks.filter((t) => t.id !== taskId)
    }));
  };

  const handleOpenNewTask = (cat: 'college' | 'competitive' = 'college') => {
    setDefaultTaskCategory(cat);
    setEditingTask(null);
    setIsTaskModalOpen(true);
  };

  const handleOpenEditTask = (task: Task) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  // Subject & Topic Handlers
  const handleSaveSubject = (newSub: Subject) => {
    setState((prev) => ({
      ...prev,
      subjects: [...prev.subjects, newSub]
    }));
  };

  const handleDeleteSubject = (subId: string) => {
    setState((prev) => ({
      ...prev,
      subjects: prev.subjects.filter((s) => s.id !== subId),
      topics: prev.topics.filter((t) => t.subjectId !== subId)
    }));
  };

  const handleSaveTopic = (topicData: Partial<Topic>) => {
    setState((prev) => {
      const exists = prev.topics.some((t) => t.id === topicData.id);
      let updatedTopics: Topic[];
      if (exists) {
        updatedTopics = prev.topics.map((t) => (t.id === topicData.id ? ({ ...t, ...topicData } as Topic) : t));
      } else {
        updatedTopics = [...prev.topics, topicData as Topic];
      }
      return { ...prev, topics: updatedTopics };
    });
  };

  const handleUpdateTopicStatus = (topicId: string, newStatus: TopicStatus) => {
    setState((prev) => {
      const today = getTodayDateString();
      const updated = prev.topics.map((t) => {
        if (t.id === topicId) {
          const isStudied = newStatus === 'learning' || newStatus === 'revised' || newStatus === 'strong';
          return {
            ...t,
            status: newStatus,
            lastStudiedDate: isStudied ? (t.lastStudiedDate || today) : t.lastStudiedDate,
            nextRevisionDate: isStudied ? (t.nextRevisionDate || today) : t.nextRevisionDate
          };
        }
        return t;
      });
      return { ...prev, topics: updated };
    });
  };

  const handleDeleteTopic = (topicId: string) => {
    setState((prev) => ({
      ...prev,
      topics: prev.topics.filter((t) => t.id !== topicId)
    }));
  };

  // Spaced Repetition: Mark Complete -> Advance interval according to:
  // Revision 1: 1 day later
  // Revision 2: 3 days later
  // Revision 3: 7 days later
  // Revision 4: 14 days later
  // Revision 5: 30 days later
  const handleQuickMarkRevised = (topicId: string) => {
    soundManager.playTaskComplete();
    const today = getTodayDateString();
    let topicName = '';

    setState((prev) => {
      const updated = prev.topics.map((t) => {
        if (t.id === topicId) {
          topicName = t.name;
          const currentStage = t.revisionCount || 0;
          const { nextRevisionDate } = calculateNextRevision(currentStage);
          const nextCount = currentStage + 1;
          const newStatus: TopicStatus = nextCount >= 5 ? 'strong' : 'revised';
          const newMastery: TopicMastery = nextCount >= 5 ? 'mastered' : nextCount >= 3 ? 'strong' : 'practicing';

          return {
            ...t,
            lastStudiedDate: today,
            revisionCount: nextCount,
            nextRevisionDate,
            status: newStatus,
            mastery: newMastery
          };
        }
        return t;
      });
      return { ...prev, topics: updated };
    });

    awardXp(15, `Revision quest complete! ${topicName || 'concept'} (+15 XP)`);
  };

  const handleUpdateTopicMastery = (topicId: string, mastery: TopicMastery) => {
    let topicTitle = '';
    let shouldAward = false;

    setState((prev) => {
      const today = getTodayDateString();
      const updated = prev.topics.map((t) => {
        if (t.id === topicId) {
          topicTitle = t.name;
          const wasStrong = t.mastery === 'strong' || t.mastery === 'mastered';
          if (!wasStrong && (mastery === 'strong' || mastery === 'mastered')) {
            shouldAward = true;
          }
          const newStatus: TopicStatus = 
            mastery === 'mastered' || mastery === 'strong' ? 'strong' :
            mastery === 'practicing' ? 'revised' :
            mastery === 'learning' ? 'learning' : 'not_started';

          return {
            ...t,
            mastery,
            status: newStatus,
            lastStudiedDate: mastery !== 'started' ? (t.lastStudiedDate || today) : t.lastStudiedDate
          };
        }
        return t;
      });
      return { ...prev, topics: updated };
    });

    if (shouldAward) {
      awardXp(15, `Mastery advanced to ${mastery.toUpperCase()} for ${topicTitle}!`);
      soundManager.playTaskComplete();
    }
  };

  const handleSetTopicStudiedDate = (topicId: string, studiedDate: string) => {
    setState((prev) => {
      const updated = prev.topics.map((t) => {
        if (t.id === topicId) {
          const { nextRevisionDate } = calculateNextRevision(t.revisionCount || 0);
          return {
            ...t,
            lastStudiedDate: studiedDate,
            nextRevisionDate,
            status: t.status === 'not_started' ? 'learning' : t.status,
            mastery: t.mastery === 'started' || !t.mastery ? 'learning' : t.mastery
          };
        }
        return t;
      });
      return { ...prev, topics: updated };
    });
  };

  // Exam / Deadline Handlers
  const handleSaveExam = (examData: Partial<UpcomingExam>) => {
    setState((prev) => {
      const exists = prev.upcomingExams.some((e) => e.id === examData.id);
      let updatedExams: UpcomingExam[];
      if (exists) {
        updatedExams = prev.upcomingExams.map((e) => (e.id === examData.id ? ({ ...e, ...examData } as UpcomingExam) : e));
      } else {
        updatedExams = [...prev.upcomingExams, examData as UpcomingExam];
      }
      return { ...prev, upcomingExams: updatedExams };
    });
  };

  // Quick Notes Handlers
  const handleSaveNote = (noteData: Partial<QuickNote>) => {
    setState((prev) => {
      const exists = prev.notes.some((n) => n.id === noteData.id);
      let updatedNotes: QuickNote[];
      if (exists) {
        updatedNotes = prev.notes.map((n) => (n.id === noteData.id ? ({ ...n, ...noteData } as QuickNote) : n));
      } else {
        updatedNotes = [noteData as QuickNote, ...prev.notes];
      }
      return { ...prev, notes: updatedNotes };
    });
  };

  const handleDeleteNote = (noteId: string) => {
    setState((prev) => ({
      ...prev,
      notes: prev.notes.filter((n) => n.id !== noteId)
    }));
  };

  const handleTogglePinNote = (noteId: string) => {
    setState((prev) => ({
      ...prev,
      notes: prev.notes.map((n) => (n.id === noteId ? { ...n, isPinned: !n.isPinned } : n))
    }));
  };

  // Profile Update Handler
  const handleUpdateProfile = (newProfile: StudentProfile) => {
    setState((prev) => ({
      ...prev,
      profile: newProfile
    }));
  };

  // If student has not set up profile / completed onboarding, show onboarding screen
  if (!state.profile.hasCompletedOnboarding) {
    return <OnboardingView onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="min-h-screen bg-[#faf7f2] text-slate-800 flex flex-col font-sans antialiased selection:bg-amber-100 selection:text-amber-900 pb-20 md:pb-12">
      {/* Header Bar */}
      <Navbar
        state={state}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenQuickAdd={() => handleOpenNewTask('college')}
        onOpenSettings={() => setIsProfileModalOpen(true)}
        timerActive={timerActive}
        timerSecondsLeft={timerSecondsLeft}
      />

      {/* Subnavigation Bar */}
      <Navigation
        state={state}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'dashboard' && (
          <DashboardView
            state={state}
            onToggleTask={handleToggleTask}
            onQuickMarkRevised={handleQuickMarkRevised}
            onReviseNow={handleReviseNow}
            onNavigateTab={setActiveTab}
            onOpenTaskModal={() => handleOpenNewTask('college')}
            onOpenExamModal={() => {
              setEditingExam(null);
              setIsExamModalOpen(true);
            }}
            onOpenSettings={() => setIsProfileModalOpen(true)}
          />
        )}

        {activeTab === 'tasks' && (
          <TasksView
            state={state}
            onToggleTask={handleToggleTask}
            onDeleteTask={handleDeleteTask}
            onEditTask={handleOpenEditTask}
            onAddNewTask={handleOpenNewTask}
          />
        )}

        {activeTab === 'planner' && (
          <StudyPlannerView
            state={state}
            onOpenTopicModal={(subId, topic) => {
              setDefaultTopicSubjectId(subId);
              setEditingTopic(topic || null);
              setIsTopicModalOpen(true);
            }}
            onUpdateTopicStatus={handleUpdateTopicStatus}
            onUpdateTopicMastery={handleUpdateTopicMastery}
            onDeleteTopic={handleDeleteTopic}
            onDeleteSubject={handleDeleteSubject}
            onReviseNow={handleReviseNow}
          />
        )}

        {activeTab === 'revision' && (
          <RevisionTrackerView
            state={state}
            onMarkTopicRevised={handleQuickMarkRevised}
            onSetTopicStudiedDate={handleSetTopicStudiedDate}
            onReviseNow={handleReviseNow}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'timer' && (
          <FocusTimerView
            state={state}
            onRecordSession={(session) => {
              setState((prev) => ({
                ...prev,
                focusSessions: [session, ...prev.focusSessions]
              }));
              awardXp(20, '25-minute Pomodoro focus session completed!');
            }}
            timerSecondsLeft={timerSecondsLeft}
            timerActive={timerActive}
            timerMode={timerMode}
            activeTrack={activeTrack}
            activeSubjectId={activeSubjectId}
            onStartTimer={handleStartTimer}
            onPauseTimer={handlePauseTimer}
            onResetTimer={handleResetTimer}
            onSelectTrack={setActiveTrack}
            onSelectSubject={setActiveSubjectId}
          />
        )}

        {activeTab === 'notes' && (
          <QuickNotesView
            state={state}
            onOpenNoteModal={(note) => {
              setEditingNote(note || null);
              setIsNoteModalOpen(true);
            }}
            onDeleteNote={handleDeleteNote}
            onTogglePinNote={handleTogglePinNote}
          />
        )}

        {activeTab === 'progress' && (
          <ProgressView state={state} />
        )}
      </main>

      {/* Modals */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSave={handleSaveTask}
        subjects={state.subjects}
        initialTask={editingTask}
        defaultCategory={defaultTaskCategory}
      />

      <TopicModal
        isOpen={isTopicModalOpen}
        onClose={() => setIsTopicModalOpen(false)}
        subjects={state.subjects}
        initialTopic={editingTopic}
        defaultSubjectId={defaultTopicSubjectId}
        onSaveTopic={handleSaveTopic}
        onSaveSubject={handleSaveSubject}
      />

      <ExamModal
        isOpen={isExamModalOpen}
        onClose={() => setIsExamModalOpen(false)}
        subjects={state.subjects}
        initialExam={editingExam}
        onSave={handleSaveExam}
      />

      <NoteModal
        isOpen={isNoteModalOpen}
        onClose={() => setIsNoteModalOpen(false)}
        subjects={state.subjects}
        initialNote={editingNote}
        onSave={handleSaveNote}
      />

      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        profile={state.profile}
        onUpdateProfile={handleUpdateProfile}
        fullState={state}
        onStateReload={(newState) => setState(newState)}
        onRerunOnboarding={handleRerunOnboarding}
      />

      {/* Gamification Level-Up Celebration Modal */}
      <LevelUpModal
        isOpen={levelUpModalData.isOpen}
        onClose={() => setLevelUpModalData((prev) => ({ ...prev, isOpen: false }))}
        levelInfo={levelUpModalData.levelInfo}
        previousLevel={levelUpModalData.previousLevel}
      />

      {/* Animated XP Toast Notifications */}
      <XpToastContainer notifications={xpToasts} />
    </div>
  );
}

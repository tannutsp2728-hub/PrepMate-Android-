import { AppState, Topic, Task, FocusSession, UpcomingExam, QuickNote, Subject, GamificationState } from '../types';
import { generateInitialSampleData, getTodayDateString, getDateOffset } from '../data/sampleData';

const STORAGE_KEY = 'prepmate_student_app_state_v2';

export function loadAppState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initial = generateInitialSampleData('Priya Sharma', true);
      initial.profile.hasCompletedOnboarding = false;
      return initial;
    }
    const parsed = JSON.parse(raw);
    if (!parsed.subjects || !parsed.tasks || !parsed.topics || !parsed.profile) {
      const initial = generateInitialSampleData('Priya Sharma', true);
      initial.profile.hasCompletedOnboarding = false;
      return initial;
    }

    // Ensure gamification state exists
    if (!parsed.gamification) {
      parsed.gamification = {
        totalXp: 420,
        todayXp: 70,
        currentStreak: 6,
        lastActiveDate: getTodayDateString(),
        activeDates: [
          getDateOffset(-5),
          getDateOffset(-4),
          getDateOffset(-3),
          getDateOffset(-2),
          getDateOffset(-1),
          getTodayDateString()
        ],
        level: 2
      };
    }

    return parsed;
  } catch (err) {
    console.error('Failed to load state from localStorage:', err);
    const initial = generateInitialSampleData('Priya Sharma', true);
    initial.profile.hasCompletedOnboarding = false;
    return initial;
  }
}

export function saveAppState(state: AppState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.error('Failed to save state to localStorage:', err);
  }
}

export function resetToSampleData(): AppState {
  const initial = generateInitialSampleData('Priya Sharma', true);
  initial.profile.hasCompletedOnboarding = true;
  saveAppState(initial);
  return initial;
}

// Spaced Repetition schedule:
// Revision 1: 1 day later
// Revision 2: 3 days later
// Revision 3: 7 days later
// Revision 4: 14 days later
// Revision 5: 30 days later
export function calculateNextRevision(completedRevisionStage: number): { nextRevisionDate: string; nextIntervalDays: number; nextStage: number } {
  let days = 1;
  const nextStage = completedRevisionStage + 1;

  if (completedRevisionStage === 0) {
    days = 1; // Revision 1: 1 day later
  } else if (completedRevisionStage === 1) {
    days = 3; // Revision 2: 3 days later
  } else if (completedRevisionStage === 2) {
    days = 7; // Revision 3: 7 days later
  } else if (completedRevisionStage === 3) {
    days = 14; // Revision 4: 14 days later
  } else if (completedRevisionStage >= 4) {
    days = 30; // Revision 5: 30 days later
  }

  const nextRevisionDate = getDateOffset(days);
  return { nextRevisionDate, nextIntervalDays: days, nextStage };
}

// Export and Import JSON helpers
export function exportDataAsJSON(state: AppState) {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(state, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', `prepmate-backup-${getTodayDateString()}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

export function importDataFromJSON(file: File): Promise<AppState> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const parsed = JSON.parse(content) as AppState;
        if (parsed.profile && parsed.subjects && parsed.tasks) {
          saveAppState(parsed);
          resolve(parsed);
        } else {
          reject(new Error('Invalid backup file schema'));
        }
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}

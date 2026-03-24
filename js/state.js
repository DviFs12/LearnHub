// ═══════════════════════════════════════════
//  LearnHub · Global State Manager
// ═══════════════════════════════════════════
const STATE_KEY = 'learnhub_v1';

const DEFAULT_STATE = {
  points: 0,
  theme: 'light',
  themeColor: 'default',
  purchasedThemes: ['default'],
  courses: {},       // { courseId: { progress, completedLessons, points, startedAt } }
  activityLog: [],   // ['YYYY-MM-DD', ...]
  streak: 0,
  lastStudyDate: null,
};

function loadState() {
  try {
    const raw = localStorage.getItem(STATE_KEY);
    if (raw) return Object.assign({}, DEFAULT_STATE, JSON.parse(raw));
  } catch(e) {}
  return { ...DEFAULT_STATE };
}

function saveState() {
  try {
    localStorage.setItem(STATE_KEY, JSON.stringify(window.APP_STATE));
  } catch(e) { console.warn('Could not save state', e); }
}

function getCourseState(courseId) {
  if (!window.APP_STATE.courses[courseId]) {
    window.APP_STATE.courses[courseId] = {
      completedLessons: {},
      points: 0,
      startedAt: new Date().toISOString(),
    };
  }
  return window.APP_STATE.courses[courseId];
}

function recordActivity() {
  const today = new Date().toISOString().slice(0, 10);
  if (!window.APP_STATE.activityLog) window.APP_STATE.activityLog = [];
  if (!window.APP_STATE.activityLog.includes(today)) {
    window.APP_STATE.activityLog.push(today);
  }
  // Streak
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  if (window.APP_STATE.lastStudyDate === yesterday) {
    window.APP_STATE.streak = (window.APP_STATE.streak || 0) + 1;
  } else if (window.APP_STATE.lastStudyDate !== today) {
    window.APP_STATE.streak = 1;
  }
  window.APP_STATE.lastStudyDate = today;
  saveState();
}

window.APP_STATE = loadState();
window.saveState = saveState;
window.getCourseState = getCourseState;
window.recordActivity = recordActivity;

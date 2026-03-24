// ═══════════════════════════════════════════
//  LearnHub · Theme System
// ═══════════════════════════════════════════

const THEME_COLORS = {
  default: {
    name: 'Padrão',
    price: 0,
    hue: null, // uses natural palette
    light: {
      '--accent': '#c2410c',
      '--accent-soft': '#fff3ee',
      '--accent-border': '#fed7aa',
      '--accent2': '#0369a1',
      '--accent2-soft': '#f0f9ff',
    },
    dark: {
      '--accent': '#fb923c',
      '--accent-soft': '#431407',
      '--accent-border': '#7c2d12',
      '--accent2': '#38bdf8',
      '--accent2-soft': '#0c2340',
    }
  },
  violet: {
    name: 'Violeta',
    price: 150,
    emoji: '💜',
    hue: 270,
    light: {
      '--accent': '#7c3aed',
      '--accent-soft': '#f5f3ff',
      '--accent-border': '#ddd6fe',
      '--accent2': '#0284c7',
      '--accent2-soft': '#f0f9ff',
    },
    dark: {
      '--accent': '#a78bfa',
      '--accent-soft': '#2e1065',
      '--accent-border': '#4c1d95',
      '--accent2': '#38bdf8',
      '--accent2-soft': '#0c2340',
    }
  },
  emerald: {
    name: 'Esmeralda',
    price: 150,
    emoji: '💚',
    hue: 152,
    light: {
      '--accent': '#059669',
      '--accent-soft': '#ecfdf5',
      '--accent-border': '#a7f3d0',
      '--accent2': '#0369a1',
      '--accent2-soft': '#f0f9ff',
    },
    dark: {
      '--accent': '#34d399',
      '--accent-soft': '#022c22',
      '--accent-border': '#065f46',
      '--accent2': '#38bdf8',
      '--accent2-soft': '#0c2340',
    }
  },
  rose: {
    name: 'Rosa',
    price: 150,
    emoji: '🌸',
    hue: 330,
    light: {
      '--accent': '#be185d',
      '--accent-soft': '#fdf2f8',
      '--accent-border': '#fbcfe8',
      '--accent2': '#0369a1',
      '--accent2-soft': '#f0f9ff',
    },
    dark: {
      '--accent': '#f472b6',
      '--accent-soft': '#500724',
      '--accent-border': '#831843',
      '--accent2': '#38bdf8',
      '--accent2-soft': '#0c2340',
    }
  },
  amber: {
    name: 'Âmbar',
    price: 200,
    emoji: '🔥',
    hue: 38,
    light: {
      '--accent': '#b45309',
      '--accent-soft': '#fffbeb',
      '--accent-border': '#fde68a',
      '--accent2': '#0369a1',
      '--accent2-soft': '#f0f9ff',
    },
    dark: {
      '--accent': '#fbbf24',
      '--accent-soft': '#451a03',
      '--accent-border': '#78350f',
      '--accent2': '#38bdf8',
      '--accent2-soft': '#0c2340',
    }
  },
  midnight: {
    name: 'Meia-noite',
    price: 300,
    emoji: '🌙',
    hue: 220,
    light: {
      '--accent': '#1d4ed8',
      '--accent-soft': '#eff6ff',
      '--accent-border': '#bfdbfe',
      '--accent2': '#0369a1',
      '--accent2-soft': '#f0f9ff',
    },
    dark: {
      '--accent': '#60a5fa',
      '--accent-soft': '#172554',
      '--accent-border': '#1e3a8a',
      '--accent2': '#38bdf8',
      '--accent2-soft': '#0c2340',
    }
  },
  obsidian: {
    name: 'Obsidiana',
    price: 500,
    emoji: '🖤',
    hue: 0,
    light: {
      '--bg': '#18181b',
      '--paper': '#27272a',
      '--paper2': '#3f3f46',
      '--paper3': '#52525b',
      '--line': '#52525b',
      '--ink': '#fafafa',
      '--ink2': '#d4d4d8',
      '--ink3': '#a1a1aa',
      '--accent': '#e4e4e7',
      '--accent-soft': '#3f3f46',
      '--accent-border': '#52525b',
      '--accent2': '#a1a1aa',
      '--accent2-soft': '#27272a',
    },
    dark: {
      '--bg': '#09090b',
      '--paper': '#18181b',
      '--paper2': '#27272a',
      '--paper3': '#3f3f46',
      '--line': '#3f3f46',
      '--ink': '#fafafa',
      '--ink2': '#d4d4d8',
      '--ink3': '#a1a1aa',
      '--accent': '#e4e4e7',
      '--accent-soft': '#27272a',
      '--accent-border': '#3f3f46',
      '--accent2': '#a1a1aa',
      '--accent2-soft': '#18181b',
    }
  }
};

const BASE_LIGHT = {
  '--bg': '#faf8f4',
  '--paper': '#ffffff',
  '--paper2': '#f5f1eb',
  '--paper3': '#ede8df',
  '--line': '#ddd5c8',
  '--ink': '#1a1814',
  '--ink2': '#4a4540',
  '--ink3': '#8a847e',
  '--green': '#15803d',
  '--green-soft': '#f0fdf4',
  '--green-border': '#bbf7d0',
  '--red': '#dc2626',
  '--red-soft': '#fef2f2',
  '--gold': '#b45309',
  '--gold-soft': '#fffbeb',
};

const BASE_DARK = {
  '--bg': '#0f0e0c',
  '--paper': '#1a1916',
  '--paper2': '#242220',
  '--paper3': '#2e2c29',
  '--line': '#3a3835',
  '--ink': '#f0ece4',
  '--ink2': '#b8b4ac',
  '--ink3': '#6e6b65',
  '--green': '#4ade80',
  '--green-soft': '#052e16',
  '--green-border': '#14532d',
  '--red': '#f87171',
  '--red-soft': '#450a0a',
  '--gold': '#fbbf24',
  '--gold-soft': '#451a03',
};

function applyTheme(mode, colorKey) {
  const root = document.documentElement;
  const base = mode === 'dark' ? { ...BASE_DARK } : { ...BASE_LIGHT };
  const color = THEME_COLORS[colorKey] || THEME_COLORS.default;
  const colorVars = mode === 'dark' ? color.dark : color.light;

  // Merge: base + color overrides
  const vars = { ...base, ...colorVars };

  Object.entries(vars).forEach(([k, v]) => {
    root.style.setProperty(k, v);
  });

  root.setAttribute('data-theme', mode);
  root.setAttribute('data-color', colorKey);
}

function initTheme() {
  const state = window.APP_STATE;
  applyTheme(state.theme || 'light', state.themeColor || 'default');
}

function setTheme(mode, colorKey) {
  window.APP_STATE.theme = mode;
  window.APP_STATE.themeColor = colorKey;
  saveState();
  applyTheme(mode, colorKey);
  // Notify other tabs/pages
  try { localStorage.setItem('lh_theme_signal', JSON.stringify({ mode, colorKey, ts: Date.now() })); } catch(e) {}
}

function toggleDark() {
  const mode = window.APP_STATE.theme === 'dark' ? 'light' : 'dark';
  setTheme(mode, window.APP_STATE.themeColor || 'default');
}

window.THEME_COLORS = THEME_COLORS;
window.applyTheme = applyTheme;
window.initTheme = initTheme;
window.setTheme = setTheme;
window.toggleDark = toggleDark;

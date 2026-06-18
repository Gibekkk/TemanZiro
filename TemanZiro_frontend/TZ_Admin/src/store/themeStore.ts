import { create } from 'zustand';

interface ThemeState {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;
}

function applyTheme(theme: 'light' | 'dark') {
  // Pakai data-theme attribute — tidak konflik dengan @media prefers-color-scheme
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
}

const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
const systemDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
const initialTheme: 'light' | 'dark' = savedTheme ?? (systemDark ? 'dark' : 'light');
applyTheme(initialTheme);

export const useThemeStore = create<ThemeState>((set) => ({
  theme: initialTheme,

  setTheme: (theme) => {
    applyTheme(theme);
    set({ theme });
  },

  toggleTheme: () =>
    set((state) => {
      const next = state.theme === 'light' ? 'dark' : 'light';
      applyTheme(next);
      return { theme: next };
    }),
}));
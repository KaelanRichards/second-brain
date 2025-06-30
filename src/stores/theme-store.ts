import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Theme = 'light' | 'dark' | 'system';

interface ThemeState {
  theme: Theme;
  isDark: boolean;

  // Actions
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const getSystemTheme = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
};

const applyTheme = (isDark: boolean) => {
  if (typeof document === 'undefined') return;

  if (isDark) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
};

const getEffectiveTheme = (theme: Theme): boolean => {
  if (theme === 'system') {
    return getSystemTheme();
  }
  return theme === 'dark';
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => {
      // Listen for system theme changes
      if (typeof window !== 'undefined') {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        mediaQuery.addEventListener('change', () => {
          const { theme } = get();
          if (theme === 'system') {
            const isDark = getEffectiveTheme(theme);
            applyTheme(isDark);
            set({ isDark });
          }
        });
      }

      return {
        theme: 'system',
        isDark: getSystemTheme(),

        setTheme: (theme) => {
          const isDark = getEffectiveTheme(theme);
          applyTheme(isDark);
          set({ theme, isDark });
        },

        toggleTheme: () => {
          const { theme } = get();
          const newTheme = theme === 'dark' ? 'light' : 'dark';
          const isDark = getEffectiveTheme(newTheme);
          applyTheme(isDark);
          set({ theme: newTheme, isDark });
        },
      };
    },
    {
      name: 'theme-storage',
      onRehydrateStorage: () => (state) => {
        // Apply theme on hydration
        if (state) {
          const isDark = getEffectiveTheme(state.theme);
          applyTheme(isDark);
          state.isDark = isDark;
        }
      },
    }
  )
);

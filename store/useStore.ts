'use client';

import { create } from 'zustand';
import { User, Hearts, Streak, Gems, CurriculumPath, UserPathProgress } from '@/lib/types';

interface AppState {
  user: User | null;
  hearts: Hearts | null;
  streak: Streak | null;
  gems: Gems | null;
  paths: CurriculumPath[];
  pathProgress: UserPathProgress[];
  darkMode: boolean;
  soundEnabled: boolean;

  setUser: (user: User | null) => void;
  setHearts: (hearts: Hearts | null) => void;
  setStreak: (streak: Streak | null) => void;
  setGems: (gems: Gems | null) => void;
  setPaths: (paths: CurriculumPath[]) => void;
  setPathProgress: (progress: UserPathProgress[]) => void;
  toggleDarkMode: () => void;
  toggleSound: () => void;
  loseHeart: () => void;
  addXP: (amount: number) => void;
  addGems: (amount: number) => void;
  spendGems: (amount: number) => boolean;
}

export const useStore = create<AppState>((set, get) => ({
  user: null,
  hearts: null,
  streak: null,
  gems: null,
  paths: [],
  pathProgress: [],
  darkMode: false,
  soundEnabled: true,

  setUser: (user) => set({ user }),
  setHearts: (hearts) => set({ hearts }),
  setStreak: (streak) => set({ streak }),
  setGems: (gems) => set({ gems }),
  setPaths: (paths) => set({ paths }),
  setPathProgress: (progress) => set({ pathProgress: progress }),

  toggleDarkMode: () => set((state) => {
    const newMode = !state.darkMode;
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark', newMode);
      localStorage.setItem('darkMode', String(newMode));
    }
    return { darkMode: newMode };
  }),

  toggleSound: () => set((state) => {
    const newSound = !state.soundEnabled;
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('soundEnabled', String(newSound));
    }
    return { soundEnabled: newSound };
  }),

  loseHeart: () => set((state) => {
    if (!state.hearts) return state;
    const unlimited = state.hearts.unlimited_until && new Date(state.hearts.unlimited_until) > new Date();
    if (unlimited) return state;
    return {
      hearts: {
        ...state.hearts,
        current_hearts: Math.max(0, state.hearts.current_hearts - 1),
      },
    };
  }),

  addXP: (amount) => set((state) => {
    if (!state.user) return state;
    return {
      user: {
        ...state.user,
        total_xp: state.user.total_xp + amount,
      },
    };
  }),

  addGems: (amount) => set((state) => {
    if (!state.gems) return state;
    return {
      gems: {
        ...state.gems,
        balance: state.gems.balance + amount,
      },
    };
  }),

  spendGems: (amount) => {
    const state = get();
    if (!state.gems || state.gems.balance < amount) return false;
    set({
      gems: {
        ...state.gems,
        balance: state.gems.balance - amount,
      },
    });
    return true;
  },
}));

import { create } from 'zustand';
import { User } from '../types';

interface UserState {
  user: User | null;
  setUser: (user: User | null) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: {
    id: 'user001',
    name: '李海峰',
    role: 'prefecture_auditor',
    coreUnitId: 'unit_1001',
    relatedUnitIds: ['unit_1002'],
    permissions: ['search', 'upload', 'audit_prefecture']
  },
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null })
}));

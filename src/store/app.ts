import { create } from 'zustand';

import { type User } from '../types/index.js';

export interface AppState {
    user: User | null;
}

const useApp = create<AppState>()((set) => ({
    user: null
}));
  
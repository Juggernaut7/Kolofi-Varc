import { create } from 'zustand';

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  isVerified: boolean;
  balance: number;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signupStep: number;
  signupData: {
    name?: string;
    email?: string;
    phone?: string;
    password?: string;
  };
  setSignupStep: (step: number) => void;
  updateSignupData: (data: Partial<AuthState['signupData']>) => void;
  login: (email: string, name: string) => void;
  logout: () => void;
  verifyAccount: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  signupStep: 1,
  signupData: {},
  setSignupStep: (step) => set({ signupStep: step }),
  updateSignupData: (data) => 
    set((state) => ({ signupData: { ...state.signupData, ...data } })),
  login: (email, name) => 
    set({ 
      isAuthenticated: true, 
      user: { 
        id: '1', 
        email, 
        name, 
        isVerified: false, 
        balance: 0 
      } 
    }),
  logout: () => set({ user: null, isAuthenticated: false }),
  verifyAccount: () => 
    set((state) => ({ 
      user: state.user ? { ...state.user, isVerified: true } : null 
    })),
}));

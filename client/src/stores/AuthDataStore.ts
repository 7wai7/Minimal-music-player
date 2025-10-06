import { create } from "zustand"
import type AuthData from "../types/authData";

type AuthForm = {
    authForm: Partial<AuthData>;
    setAuthForm: <K extends keyof AuthData>(field: K, value: AuthData[K]) => void;

    clearForm: () => void;
}

export const useAuthDataStore = create<AuthForm>((set, get) => ({
    authForm: {},
    setAuthForm: (field, value) => set({ authForm: { ...get().authForm, [field]: value } }),

    clearForm: () => set({ authForm: {} }),
}));
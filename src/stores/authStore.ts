import { create } from 'zustand';

interface AuthStore {
    uid: string | null;
    email: string | null;
    role: string;
    companyId: string | null;
    companyName: string | null;
    isLoading: boolean;

    setUser: (user: { uid: string; email: string; role: string }) => void;
    setCompany: (company: { id: string; name: string }) => void;
    clearAuth: () => void;
    setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthStore>()((set) => ({
    uid: null,
    email: null,
    role: 'user',
    companyId: null,
    companyName: null,
    isLoading: true,

    setUser: (user) =>
        set({
            uid: user.uid,
            email: user.email,
            role: user.role,
            isLoading: false,
        }),

    setCompany: (company) =>
        set({
            companyId: company.id,
            companyName: company.name,
        }),

    clearAuth: () =>
        set({
            uid: null,
            email: null,
            role: 'user',
            companyId: null,
            companyName: null,
            isLoading: false,
        }),

    setLoading: (loading) => set({ isLoading: loading }),
}));

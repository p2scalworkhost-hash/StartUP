import { create } from 'zustand';

interface UIStore {
    // Loading states
    isGlobalLoading: boolean;
    loadingMessage: string | null;
    setGlobalLoading: (loading: boolean, message?: string) => void;

    // Modal
    activeModal: string | null;
    modalData: unknown;
    openModal: (modalId: string, data?: unknown) => void;
    closeModal: () => void;

    // Sidebar
    isSidebarOpen: boolean;
    toggleSidebar: () => void;
    setSidebarOpen: (open: boolean) => void;

    // Toast notifications
    toasts: Array<{ id: string; message: string; type: 'success' | 'error' | 'info' }>;
    addToast: (message: string, type?: 'success' | 'error' | 'info') => void;
    removeToast: (id: string) => void;
}

export const useUIStore = create<UIStore>()((set) => ({
    isGlobalLoading: false,
    loadingMessage: null,
    activeModal: null,
    modalData: null,
    isSidebarOpen: true,
    toasts: [],

    setGlobalLoading: (loading, message) =>
        set({ isGlobalLoading: loading, loadingMessage: message || null }),

    openModal: (modalId, data) =>
        set({ activeModal: modalId, modalData: data }),

    closeModal: () =>
        set({ activeModal: null, modalData: null }),

    toggleSidebar: () =>
        set(s => ({ isSidebarOpen: !s.isSidebarOpen })),

    setSidebarOpen: (open) =>
        set({ isSidebarOpen: open }),

    addToast: (message, type = 'info') => {
        const id = Date.now().toString();
        set(s => ({
            toasts: [...s.toasts, { id, message, type }],
        }));
        // Auto-remove after 5s
        setTimeout(() => {
            set(s => ({
                toasts: s.toasts.filter(t => t.id !== id),
            }));
        }, 5000);
    },

    removeToast: (id) =>
        set(s => ({
            toasts: s.toasts.filter(t => t.id !== id),
        })),
}));

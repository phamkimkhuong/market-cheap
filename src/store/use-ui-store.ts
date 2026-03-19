import { create } from 'zustand';

/**
 * Zustand Store for UI/Client State.
 * Follows project standards: use Zustand for things like modals, sidebars, and toasts.
 */

interface Toast {
    id: string;
    message: string;
    type: 'success' | 'error' | 'info';
}

interface UIState {
    // Sidebar/Drawer
    isSidebarOpen: boolean;
    toggleSidebar: () => void;
    setSidebarOpen: (isOpen: boolean) => void;

    // Toasts (Simple notification system)
    toasts: Toast[];
    addToast: (message: string, type?: 'success' | 'error' | 'info') => void;
    removeToast: (id: string) => void;

    // Cart/Search overlay
    isSearchOpen: boolean;
    toggleSearch: () => void;
}

export const useUIStore = create<UIState>((set) => ({
    // Sidebar
    isSidebarOpen: false,
    toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
    setSidebarOpen: (isOpen) => set({ isSidebarOpen: isOpen }),

    // Toasts
    toasts: [],
    addToast: (message, type = 'info') => {
        const id = Math.random().toString(36).substring(2, 9);
        set((state) => ({
            toasts: [...state.toasts, { id, message, type }],
        }));

        // Auto remove after 5s
        setTimeout(() => {
            set((state) => ({
                toasts: state.toasts.filter((t) => t.id !== id),
            }));
        }, 5000);
    },
    removeToast: (id) => set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id),
    })),

    // Search
    isSearchOpen: false,
    toggleSearch: () => set((state) => ({ isSearchOpen: !state.isSearchOpen })),
}));

'use client';

import { useUIStore } from '@/store/use-ui-store';
import { X } from 'lucide-react';
import { useEffect, useState } from 'react';

/**
 * ToastContainer component to display notifications.
 * Uses Zustand for state management.
 */
export const ToastContainer = () => {
    const { toasts, removeToast } = useUIStore();
    const [isMounted, setIsMounted] = useState(false);

    // Ensure component is only rendered on client
    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) return null;

    return (
        <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
            {toasts.map((toast) => (
                <div
                    key={toast.id}
                    className={`
                        pointer-events-auto
                        flex items-center justify-between gap-4
                        px-4 py-3 rounded-lg shadow-lg border
                        transition-all duration-300 animate-in fade-in slide-in-from-right-4
                        ${toast.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' : ''}
                        ${toast.type === 'error' ? 'bg-red-50 border-red-200 text-red-800' : ''}
                        ${toast.type === 'info' ? 'bg-blue-50 border-blue-200 text-blue-800' : ''}
                    `}
                >
                    <span className="text-sm font-medium">{toast.message}</span>
                    <button
                        onClick={() => removeToast(toast.id)}
                        className="p-1 hover:bg-black/5 rounded-full transition-colors"
                    >
                        <X size={14} />
                    </button>
                </div>
            ))}
        </div>
    );
};

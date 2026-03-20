import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { type Product } from '@/types/models';

/**
 * Zustand Store for Shopping Cart.
 * Uses 'persist' middleware to keep cart items in localStorage.
 */

interface CartItem extends Product {
    quantity: number;
}

interface CartState {
    items: CartItem[];
    addItem: (product: Product, quantity?: number) => void;
    decrementItem: (productId: string, quantity?: number) => void;
    removeItem: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    clearCart: () => void;
    
    // Computed (derived) states
    getTotalItems: () => number;
    getTotalPrice: () => number;
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],

            addItem: (product, quantity = 1) => {
                const currentItems = get().items;
                const existingItem = currentItems.find((item) => item.$id === product.$id);

                if (existingItem) {
                    set({
                        items: currentItems.map((item) =>
                            item.$id === product.$id
                                ? { ...item, quantity: item.quantity + quantity }
                                : item
                        ),
                    });
                } else {
                    set({
                        items: [...currentItems, { ...product, quantity }],
                    });
                }
            },

            decrementItem: (productId, quantity = 1) => {
                const currentItems = get().items;
                const existingItem = currentItems.find((item) => item.$id === productId);
                if (!existingItem) {
                    return;
                }

                const nextQuantity = existingItem.quantity - quantity;
                if (nextQuantity <= 0) {
                    set({
                        items: currentItems.filter((item) => item.$id !== productId),
                    });
                    return;
                }

                set({
                    items: currentItems.map((item) =>
                        item.$id === productId ? { ...item, quantity: nextQuantity } : item
                    ),
                });
            },

            removeItem: (productId) => {
                set({
                    items: get().items.filter((item) => item.$id !== productId),
                });
            },

            updateQuantity: (productId, quantity) => {
                if (quantity <= 0) {
                    get().removeItem(productId);
                    return;
                }
                set({
                    items: get().items.map((item) =>
                        item.$id === productId ? { ...item, quantity } : item
                    ),
                });
            },

            clearCart: () => set({ items: [] }),

            getTotalItems: () => {
                return get().items.reduce((total, item) => total + item.quantity, 0);
            },

            getTotalPrice: () => {
                return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
            },
        }),
        {
            name: 'marketplace-cart', // Unique name for localStorage key
        }
    )
);

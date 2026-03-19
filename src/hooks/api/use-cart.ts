'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { databases } from '@/services/api/client';
import { CartItemSchema, type DBCartItem } from '@/types/models';
import { createLogger } from '@/utils/logger';
import { ID, Query, Permission, Role } from 'appwrite';

const logger = createLogger('useCartAPI');
const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'marketplace';
const COLLECTION_ID = 'cart_items';

/**
 * Hook to fetch user's cart from Appwrite.
 */
export const useGetDBCart = (userId: string) => {
    return useQuery({
        queryKey: ['db-cart', userId],
        queryFn: async () => {
            try {
                if (!userId) return { documents: [] };
                logger.info('Fetching DB cart for user:', userId);
                const response = await databases.listDocuments(
                    DATABASE_ID,
                    COLLECTION_ID,
                    [Query.equal('user_id', userId)]
                );

                const validatedItems = response.documents.map((doc) => {
                    const result = CartItemSchema.safeParse(doc);
                    if (!result.success) {
                        logger.error('Zod Validation Failure for cart item:', doc.$id, result.error.format());
                        return doc as any as DBCartItem;
                    }
                    return result.data;
                });

                return { ...response, documents: validatedItems };
            } catch (error: any) {
                logger.error('Failed to fetch DB cart:', error.message);
                throw error;
            }
        },
        enabled: !!userId,
    });
};

/**
 * Hook to add/update item in DB cart.
 */
export const useSyncCartItem = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ userId, productId, quantity, shop_id, existingItemId }: { 
            userId: string; 
            productId: string; 
            quantity: number; 
            shop_id: string;
            existingItemId?: string; 
        }) => {
            if (existingItemId) {
                // Update
                return await databases.updateDocument(DATABASE_ID, COLLECTION_ID, existingItemId, {
                    quantity,
                });
            } else {
                // Create
                return await databases.createDocument(
                    DATABASE_ID, 
                    COLLECTION_ID, 
                    ID.unique(), 
                    {
                        user_id: userId,
                        product_id: productId,
                        quantity,
                        shop_id,
                    },
                    [
                        Permission.read(Role.user(userId)),
                        Permission.write(Role.user(userId)),
                    ]
                );
            }
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['db-cart', variables.userId] });
        },
    });
};

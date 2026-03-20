'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cartRepository } from '@/services/repositories/cart-repository';
import { createLogger } from '@/utils/logger';
import { ApiRouteError } from '@/types/errors';
import { getErrorMessage } from '@/utils/error';

const logger = createLogger('useCartAPI');

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
                return await cartRepository.listByUserId(userId);
            } catch (error: unknown) {
                logger.error('Failed to fetch DB cart:', getErrorMessage(error));
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
        mutationFn: async ({
            productId,
            quantity,
            shop_id,
            idempotencyKey,
        }: {
            productId: string;
            quantity: number;
            shop_id: string;
            idempotencyKey: string;
        }) => {
            const response = await fetch('/api/cart/sync', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-idempotency-key': idempotencyKey,
                },
                body: JSON.stringify({
                    productId,
                    quantity,
                    shopId: shop_id,
                }),
            });

            if (!response.ok) {
                throw new ApiRouteError('Failed to sync cart item', response.status, await response.text());
            }
            return await response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['db-cart'] });
        },
    });
};

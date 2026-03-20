'use client';

import { useQuery } from '@tanstack/react-query';
import { createLogger } from '@/utils/logger';
import { shopsRepository } from '@/services/repositories/shops-repository';
import { getErrorMessage } from '@/utils/error';

const logger = createLogger('useShops');

/**
 * Hook to fetch shops from Appwrite.
 */
export const useGetShops = (queries: string[] = []) => {
    return useQuery({
        queryKey: ['shops', queries],
        queryFn: async () => {
            try {
                logger.info('Fetching shops with queries:', queries);
                return await shopsRepository.list(queries);
            } catch (error: unknown) {
                logger.error('Failed to fetch shops:', getErrorMessage(error));
                throw error;
            }
        },
    });
};

/**
 * Hook to fetch a single shop by ID.
 */
export const useGetShop = (shopId: string) => {
    return useQuery({
        queryKey: ['shop', shopId],
        queryFn: async () => {
            try {
                if (!shopId) throw new Error('Shop ID is required');
                logger.info('Fetching shop:', shopId);
                return await shopsRepository.getById(shopId);
            } catch (error: unknown) {
                logger.error('Failed to fetch shop:', shopId, getErrorMessage(error));
                throw error;
            }
        },
        enabled: !!shopId,
    });
};

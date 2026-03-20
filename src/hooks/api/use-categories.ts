'use client';

import { useQuery } from '@tanstack/react-query';
import { createLogger } from '@/utils/logger';
import { categoriesRepository } from '@/services/repositories/categories-repository';
import { getErrorMessage } from '@/utils/error';

const logger = createLogger('useCategories');

/**
 * Hook to fetch categories from Appwrite.
 */
export const useGetCategories = (queries: string[] = []) => {
    return useQuery({
        queryKey: ['categories', queries],
        queryFn: async () => {
            try {
                logger.info('Fetching categories with queries:', queries);
                return await categoriesRepository.list(queries);
            } catch (error: unknown) {
                logger.error('Failed to fetch categories:', getErrorMessage(error));
                throw error;
            }
        },
    });
};

/**
 * Hook to fetch a single category by ID.
 */
export const useGetCategory = (categoryId: string) => {
    return useQuery({
        queryKey: ['category', categoryId],
        queryFn: async () => {
            try {
                if (!categoryId) throw new Error('Category ID is required');
                logger.info('Fetching category:', categoryId);
                return await categoriesRepository.getById(categoryId);
            } catch (error: unknown) {
                logger.error('Failed to fetch category:', categoryId, getErrorMessage(error));
                throw error;
            }
        },
        enabled: !!categoryId,
    });
};

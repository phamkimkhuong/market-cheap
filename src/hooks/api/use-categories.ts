'use client';

import { useQuery } from '@tanstack/react-query';
import { databases } from '@/services/api/client';
import { CategorySchema, type Category } from '@/types/models';
import { createLogger } from '@/utils/logger';

const logger = createLogger('useCategories');
const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'marketplace';
const COLLECTION_ID = 'categories';

/**
 * Hook to fetch categories from Appwrite.
 */
export const useGetCategories = (queries: string[] = []) => {
    return useQuery({
        queryKey: ['categories', queries],
        queryFn: async () => {
            try {
                logger.info('Fetching categories with queries:', queries);
                const response = await databases.listDocuments(
                    DATABASE_ID,
                    COLLECTION_ID,
                    queries
                );

                const validatedCategories = response.documents.map((doc) => {
                    const result = CategorySchema.safeParse(doc);
                    if (!result.success) {
                        logger.error('Zod Validation Failure for category ID:', doc.$id, result.error.format());
                        return doc as any as Category;
                    }
                    return result.data;
                });

                return { ...response, documents: validatedCategories };
            } catch (error: any) {
                logger.error('Failed to fetch categories:', error.message);
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
                const response = await databases.getDocument(DATABASE_ID, COLLECTION_ID, categoryId);
                const result = CategorySchema.safeParse(response);
                if (!result.success) {
                    logger.error('Zod Validation Failure for category:', categoryId, result.error.format());
                    return response as any as Category;
                }
                return result.data;
            } catch (error: any) {
                logger.error('Failed to fetch category:', categoryId, error.message);
                throw error;
            }
        },
        enabled: !!categoryId,
    });
};

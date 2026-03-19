'use client';

import { useQuery } from '@tanstack/react-query';
import { databases } from '@/services/api/client';
import { ShopSchema, type Shop } from '@/types/models';
import { createLogger } from '@/utils/logger';

const logger = createLogger('useShops');
const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'marketplace';
const COLLECTION_ID = 'shops';

/**
 * Hook to fetch shops from Appwrite.
 */
export const useGetShops = (queries: string[] = []) => {
    return useQuery({
        queryKey: ['shops', queries],
        queryFn: async () => {
            try {
                logger.info('Fetching shops with queries:', queries);
                const response = await databases.listDocuments(
                    DATABASE_ID,
                    COLLECTION_ID,
                    queries
                );

                const validatedShops = response.documents.map((doc) => {
                    const result = ShopSchema.safeParse(doc);
                    if (!result.success) {
                        logger.error('Zod Validation Failure for shop ID:', doc.$id, result.error.format());
                        return doc as any as Shop;
                    }
                    return result.data;
                });

                return { ...response, documents: validatedShops };
            } catch (error: any) {
                logger.error('Failed to fetch shops:', error.message);
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
                const response = await databases.getDocument(DATABASE_ID, COLLECTION_ID, shopId);
                const result = ShopSchema.safeParse(response);
                if (!result.success) {
                    logger.error('Zod Validation Failure for shop:', shopId, result.error.format());
                    return response as any as Shop;
                }
                return result.data;
            } catch (error: any) {
                logger.error('Failed to fetch shop:', shopId, error.message);
                throw error;
            }
        },
        enabled: !!shopId,
    });
};

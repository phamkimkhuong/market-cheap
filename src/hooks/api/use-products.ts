'use client';

import { useQuery } from '@tanstack/react-query';
import { databases } from '@/services/api/client';
import { ProductSchema, type Product } from '@/types/models';
import { Query } from 'appwrite';
import { createLogger } from '@/utils/logger';


const logger = createLogger('useProducts');
const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'marketplace';
const COLLECTION_ID = 'products';

/**
 * Hook to fetch products from Appwrite.
 * Validates response using Zod.
 */
export const useGetProducts = (queries: string[] = []) => {
    return useQuery({
        queryKey: ['products', queries],
        queryFn: async () => {
            try {
                logger.info('Fetching products with queries:', queries);
                
                const response = await databases.listDocuments(
                    DATABASE_ID,
                    COLLECTION_ID,
                    queries
                );

                // Validate each document against the Zod schema
                const validatedProducts = response.documents.map((doc) => {
                    const result = ProductSchema.safeParse(doc);
                    if (!result.success) {
                        logger.error('Zod Validation Failure for product ID:', doc.$id, result.error.format());
                        // Return partially validated or throw? In dev we log, in prod we might filter.
                        return doc as any as Product;
                    }
                    return result.data;
                });

                return {
                    ...response,
                    documents: validatedProducts,
                };
            } catch (error: any) {
                logger.error('Failed to fetch products:', error.message);
                throw error;
            }
        },
    });
};

/**
 * Hook to fetch a single product by ID.
 */
export const useGetProduct = (productId: string) => {
    return useQuery({
        queryKey: ['product', productId],
        queryFn: async () => {
            try {
                if (!productId) throw new Error('Product ID is required');
                
                logger.info('Fetching product:', productId);
                const response = await databases.getDocument(
                    DATABASE_ID,
                    COLLECTION_ID,
                    productId
                );

                const result = ProductSchema.safeParse(response);
                if (!result.success) {
                    logger.error('Zod Validation Failure for product:', productId, result.error.format());
                    return response as any as Product;
                }
                return result.data;
            } catch (error: any) {
                logger.error('Failed to fetch product:', productId, error.message);
                throw error;
            }
        },
        enabled: !!productId,
    });
};

'use client';

import { useQuery } from '@tanstack/react-query';
import { createLogger } from '@/utils/logger';
import { productsRepository } from '@/services/repositories/products-repository';
import { getErrorMessage } from '@/utils/error';


const logger = createLogger('useProducts');

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
                return await productsRepository.list(queries);
            } catch (error: unknown) {
                logger.error('Failed to fetch products:', getErrorMessage(error));
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
                return await productsRepository.getById(productId);
            } catch (error: unknown) {
                logger.error('Failed to fetch product:', productId, getErrorMessage(error));
                throw error;
            }
        },
        enabled: !!productId,
    });
};

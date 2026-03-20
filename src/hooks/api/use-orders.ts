'use client';

import { useQuery } from '@tanstack/react-query';
import { createLogger } from '@/utils/logger';
import { ordersRepository } from '@/services/repositories/orders-repository';
import { getErrorMessage } from '@/utils/error';

const logger = createLogger('useOrders');

/**
 * Hook to fetch orders from Appwrite.
 */
export const useGetOrders = (queries: string[] = []) => {
    return useQuery({
        queryKey: ['orders', queries],
        queryFn: async () => {
            try {
                logger.info('Fetching orders with queries:', queries);
                return await ordersRepository.list(queries);
            } catch (error: unknown) {
                logger.error('Failed to fetch orders:', getErrorMessage(error));
                throw error;
            }
        },
    });
};

/**
 * Hook to fetch order items by order ID.
 */
export const useGetOrderItems = (orderId: string) => {
    return useQuery({
        queryKey: ['order-items', orderId],
        queryFn: async () => {
            try {
                if (!orderId) throw new Error('Order ID is required');
                logger.info('Fetching items for order:', orderId);
                return await ordersRepository.listItemsByOrderId(orderId);
            } catch (error: unknown) {
                logger.error('Failed to fetch order items:', orderId, getErrorMessage(error));
                throw error;
            }
        },
        enabled: !!orderId,
    });
};

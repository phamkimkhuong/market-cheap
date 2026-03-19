'use client';

import { useQuery } from '@tanstack/react-query';
import { databases } from '@/services/api/client';
import { OrderSchema, OrderItemSchema, type Order, type OrderItem } from '@/types/models';
import { createLogger } from '@/utils/logger';

const logger = createLogger('useOrders');
const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'marketplace';
const ORDERS_COLLECTION = 'orders';
const ORDER_ITEMS_COLLECTION = 'order_items';

/**
 * Hook to fetch orders from Appwrite.
 */
export const useGetOrders = (queries: string[] = []) => {
    return useQuery({
        queryKey: ['orders', queries],
        queryFn: async () => {
            try {
                logger.info('Fetching orders with queries:', queries);
                const response = await databases.listDocuments(
                    DATABASE_ID,
                    ORDERS_COLLECTION,
                    queries
                );

                const validatedOrders = response.documents.map((doc) => {
                    const result = OrderSchema.safeParse(doc);
                    if (!result.success) {
                        logger.error('Zod Validation Failure for order ID:', doc.$id, result.error.format());
                        return doc as any as Order;
                    }
                    return result.data;
                });

                return { ...response, documents: validatedOrders };
            } catch (error: any) {
                logger.error('Failed to fetch orders:', error.message);
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
                const response = await databases.listDocuments(
                    DATABASE_ID,
                    ORDER_ITEMS_COLLECTION,
                    [`equal("order_id", "${orderId}")`]
                );

                const validatedItems = response.documents.map((doc) => {
                    const result = OrderItemSchema.safeParse(doc);
                    if (!result.success) {
                        logger.error('Zod Validation Failure for order item ID:', doc.$id, result.error.format());
                        return doc as any as OrderItem;
                    }
                    return result.data;
                });

                return { ...response, documents: validatedItems };
            } catch (error: any) {
                logger.error('Failed to fetch order items:', orderId, error.message);
                throw error;
            }
        },
        enabled: !!orderId,
    });
};

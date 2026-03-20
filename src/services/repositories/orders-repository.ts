import { databases } from '@/services/api/client';
import { OrderItemSchema, OrderSchema } from '@/types/models';
import { getDatabaseId } from '@/services/repositories/config';
import { parseListOrFilter } from '@/services/repositories/validation';
import { Query } from 'appwrite';

const ORDERS_COLLECTION = 'orders';
const ORDER_ITEMS_COLLECTION = 'order_items';

export const ordersRepository = {
    async list(queries: string[] = []) {
        const response = await databases.listDocuments(getDatabaseId(), ORDERS_COLLECTION, queries);
        const documents = parseListOrFilter(OrderSchema, response.documents, 'orders.list');
        return { ...response, documents };
    },

    async listItemsByOrderId(orderId: string) {
        const response = await databases.listDocuments(
            getDatabaseId(),
            ORDER_ITEMS_COLLECTION,
            [Query.equal('order_id', orderId)]
        );
        const documents = parseListOrFilter(OrderItemSchema, response.documents, 'orders.items');
        return { ...response, documents };
    },
};

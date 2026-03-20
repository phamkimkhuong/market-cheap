import { ID, Permission, Role } from 'appwrite';
import { databases } from '@/services/api/client';
import { getDatabaseId } from '@/services/repositories/config';
import { OrderItemSchema, OrderSchema, ProductSchema } from '@/types/models';
import { parseOrThrow } from '@/services/repositories/validation';
import { NotFoundError } from '@/types/errors';

export interface CheckoutItemInput {
    product_id: string;
    shop_id: string;
    quantity: number;
    price: number;
}

export interface CreateOrderInput {
    userId: string;
    address: string;
    idempotencyKey: string;
    items: CheckoutItemInput[];
}

const ORDERS_COLLECTION = 'orders';
const ORDER_ITEMS_COLLECTION = 'order_items';

export const checkoutRepository = {
    async createOrder(input: CreateOrderInput) {
        const totalAmount = input.items.reduce((acc, item) => acc + item.quantity * item.price, 0);

        const order = await databases.createDocument(
            getDatabaseId(),
            ORDERS_COLLECTION,
            input.idempotencyKey || ID.unique(),
            {
                user_id: input.userId,
                total_amount: totalAmount,
                payment_status: 'pending',
                address: input.address,
            },
            [Permission.read(Role.user(input.userId)), Permission.write(Role.user(input.userId))]
        );

        const validatedOrder = parseOrThrow(OrderSchema, order, 'checkout.createOrder.order');

        const orderItems = [];
        for (const item of input.items) {
            const createdItem = await databases.createDocument(
                getDatabaseId(),
                ORDER_ITEMS_COLLECTION,
                ID.unique(),
                {
                    order_id: validatedOrder.$id,
                    product_id: item.product_id,
                    shop_id: item.shop_id,
                    quantity: item.quantity,
                    price: item.price,
                    status: 'shipping',
                },
                [Permission.read(Role.user(input.userId)), Permission.write(Role.user(input.userId))]
            );
            orderItems.push(parseOrThrow(OrderItemSchema, createdItem, 'checkout.createOrder.item'));
        }

        return {
            order: validatedOrder,
            items: orderItems,
        };
    },

    async updatePaymentStatus(orderId: string, paymentStatus: 'pending' | 'paid' | 'failed') {
        const updated = await databases.updateDocument(getDatabaseId(), ORDERS_COLLECTION, orderId, {
            payment_status: paymentStatus,
        });
        return parseOrThrow(OrderSchema, updated, 'checkout.updatePaymentStatus');
    },

    async decreaseInventory(productId: string, delta: number) {
        const product = await databases.getDocument(getDatabaseId(), 'products', productId);
        const validatedProduct = parseOrThrow(ProductSchema, product, 'checkout.decreaseInventory.product');

        if (validatedProduct.stock < delta) {
            throw new NotFoundError('Insufficient stock for inventory update', {
                productId,
                requested: delta,
                available: validatedProduct.stock,
            });
        }

        const updated = await databases.updateDocument(getDatabaseId(), 'products', productId, {
            stock: validatedProduct.stock - delta,
        });

        return parseOrThrow(ProductSchema, updated, 'checkout.decreaseInventory.updated');
    },
};

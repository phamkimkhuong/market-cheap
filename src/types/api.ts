import { z } from 'zod';

export const SyncCartRequestSchema = z.object({
    productId: z.string().min(1),
    quantity: z.number().int().min(1),
    shopId: z.string().min(1),
});

export type SyncCartRequest = z.infer<typeof SyncCartRequestSchema>;

export const CreateOrderRequestSchema = z.object({
    address: z.string().min(1),
    items: z.array(
        z.object({
            product_id: z.string().min(1),
            shop_id: z.string().min(1),
            quantity: z.number().int().min(1),
            price: z.number().nonnegative(),
        })
    ).min(1),
});

export type CreateOrderRequest = z.infer<typeof CreateOrderRequestSchema>;

export const UpdatePaymentRequestSchema = z.object({
    orderId: z.string().min(1),
    paymentStatus: z.enum(['pending', 'paid', 'failed']),
});

export type UpdatePaymentRequest = z.infer<typeof UpdatePaymentRequestSchema>;

export const UpdateInventoryRequestSchema = z.object({
    productId: z.string().min(1),
    delta: z.number().int().positive(),
});

export type UpdateInventoryRequest = z.infer<typeof UpdateInventoryRequestSchema>;

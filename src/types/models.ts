import { z } from 'zod';

/**
 * Zod Schemas & TypeScript Interfaces for Marketplace Models.
 * Follows the project standards: 1-1 mapping with Backend.
 */

export const ProductSchema = z.object({
    $id: z.string(),
    shop_id: z.string(),
    category_id: z.string(),
    name: z.string(),
    description: z.string().nullable().optional(),
    price: z.number(),
    stock: z.number(),
    images: z.array(z.string()).optional(),
    attributes: z.string().nullable().optional(),
    $createdAt: z.string(),
    $updatedAt: z.string(),
});

export const ShopSchema = z.object({
    $id: z.string(),
    owner_id: z.string(),
    name: z.string(),
    logo_id: z.string().nullable().optional(),
    description: z.string().nullable().optional(),
    status: z.boolean(),
    $createdAt: z.string(),
    $updatedAt: z.string(),
});

export const CategorySchema = z.object({
    $id: z.string(),
    name: z.string(),
    parent_id: z.string().nullable().optional(),
    icon_id: z.string().nullable().optional(),
    $createdAt: z.string(),
    $updatedAt: z.string(),
});

export const OrderSchema = z.object({
    $id: z.string(),
    user_id: z.string(),
    total_amount: z.number(),
    payment_status: z.enum(['pending', 'paid', 'failed']),
    address: z.string(), // JSON string as per docs
    $createdAt: z.string(),
    $updatedAt: z.string(),
});

export const OrderItemSchema = z.object({
    $id: z.string(),
    order_id: z.string(),
    product_id: z.string(),
    shop_id: z.string(),
    quantity: z.number(),
    price: z.number(),
    status: z.enum(['shipping', 'delivered', 'cancelled']),
    $createdAt: z.string(),
    $updatedAt: z.string(),
});

export const CartItemSchema = z.object({
    $id: z.string(),
    user_id: z.string(),
    product_id: z.string(),
    quantity: z.number(),
    shop_id: z.string(),
    $createdAt: z.string(),
    $updatedAt: z.string(),
});

export type Product = z.infer<typeof ProductSchema>;
export type Shop = z.infer<typeof ShopSchema>;
export type Category = z.infer<typeof CategorySchema>;
export type Order = z.infer<typeof OrderSchema>;
export type OrderItem = z.infer<typeof OrderItemSchema>;
export type DBCartItem = z.infer<typeof CartItemSchema>;

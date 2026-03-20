import { ID, Permission, Query, Role } from 'appwrite';
import { databases } from '@/services/api/client';
import { CartItemSchema, type DBCartItem } from '@/types/models';
import { getDatabaseId } from '@/services/repositories/config';
import { parseListOrFilter, parseOrThrow } from '@/services/repositories/validation';

const COLLECTION_ID = 'cart_items';

export interface SyncCartItemInput {
    userId: string;
    productId: string;
    quantity: number;
    shopId: string;
}

export const cartRepository = {
    async listByUserId(userId: string) {
        const response = await databases.listDocuments(getDatabaseId(), COLLECTION_ID, [
            Query.equal('user_id', userId),
        ]);
        const documents = parseListOrFilter(CartItemSchema, response.documents, 'cart.list');
        return { ...response, documents };
    },

    async upsertItem(input: SyncCartItemInput): Promise<DBCartItem> {
        const existing = await databases.listDocuments(getDatabaseId(), COLLECTION_ID, [
            Query.equal('user_id', input.userId),
            Query.equal('product_id', input.productId),
        ]);

        if (existing.documents.length > 0) {
            const updated = await databases.updateDocument(
                getDatabaseId(),
                COLLECTION_ID,
                existing.documents[0].$id,
                { quantity: input.quantity }
            );
            return parseOrThrow(CartItemSchema, updated, 'cart.upsert.update');
        }

        const created = await databases.createDocument(
            getDatabaseId(),
            COLLECTION_ID,
            ID.unique(),
            {
                user_id: input.userId,
                product_id: input.productId,
                quantity: input.quantity,
                shop_id: input.shopId,
            },
            [Permission.read(Role.user(input.userId)), Permission.write(Role.user(input.userId))]
        );
        return parseOrThrow(CartItemSchema, created, 'cart.upsert.create');
    },
};

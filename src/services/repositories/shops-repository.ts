import { databases } from '@/services/api/client';
import { ShopSchema, type Shop } from '@/types/models';
import { getDatabaseId } from '@/services/repositories/config';
import { parseListOrFilter, parseOrThrow } from '@/services/repositories/validation';

const COLLECTION_ID = 'shops';

export const shopsRepository = {
    async list(queries: string[] = []) {
        const response = await databases.listDocuments(getDatabaseId(), COLLECTION_ID, queries);
        const documents = parseListOrFilter(ShopSchema, response.documents, 'shops.list');
        return { ...response, documents };
    },

    async getById(shopId: string): Promise<Shop> {
        const response = await databases.getDocument(getDatabaseId(), COLLECTION_ID, shopId);
        return parseOrThrow(ShopSchema, response, `shops.getById(${shopId})`);
    },
};

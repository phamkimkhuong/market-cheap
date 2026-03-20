import { databases } from '@/services/api/client';
import { ProductSchema, type Product } from '@/types/models';
import { getDatabaseId } from '@/services/repositories/config';
import { parseListOrFilter, parseOrThrow } from '@/services/repositories/validation';

const COLLECTION_ID = 'products';

export const productsRepository = {
    async list(queries: string[] = []) {
        const response = await databases.listDocuments(getDatabaseId(), COLLECTION_ID, queries);
        const documents = parseListOrFilter(ProductSchema, response.documents, 'products.list');
        return { ...response, documents };
    },

    async getById(productId: string): Promise<Product> {
        const response = await databases.getDocument(getDatabaseId(), COLLECTION_ID, productId);
        return parseOrThrow(ProductSchema, response, `products.getById(${productId})`);
    },
};

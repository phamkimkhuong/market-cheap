import { databases } from '@/services/api/client';
import { CategorySchema, type Category } from '@/types/models';
import { getDatabaseId } from '@/services/repositories/config';
import { parseListOrFilter, parseOrThrow } from '@/services/repositories/validation';

const COLLECTION_ID = 'categories';

export const categoriesRepository = {
    async list(queries: string[] = []) {
        const response = await databases.listDocuments(getDatabaseId(), COLLECTION_ID, queries);
        const documents = parseListOrFilter(CategorySchema, response.documents, 'categories.list');
        return { ...response, documents };
    },

    async getById(categoryId: string): Promise<Category> {
        const response = await databases.getDocument(getDatabaseId(), COLLECTION_ID, categoryId);
        return parseOrThrow(CategorySchema, response, `categories.getById(${categoryId})`);
    },
};

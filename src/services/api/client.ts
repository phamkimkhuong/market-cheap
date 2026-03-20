import { Client, Account, Databases, Storage, Teams, Messaging } from 'appwrite';
import { ConfigurationError } from '@/types/errors';

/**
 * Appwrite API Client initialization.
 * Follows the project standards: always use this apiClient instance.
 */

const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;

if (!endpoint || !projectId) {
    throw new ConfigurationError('APPWRITE_ENDPOINT or APPWRITE_PROJECT_ID is missing in environment variables.');
}

const client = new Client();
client
    .setEndpoint(endpoint)
    .setProject(projectId);

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export const teams = new Teams(client);
export const messaging = new Messaging(client);

export default client;

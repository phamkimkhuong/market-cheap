import { Client, Account } from 'appwrite';
import { cookies } from 'next/headers';
import { ConfigurationError, UnauthorizedError } from '@/types/errors';

const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;

if (!endpoint || !projectId) {
    throw new ConfigurationError('APPWRITE_ENDPOINT or APPWRITE_PROJECT_ID is missing in environment variables.');
}

const buildServerClient = async (): Promise<Client> => {
    const cookieStore = await cookies();
    const appwriteSession =
        cookieStore.get(`a_session_${projectId}`)?.value ||
        cookieStore.get(`a_session_${projectId}_legacy`)?.value;

    if (!appwriteSession) {
        throw new UnauthorizedError('Missing Appwrite session cookie');
    }

    const client = new Client().setEndpoint(endpoint).setProject(projectId);
    client.setSession(appwriteSession);
    return client;
};

export const getServerAccount = async (): Promise<Account> => {
    const client = await buildServerClient();
    return new Account(client);
};

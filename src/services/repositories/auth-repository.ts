import { ID } from 'appwrite';
import { account } from '@/services/api/client';
import { UserSchema, type AuthUser, type LoginCredentials, type RegisterCredentials } from '@/types/auth';
import { UnauthorizedError } from '@/types/errors';
import { parseOrThrow } from '@/services/repositories/validation';

export const authRepository = {
    async getCurrentUser(): Promise<AuthUser | null> {
        try {
            const response = await account.get();
            return parseOrThrow(UserSchema, response, 'auth.currentUser');
        } catch (error: unknown) {
            const err = error as { code?: number };
            if (err.code === 401) {
                return null;
            }
            throw error;
        }
    },

    async login(credentials: LoginCredentials): Promise<AuthUser> {
        await account.createEmailPasswordSession(credentials.email, credentials.password);
        const user = await account.get();
        return parseOrThrow(UserSchema, user, 'auth.login');
    },

    async register(credentials: RegisterCredentials): Promise<AuthUser> {
        await account.create(ID.unique(), credentials.email, credentials.password, credentials.name);
        await account.createEmailPasswordSession(credentials.email, credentials.password);
        const user = await account.get();
        return parseOrThrow(UserSchema, user, 'auth.register');
    },

    async logout(): Promise<void> {
        try {
            await account.deleteSession('current');
        } catch (error: unknown) {
            const err = error as { code?: number };
            if (err.code === 401) {
                throw new UnauthorizedError('No active session');
            }
            throw error;
        }
    },
};

import { ID, OAuthProvider } from 'appwrite';
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
        const normalizedEmail = credentials.email.trim().toLowerCase();
        const normalizedName = credentials.name.trim();
        const normalizedPassword = credentials.password;

        await account.create(ID.unique(), normalizedEmail, normalizedPassword, normalizedName);
        await account.createEmailPasswordSession(normalizedEmail, normalizedPassword);
        const user = await account.get();
        return parseOrThrow(UserSchema, user, 'auth.register');
    },

    async sendEmailVerification(redirectUrl: string): Promise<void> {
        await account.createVerification(redirectUrl);
    },

    async confirmEmailVerification(userId: string, secret: string): Promise<void> {
        await account.updateVerification(userId, secret);
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

    loginWithGoogle(): void {
        const origin = window.location.origin;
        account.createOAuth2Session(
            OAuthProvider.Google,
            `${origin}/`,
            `${origin}/login?oauth=failed`
        );
    },
};

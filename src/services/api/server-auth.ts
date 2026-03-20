import { getServerAccount } from '@/services/api/server-client';
import { UserSchema, type AuthUser } from '@/types/auth';
import { parseOrThrow } from '@/services/repositories/validation';

export const getServerAuthUser = async (): Promise<AuthUser> => {
    const account = await getServerAccount();
    const user = await account.get();
    return parseOrThrow(UserSchema, user, 'server-auth.current-user');
};

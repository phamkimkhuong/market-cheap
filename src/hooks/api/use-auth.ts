'use client';

import { account } from '@/services/api/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { UserSchema, type AuthUser, type LoginCredentials, type RegisterCredentials } from '@/types/auth';
import { createLogger } from '@/utils/logger';
import { ID } from 'appwrite';


const logger = createLogger('useAuth');
const QUERY_KEY = ['auth-user'];

/**
 * Hook to manage authentication.
 * Uses TanStack Query for session state.
 */
export const useAuth = () => {
    const queryClient = useQueryClient();

    // Query for currently logged in user
    const { data: user, isLoading, isError, error } = useQuery({
        queryKey: QUERY_KEY,
        queryFn: async () => {
            try {
                logger.info('Fetching current session...');
                const response = await account.get();

                const result = UserSchema.safeParse(response);
                if (!result.success) {
                    logger.error('Zod Validation Failure for Current User:', result.error.format());
                    // Fallback to original response or throw
                    return response as any as AuthUser;
                }

                return result.data;
            } catch (err: any) {
                // Not logged in is an expected error (Code 401)
                if (err.code !== 401) {
                    logger.error('Failed to fetch auth session:', err.message);
                }
                return null;
            }
        },
        staleTime: Infinity, // Keep auth state until explicit refresh or logout
    });

    // Login Mutation
    const login = useMutation({
        mutationFn: async ({ email, password }: LoginCredentials) => {
            try {
                logger.info('Attempting login for:', email);
                const session = await account.createEmailPasswordSession(email, password);
                logger.info('Login successful, Session ID:', session.$id);
                // After login, fetch the user data
                const userData = await account.get();
                return userData as any as AuthUser;
            } catch (err: any) {
                logger.error('Login failed:', err.message);
                throw err;
            }
        },
        onSuccess: (data) => {
            queryClient.setQueryData(QUERY_KEY, data);
            logger.info('Auth state updated successfully.');
        },
    });

    // Register Mutation
    const register = useMutation({
        mutationFn: async ({ email, password, name }: RegisterCredentials) => {
            try {
                logger.info('Attempting registration for:', email);
                const userCreated = await account.create(ID.unique(), email, password, name);
                logger.info('User created, ID:', userCreated.$id);

                // After registration, log them in
                await account.createEmailPasswordSession(email, password);
                const userData = await account.get();
                return userData as any as AuthUser;
            } catch (err: any) {
                logger.error('Registration failed:', err.message);
                throw err;
            }
        },
        onSuccess: (data) => {
            queryClient.setQueryData(QUERY_KEY, data);
        },
    });

    // Logout Mutation
    const logout = useMutation({
        mutationFn: async () => {
            try {
                logger.info('Logging out current session...');
                await account.deleteSession('current');
                logger.info('Logout successful.');
                return null;
            } catch (err: any) {
                logger.error('Logout failed:', err.message);
                throw err;
            }
        },
        onSuccess: () => {
            queryClient.setQueryData(QUERY_KEY, null);
            // Clear all queries to prevent data leak between users
            queryClient.clear();
        },
    });

    return {
        user,
        isLoading,
        isError,
        error,
        login: login.mutateAsync,
        isLoggingIn: login.isPending,
        register: register.mutateAsync,
        isRegistering: register.isPending,
        logout: logout.mutateAsync,
    };
};

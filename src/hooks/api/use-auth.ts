'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { type LoginCredentials, type RegisterCredentials } from '@/types/auth';
import { createLogger } from '@/utils/logger';
import { authRepository } from '@/services/repositories/auth-repository';
import { getErrorCode, getErrorMessage, getErrorType } from '@/utils/error';


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
                return await authRepository.getCurrentUser();
            } catch (err: unknown) {
                // Not logged in is an expected error (Code 401)
                if (getErrorCode(err) !== 401) {
                    logger.error('Failed to fetch auth session:', getErrorMessage(err));
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
                return await authRepository.login({ email, password });
            } catch (err: unknown) {
                logger.error('Login failed:', getErrorMessage(err));
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
                return await authRepository.register({ email, password, name });
            } catch (err: unknown) {
                logger.error('Registration failed:', getErrorMessage(err), {
                    code: getErrorCode(err),
                    type: getErrorType(err),
                });
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
                await authRepository.logout();
                logger.info('Logout successful.');
                return null;
            } catch (err: unknown) {
                logger.error('Logout failed:', getErrorMessage(err));
                throw err;
            }
        },
        onSuccess: () => {
            queryClient.setQueryData(QUERY_KEY, null);
            // Clear all queries to prevent data leak between users
            queryClient.clear();
        },
    });

    const loginWithGoogle = () => {
        logger.info('Redirecting to Google OAuth...');
        authRepository.loginWithGoogle();
    };

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
        loginWithGoogle,
    };
};

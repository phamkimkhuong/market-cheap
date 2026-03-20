import { ConfigurationError } from '@/types/errors';

export const getDatabaseId = (): string => {
    return process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'marketplace';
};

export const getRequiredHeader = (value: string | null, name: string): string => {
    if (!value) {
        throw new ConfigurationError(`${name} header is required`);
    }
    return value;
};

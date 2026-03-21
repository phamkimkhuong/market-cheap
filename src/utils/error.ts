export const getErrorMessage = (error: unknown): string => {
    if (error instanceof Error) {
        return error.message;
    }
    return 'Unknown error';
};

export const getErrorCode = (error: unknown): number | undefined => {
    if (typeof error === 'object' && error !== null && 'code' in error) {
        const code = (error as { code?: unknown }).code;
        if (typeof code === 'number') {
            return code;
        }
    }
    return undefined;
};

export const getErrorType = (error: unknown): string | undefined => {
    if (typeof error === 'object' && error !== null && 'type' in error) {
        const type = (error as { type?: unknown }).type;
        if (typeof type === 'string') {
            return type;
        }
    }
    return undefined;
};

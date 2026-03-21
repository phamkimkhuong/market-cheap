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

export const isEmailAlreadyExistsError = (error: unknown): boolean => {
    if (typeof error !== 'object' || error === null) return false;

    const code = getErrorCode(error);
    const type = getErrorType(error);
    const message = getErrorMessage(error).toLowerCase();

    const duplicateTypeMatch =
        type === 'user_already_exists' ||
        type === 'user_email_already_exists' ||
        type === 'user_email_exists';

    const duplicateMessageMatch =
        message.includes('already exists') ||
        message.includes('already been used') ||
        message.includes('email is already') ||
        message.includes('user already exists');

    return duplicateTypeMatch || (code === 409 && duplicateMessageMatch) || duplicateMessageMatch;
};

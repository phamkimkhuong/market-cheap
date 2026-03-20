import { ZodSchema } from 'zod';
import { ValidationError } from '@/types/errors';

export const parseOrThrow = <T>(schema: ZodSchema<T>, value: unknown, context: string): T => {
    const result = schema.safeParse(value);
    if (!result.success) {
        throw new ValidationError(`Invalid response shape for ${context}`, result.error.format());
    }
    return result.data;
};

export const parseListOrFilter = <T>(
    schema: ZodSchema<T>,
    values: unknown[],
    _context: string
): T[] => {
    return values.reduce<T[]>((acc, current) => {
        const result = schema.safeParse(current);
        if (!result.success) {
            return acc;
        }
        acc.push(result.data);
        return acc;
    }, []);
};

import { z } from 'zod';

/**
 * Auth Session Schemas & Types.
 */

export const UserSchema = z.object({
    $id: z.string(),
    name: z.string(),
    email: z.string().email(),
    phone: z.string().optional(),
    labels: z.array(z.string()).optional(),
    $createdAt: z.string(),
    $updatedAt: z.string(),
    registration: z.string(),
    status: z.boolean(),
    emailVerification: z.boolean(),
    phoneVerification: z.boolean(),
});

export type AuthUser = z.infer<typeof UserSchema>;

export const LoginSchema = z.object({
    email: z.string().email('Email is required'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
});

export type LoginCredentials = z.infer<typeof LoginSchema>;

export const RegisterSchema = z.object({
    email: z.string().email('Email is required'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    name: z.string().min(2, 'Name is required'),
});

export type RegisterCredentials = z.infer<typeof RegisterSchema>;

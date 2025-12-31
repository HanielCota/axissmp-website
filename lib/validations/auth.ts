import { z } from 'zod'

export const loginSchema = z.object({
    email: z
        .string()
        .min(1, 'E-mail é obrigatório')
        .email('E-mail inválido'),
    password: z
        .string()
        .min(1, 'Senha é obrigatória')
        .min(6, 'Senha deve ter no mínimo 6 caracteres'),
})

export const registerSchema = z.object({
    nickname: z
        .string()
        .min(3, 'Nickname deve ter no mínimo 3 caracteres')
        .max(16, 'Nickname deve ter no máximo 16 caracteres')
        .regex(/^[a-zA-Z0-9_]+$/, 'Nickname deve conter apenas letras, números e _'),
    email: z
        .string()
        .min(1, 'E-mail é obrigatório')
        .email('E-mail inválido'),
    password: z
        .string()
        .min(6, 'Senha deve ter no mínimo 6 caracteres'),
    confirmPassword: z
        .string()
        .min(1, 'Confirmação de senha é obrigatória'),
}).refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
})

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>

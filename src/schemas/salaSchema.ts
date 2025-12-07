import { z } from 'zod';

export const salaSchema = z.object({
    numero: z.preprocess(
        v => Number(v),
        z
            .number({ error: 'Número da sala deve ser numérico' })
            .int()
            .positive('Número da sala deve ser maior que 0'),
    ),
    capacidade: z.preprocess(
        v => Number(v),
        z
            .number({ error: 'Capacidade deve ser numérica' })
            .int()
            .positive('Capacidade deve ser maior que 0'),
    ),
});

export type SalaFormData = z.infer<typeof salaSchema>;

import { z } from 'zod';

export const ingressoSchema = z.object({
    valorBase: z.preprocess(
        v => Number(v),
        z
            .number({ error: 'Informe um valor' })
            .positive('O valor deve ser maior que 0'),
    ),
    tipo: z.enum(['INTEIRA', 'MEIA'], {
        error: 'Selecione o tipo de ingresso',
    }),
});

export type IngressoFormData = z.infer<typeof ingressoSchema>;

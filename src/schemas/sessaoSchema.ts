import { z } from 'zod';

export const sessaoSchema = z.object({
    filmeId: z.string().min(1, 'Selecione um filme'),
    salaId: z.string().min(1, 'Selecione uma sala'),
    dataHora: z.string().min(1, 'Data/horário é obrigatório'),
});

export type SessaoFormData = z.infer<typeof sessaoSchema>;

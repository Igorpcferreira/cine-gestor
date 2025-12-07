import { z } from 'zod';

export const filmeSchema = z.object({
    titulo: z.string().min(1, 'Título é obrigatório'),
    sinopse: z.string().min(10, 'Sinopse deve ter no mínimo 10 caracteres'),
    classificacao: z.string().min(1, 'Classificação é obrigatória'),
    duracaoMin: z.preprocess(
        (value: unknown) => Number(value),
        z
            .number({ error: 'Duração deve ser um número' })
            .positive('Duração deve ser maior que 0'),
    ),
    genero: z.string().min(1, 'Gênero é obrigatório'),
    dataInicio: z.string().min(1, 'Data inicial é obrigatória'),
    dataFim: z.string().min(1, 'Data final é obrigatória'),

});

export type FilmeFormData = z.infer<typeof filmeSchema>;

import { api } from './api';
import type { Ingresso } from '../types/ingresso';

export async function listarIngressosPorSessao(sessaoId: string): Promise<Ingresso[]> {
    const { data } = await api.get<Ingresso[]>(`/ingressos?sessaoId=${sessaoId}`);
    return data;
}

export async function criarIngresso(payload: Omit<Ingresso, 'id'>): Promise<Ingresso> {
    const { data } = await api.post<Ingresso>('/ingressos', payload);
    return data;
}

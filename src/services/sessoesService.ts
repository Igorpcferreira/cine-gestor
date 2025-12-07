import { api } from './api';
import type { Sessao } from '../types/sessao';

export async function listarSessoes(): Promise<Sessao[]> {
    const { data } = await api.get<Sessao[]>('/sessoes');
    return data;
}

export async function criarSessao(payload: Omit<Sessao, 'id'>): Promise<Sessao> {
    const { data } = await api.post<Sessao>('/sessoes', payload);
    return data;
}

export async function excluirSessao(id: string | number): Promise<void> {
    await api.delete(`/sessoes/${id}`);
}

export async function buscarSessaoPorId(id: string | number): Promise<Sessao> {
    const { data } = await api.get<Sessao>(`/sessoes/${id}`);
    return data;
}

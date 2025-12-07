import { api } from './api';
import type { Filme } from '../types/filme';

export async function listarFilmes(): Promise<Filme[]> {
    const { data } = await api.get<Filme[]>('/filmes');
    return data;
}

export async function criarFilme(payload: Omit<Filme, 'id'>): Promise<Filme> {
    const { data } = await api.post<Filme>('/filmes', payload);
    return data;
}

export async function excluirFilme(id: number): Promise<void> {
    await api.delete(`/filmes/${id}`);
}

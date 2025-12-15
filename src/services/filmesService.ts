import { api } from './api';
import type { Filme } from '../types/filme';

const RESOURCE = '/filmes';

export async function listarFilmes(): Promise<Filme[]> {
    const { data } = await api.get<Filme[]>(RESOURCE);
    return data;
}

export async function criarFilme(payload: Omit<Filme, 'id'>): Promise<Filme> {
    const { data } = await api.post<Filme>(RESOURCE, payload);
    return data;
}

export async function atualizarFilme(
    id: string | number,
    payload: Omit<Filme, 'id'>,
): Promise<Filme> {
    const { data } = await api.put<Filme>(`${RESOURCE}/${id}`, payload);
    return data;
}

export async function excluirFilme(id: string | number): Promise<void> {
    await api.delete(`${RESOURCE}/${id}`);
}

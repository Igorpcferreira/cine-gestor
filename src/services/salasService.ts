import { api } from './api';
import type { Sala } from '../types/sala';

export async function listarSalas(): Promise<Sala[]> {
    const { data } = await api.get<Sala[]>('/salas');
    return data;
}

export async function criarSala(payload: Omit<Sala, 'id'>): Promise<Sala> {
    const { data } = await api.post<Sala>('/salas', payload);
    return data;
}

export async function atualizarSala(
    id: string | number,
    payload: Omit<Sala, 'id'>
): Promise<Sala> {
    const { data } = await api.put<Sala>(`/salas/${id}`, payload);
    return data;
}

export async function excluirSala(id: string | number): Promise<void> {
    await api.delete(`/salas/${id}`);
}

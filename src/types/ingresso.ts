export type TipoIngresso = 'INTEIRA' | 'MEIA';

export interface Ingresso {
    id?: string | number;
    sessaoId: string;
    tipo: TipoIngresso;
    valor: number;
}

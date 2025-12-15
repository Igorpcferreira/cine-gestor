import {type ChangeEvent, type FormEvent, useEffect, useState } from 'react';
import { salaSchema, type SalaFormData } from '../../schemas/salaSchema';
import type { Sala } from '../../types/sala';
import {
    listarSalas,
    criarSala,
    excluirSala,
    atualizarSala,
} from '../../services/salasService';

type FormErrors = Partial<Record<keyof SalaFormData, string>>;

const emptyForm: SalaFormData = {
    numero: 0,
    capacidade: 0,
};

export default function SalasPage() {
    const [form, setForm] = useState<SalaFormData>(emptyForm);
    const [errors, setErrors] = useState<FormErrors>({});
    const [salas, setSalas] = useState<Sala[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingId, setEditingId] = useState<string | number | null>(null);

    useEffect(() => {
        listarSalas()
            .then(setSalas)
            .finally(() => setIsLoading(false));
    }, []);

    function handleChange(event: ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;

        setForm(prev => ({
            ...prev,
            [name]: Number(value) || 0,
        }));

        setErrors(prev => ({ ...prev, [name]: undefined }));
    }

    function preencherParaEdicao(sala: Sala) {
        setEditingId(sala.id ?? null);
        setForm({
            numero: sala.numero,
            capacidade: sala.capacidade,
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function cancelarEdicao() {
        setEditingId(null);
        setForm(emptyForm);
        setErrors({});
    }

    async function handleSubmit(event: FormEvent) {
        event.preventDefault();
        setIsSubmitting(true);

        const result = salaSchema.safeParse(form);
        if (!result.success) {
            const fieldErrors: FormErrors = {};
            result.error.issues.forEach(issue => {
                fieldErrors[issue.path[0] as keyof SalaFormData] = issue.message;
            });
            setErrors(fieldErrors);
            setIsSubmitting(false);
            return;
        }

        try {
            if (editingId !== null) {
                const atualizada = await atualizarSala(editingId, result.data);
                setSalas(prev =>
                    prev.map(s => (s.id === atualizada.id ? atualizada : s))
                );
            } else {
                const novaSala = await criarSala(result.data);
                setSalas(prev => [...prev, novaSala]);
            }

            cancelarEdicao();
        } catch (error) {
            console.error('Erro ao salvar sala', error);
        } finally {
            setIsSubmitting(false);
        }
    }

    async function handleDelete(id?: number) {
        if (!id) return;
        if (!window.confirm('Excluir esta sala?')) return;

        try {
            await excluirSala(id);
            setSalas(prev => prev.filter(s => s.id !== id));
            if (editingId === id) cancelarEdicao();
        } catch (error) {
            console.error('Erro ao excluir sala', error);
        }
    }

    return (
        <div className="container py-4 cine-page">
            <h1 className="mb-4">Gestão de Salas</h1>

            <div className="row">
                {/* Form */}
                <div className="col-lg-4 mb-4">
                    <div className="card">
                        <div className="card-header">
                            {editingId ? 'Editar Sala' : 'Cadastrar Sala'}
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleSubmit} noValidate>
                                <div className="mb-3">
                                    <label className="form-label">Número da Sala</label>
                                    <input
                                        type="number"
                                        name="numero"
                                        className={`form-control ${errors.numero ? 'is-invalid' : ''}`}
                                        value={form.numero || ''}
                                        onChange={handleChange}
                                        min={1}
                                    />
                                    {errors.numero && (
                                        <div className="invalid-feedback">{errors.numero}</div>
                                    )}
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Capacidade Máxima</label>
                                    <input
                                        type="number"
                                        name="capacidade"
                                        className={`form-control ${errors.capacidade ? 'is-invalid' : ''}`}
                                        value={form.capacidade || ''}
                                        onChange={handleChange}
                                        min={1}
                                    />
                                    {errors.capacidade && (
                                        <div className="invalid-feedback">{errors.capacidade}</div>
                                    )}
                                </div>

                                <button type="submit" className="btn btn-primary w-100" disabled={isSubmitting}>
                                    {isSubmitting
                                        ? 'Salvando...'
                                        : editingId
                                            ? 'Salvar Alterações'
                                            : 'Salvar Sala'}
                                </button>

                                {editingId && (
                                    <button
                                        type="button"
                                        className="btn btn-outline-secondary w-100 mt-2"
                                        onClick={cancelarEdicao}
                                    >
                                        Cancelar edição
                                    </button>
                                )}
                            </form>
                        </div>
                    </div>
                </div>

                {/* Tabela */}
                <div className="col-lg-8">
                    <div className="card">
                        <div className="card-header">Salas cadastradas</div>
                        <div className="card-body">
                            {isLoading ? (
                                <p>Carregando salas...</p>
                            ) : salas.length === 0 ? (
                                <p>Nenhuma sala cadastrada ainda.</p>
                            ) : (
                                <table className="table table-striped align-middle">
                                    <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Número</th>
                                        <th>Capacidade</th>
                                        <th className="text-end">Ações</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {salas.map(sala => (
                                        <tr key={sala.id}>
                                            <td>{sala.id}</td>
                                            <td>{sala.numero}</td>
                                            <td>{sala.capacidade}</td>
                                            <td className="text-end">
                                                <button
                                                    className="btn btn-outline-primary btn-sm me-2"
                                                    onClick={() => preencherParaEdicao(sala)}
                                                >
                                                    Editar
                                                </button>
                                                <button
                                                    className="btn btn-outline-danger btn-sm"
                                                    onClick={() => handleDelete(sala.id)}
                                                >
                                                    Excluir
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

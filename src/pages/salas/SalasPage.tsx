import {type ChangeEvent, type FormEvent, useEffect, useState } from 'react';
import { salaSchema, type SalaFormData } from '../../schemas/salaSchema';
import type { Sala } from '../../types/sala';
import { listarSalas, criarSala, excluirSala } from '../../services/salasService';

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

    useEffect(() => {
        async function loadSalas() {
            try {
                const data = await listarSalas();
                setSalas(data);
            } catch (error) {
                console.error('Erro ao carregar salas', error);
            } finally {
                setIsLoading(false);
            }
        }

        loadSalas();
    }, []);

    function handleChange(event: ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;

        setForm(prev => ({
            ...prev,
            [name]: name === 'numero' || name === 'capacidade' ? Number(value) || 0 : value,
        }));

        setErrors(prev => ({
            ...prev,
            [name]: undefined,
        }));
    }

    async function handleSubmit(event: FormEvent) {
        event.preventDefault();
        setIsSubmitting(true);

        const result = salaSchema.safeParse(form);
        if (!result.success) {
            const fieldErrors: FormErrors = {};
            result.error.issues.forEach(issue => {
                const fieldName = issue.path[0] as keyof SalaFormData;
                fieldErrors[fieldName] = issue.message;
            });
            setErrors(fieldErrors);
            setIsSubmitting(false);
            return;
        }

        try {
            const novaSala = await criarSala(result.data);
            setSalas(prev => [...prev, novaSala]);
            setForm(emptyForm);
        } catch (error) {
            console.error('Erro ao criar sala', error);
        } finally {
            setIsSubmitting(false);
        }
    }

    async function handleDelete(id?: number) {
        if (!id) return;
        const confirmar = window.confirm('Tem certeza que deseja excluir esta sala?');
        if (!confirmar) return;

        try {
            await excluirSala(id);
            setSalas(prev => prev.filter(s => s.id !== id));
        } catch (error) {
            console.error('Erro ao excluir sala', error);
        }
    }

    return (
        <div className="container py-4 cine-page">
            <h1 className="mb-4">Gestão de Salas</h1>

            <div className="row">
                {/* Formulário */}
                <div className="col-lg-4 mb-4">
                    <div className="card">
                        <div className="card-header">Cadastrar Sala</div>
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
                                    {errors.numero && <div className="invalid-feedback">{errors.numero}</div>}
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

                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'Salvando...' : 'Salvar Sala'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Listagem */}
                <div className="col-lg-8">
                    <div className="card">
                        <div className="card-header">Salas cadastradas</div>
                        <div className="card-body">
                            {isLoading ? (
                                <p>Carregando salas...</p>
                            ) : salas.length === 0 ? (
                                <p>Nenhuma sala cadastrada ainda.</p>
                            ) : (
                                <div className="table-responsive">
                                    <table className="table table-striped align-middle cine-table">
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
                                                        type="button"
                                                        className="btn btn-outline-danger btn-sm"
                                                        onClick={() => handleDelete(sala.id)}
                                                    >
                                                        <i className="bi bi-trash me-1" />
                                                        Excluir
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

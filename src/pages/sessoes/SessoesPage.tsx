import {type ChangeEvent, type FormEvent, useEffect, useState } from 'react';
import { sessaoSchema } from '../../schemas/sessaoSchema';
import type { Sessao } from '../../types/sessao';
import type { Filme } from '../../types/filme';
import type { Sala } from '../../types/sala';
import { listarSessoes, criarSessao, excluirSessao } from '../../services/sessoesService';
import { listarFilmes } from '../../services/filmesService';
import { listarSalas } from '../../services/salasService';
import { Link } from 'react-router-dom';

type FormState = {
    filmeId: string;
    salaId: string;
    dataHora: string;
};

type FormErrors = Partial<Record<keyof FormState, string>>;

const emptyForm: FormState = {
    filmeId: '',
    salaId: '',
    dataHora: '',
};

export default function SessoesPage() {
    const [form, setForm] = useState<FormState>(emptyForm);
    const [errors, setErrors] = useState<FormErrors>({});
    const [sessoes, setSessoes] = useState<Sessao[]>([]);
    const [filmes, setFilmes] = useState<Filme[]>([]);
    const [salas, setSalas] = useState<Sala[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        async function loadData() {
            try {
                const [filmesData, salasData, sessoesData] = await Promise.all([
                    listarFilmes(),
                    listarSalas(),
                    listarSessoes(),
                ]);
                setFilmes(filmesData);
                setSalas(salasData);
                setSessoes(sessoesData);
            } catch (error) {
                console.error('Erro ao carregar dados de sessões', error);
            } finally {
                setIsLoading(false);
            }
        }

        loadData();
    }, []);

    function handleChange(
        event: ChangeEvent<HTMLSelectElement | HTMLInputElement>,
    ) {
        const { name, value } = event.target;

        setForm(prev => ({
            ...prev,
            [name]: value,
        }));

        setErrors(prev => ({
            ...prev,
            [name]: undefined,
        }));
    }

    async function handleSubmit(event: FormEvent) {
        event.preventDefault();
        setIsSubmitting(true);

        const result = sessaoSchema.safeParse(form);

        if (!result.success) {
            const fieldErrors: FormErrors = {};
            result.error.issues.forEach(issue => {
                const fieldName = issue.path[0] as keyof FormState;
                fieldErrors[fieldName] = issue.message;
            });
            setErrors(fieldErrors);
            setIsSubmitting(false);
            return;
        }

        setErrors({});

        const parsed = result.data;

        try {
            const novaSessao = await criarSessao({
                filmeId: parsed.filmeId,
                salaId: parsed.salaId,
                dataHora: parsed.dataHora,
            });
            setSessoes(prev => [...prev, novaSessao]);
            setForm(emptyForm);
        } catch (error) {
            console.error('Erro ao criar sessão', error);
        } finally {
            setIsSubmitting(false);
        }
    }

    async function handleDelete(id?: string | number | undefined) {
        if (!id) return;
        const confirmar = window.confirm('Tem certeza que deseja excluir esta sessão?');
        if (!confirmar) return;

        try {
            await excluirSessao(id);
            setSessoes(prev => prev.filter(s => s.id !== id));
        } catch (error) {
            console.error('Erro ao excluir sessão', error);
        }
    }

    function getFilmeTitulo(filmeId: string) {
        const filme = filmes.find(f => String(f.id) === filmeId);
        return filme ? filme.titulo : `Filme #${filmeId}`;
    }

    function getSalaNumero(salaId: string) {
        const sala = salas.find(s => String(s.id) === salaId);
        return sala ? sala.numero : `Sala #${salaId}`;
    }

    function formatarDataHora(value: string) {
        if (!value) return '';
        const data = new Date(value);
        if (Number.isNaN(data.getTime())) {
            return value;
        }
        return data.toLocaleString('pt-BR', {
            dateStyle: 'short',
            timeStyle: 'short',
        });
    }

    return (
        <div className="container py-4 cine-page">
            <h1 className="mb-4">Gestão de Sessões</h1>

            <div className="row">
                {/* Formulário */}
                <div className="col-lg-4 mb-4">
                    <div className="card">
                        <div className="card-header">Cadastrar Sessão</div>
                        <div className="card-body">
                            <form onSubmit={handleSubmit} noValidate>
                                {/* Filme */}
                                <div className="mb-3">
                                    <label className="form-label">Filme</label>
                                    <select
                                        name="filmeId"
                                        className={`form-select ${errors.filmeId ? 'is-invalid' : ''}`}
                                        value={form.filmeId}
                                        onChange={handleChange}
                                    >
                                        <option value="">Selecione um filme</option>
                                        {filmes.map(filme => (
                                            <option key={filme.id} value={filme.id}>
                                                {filme.titulo}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.filmeId && (
                                        <div className="invalid-feedback">{errors.filmeId}</div>
                                    )}
                                </div>

                                {/* Sala */}
                                <div className="mb-3">
                                    <label className="form-label">Sala</label>
                                    <select
                                        name="salaId"
                                        className={`form-select ${errors.salaId ? 'is-invalid' : ''}`}
                                        value={form.salaId}
                                        onChange={handleChange}
                                    >
                                        <option value="">Selecione uma sala</option>
                                        {salas.map(sala => (
                                            <option key={sala.id} value={sala.id}>
                                                Sala {sala.numero}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.salaId && (
                                        <div className="invalid-feedback">{errors.salaId}</div>
                                    )}
                                </div>

                                {/* Data / horário */}
                                <div className="mb-3">
                                    <label className="form-label">Data e horário</label>
                                    <input
                                        type="datetime-local"
                                        name="dataHora"
                                        className={`form-control ${errors.dataHora ? 'is-invalid' : ''}`}
                                        value={form.dataHora}
                                        onChange={handleChange}
                                    />
                                    {errors.dataHora && (
                                        <div className="invalid-feedback">{errors.dataHora}</div>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'Salvando...' : 'Salvar Sessão'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Listagem */}
                <div className="col-lg-8">
                    <div className="card">
                        <div className="card-header">Sessões cadastradas</div>
                        <div className="card-body">
                            {isLoading ? (
                                <p>Carregando sessões...</p>
                            ) : sessoes.length === 0 ? (
                                <p>Nenhuma sessão cadastrada ainda.</p>
                            ) : (
                                <div className="table-responsive">
                                    <table className="table table-striped align-middle cine-table">
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Filme</th>
                                            <th>Sala</th>
                                            <th>Data / Horário</th>
                                            <th className="text-end">Ações</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {sessoes.map(sessao => (
                                            <tr key={sessao.id}>
                                                <td>{sessao.id}</td>
                                                <td>{getFilmeTitulo(sessao.filmeId)}</td>
                                                <td>{getSalaNumero(sessao.salaId)}</td>
                                                <td>{formatarDataHora(sessao.dataHora)}</td>
                                                <td className="text-end">
                                                    <div className="btn-group btn-group-sm" role="group">
                                                        <Link
                                                            to={`/sessoes/${sessao.id}/ingressos`}
                                                            className="btn btn-sm btn-success"
                                                        >
                                                            Vender Ingresso
                                                        </Link>
                                                        <button
                                                            type="button"
                                                            className="btn btn-outline-danger"
                                                            onClick={() => handleDelete(sessao.id)}
                                                        >
                                                            <i className="bi bi-trash me-1" />
                                                            Excluir
                                                        </button>
                                                    </div>
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

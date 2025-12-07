import {
    type ChangeEvent,
    type FormEvent,
    useEffect,
    useState,
} from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

import { ingressoSchema, type IngressoFormData } from '../../schemas/ingressoSchema';
import type { Ingresso } from '../../types/ingresso';
import type { Sessao } from '../../types/sessao';
import type { Filme } from '../../types/filme';
import type { Sala } from '../../types/sala';

import { buscarSessaoPorId } from '../../services/sessoesService';
import { listarFilmes } from '../../services/filmesService';
import { listarSalas } from '../../services/salasService';
import {
    criarIngresso,
    listarIngressosPorSessao,
} from '../../services/ingressosService';

type FormErrors = Partial<Record<keyof IngressoFormData, string>>;

const emptyForm: IngressoFormData = {
    valorBase: 0,
    tipo: 'INTEIRA',
};

export default function VenderIngressoPage() {
    const { sessaoId } = useParams<{ sessaoId: string }>();
    const navigate = useNavigate();

    const [sessao, setSessao] = useState<Sessao | null>(null);
    const [filme, setFilme] = useState<Filme | null>(null);
    const [sala, setSala] = useState<Sala | null>(null);
    const [ingressos, setIngressos] = useState<Ingresso[]>([]);

    const [form, setForm] = useState<IngressoFormData>(emptyForm);
    const [errors, setErrors] = useState<FormErrors>({});
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
// carrega sessão
        if (!sessaoId) return;
        const id = sessaoId;

        async function loadData() {
            try {
                const sessaoData: Sessao = await buscarSessaoPorId(id);

                setSessao(sessaoData);

                const [filmesData, salasData, ingressosData] = await Promise.all([
                    listarFilmes(),
                    listarSalas(),
                    listarIngressosPorSessao(id),
                ]);

                const filmeSessao = filmesData.find(f => String(f.id) === String(sessaoData.filmeId)) || null;
                const salaSessao = salasData.find(s => String(s.id) === String(sessaoData.salaId)) || null;

                setFilme(filmeSessao);
                setSala(salaSessao);
                setIngressos(ingressosData);
            } catch (error) {
                console.error('Erro ao carregar dados da venda de ingresso', error);
            } finally {
                setIsLoading(false);
            }
        }

        void loadData();
    }, [sessaoId]);

    function handleChange(
        event: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    ) {
        const { name, value } = event.target;

        setForm(prev => ({
            ...prev,
            [name]: name === 'valorBase' ? Number(value) || 0 : value,
        }));

        setErrors(prev => ({
            ...prev,
            [name]: undefined,
        }));
    }

    const valorFinal =
        form.tipo === 'MEIA'
            ? Number(form.valorBase || 0) / 2
            : Number(form.valorBase || 0);

    async function handleSubmit(event: FormEvent) {
        event.preventDefault();
        if (!sessaoId) return;

        setIsSubmitting(true);

        const result = ingressoSchema.safeParse(form);

        if (!result.success) {
            const fieldErrors: FormErrors = {};
            result.error.issues.forEach(issue => {
                const fieldName = issue.path[0] as keyof IngressoFormData;
                fieldErrors[fieldName] = issue.message;
            });
            setErrors(fieldErrors);
            setIsSubmitting(false);
            return;
        }

        setErrors({});

        const parsed = result.data;

        try {
            const novoIngresso = await criarIngresso({
                sessaoId,
                tipo: parsed.tipo,
                valor: form.tipo === 'MEIA'
                    ? parsed.valorBase / 2
                    : parsed.valorBase,
            });

            setIngressos(prev => [...prev, novoIngresso]);
            setForm(emptyForm);
        } catch (error) {
            console.error('Erro ao criar ingresso', error);
        } finally {
            setIsSubmitting(false);
        }
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

    if (isLoading) {
        return <div className="container py-4 cine-page">Carregando...</div>;
    }

    if (!sessao) {
        return (
            <div className="container py-4 cine-page">
                <p>Sessão não encontrada.</p>
                <Link to="/sessoes" className="btn btn-secondary">
                    Voltar para sessões
                </Link>
            </div>
        );
    }

    return (
        <div className="container py-4 cine-page">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h1>Venda de ingresso</h1>
                <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => navigate(-1)}
                >
                    Voltar
                </button>
            </div>

            <div className="row g-4">
                {/* Detalhes da sessão */}
                <div className="col-lg-4">
                    <div className="card">
                        <div className="card-header">Sessão selecionada</div>
                        <div className="card-body">
                            <p className="mb-1">
                                <strong>Filme:</strong> {filme ? filme.titulo : `Filme #${sessao.filmeId}`}
                            </p>
                            <p className="mb-1">
                                <strong>Sala:</strong> {sala ? sala.numero : `Sala #${sessao.salaId}`}
                            </p>
                            <p className="mb-0">
                                <strong>Data / horário:</strong> {formatarDataHora(sessao.dataHora)}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Formulário de venda */}
                <div className="col-lg-4">
                    <div className="card">
                        <div className="card-header">Registrar venda</div>
                        <div className="card-body">
                            <form onSubmit={handleSubmit} noValidate>
                                <div className="mb-3">
                                    <label className="form-label">Valor base (inteira)</label>
                                    <input
                                        type="number"
                                        name="valorBase"
                                        className={`form-control ${errors.valorBase ? 'is-invalid' : ''}`}
                                        value={form.valorBase || ''}
                                        onChange={handleChange}
                                        min={0}
                                        step="0.01"
                                    />
                                    {errors.valorBase && (
                                        <div className="invalid-feedback">{errors.valorBase}</div>
                                    )}
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Tipo de ingresso</label>
                                    <select
                                        name="tipo"
                                        className={`form-select ${errors.tipo ? 'is-invalid' : ''}`}
                                        value={form.tipo}
                                        onChange={handleChange}
                                    >
                                        <option value="INTEIRA">Inteira</option>
                                        <option value="MEIA">Meia</option>
                                    </select>
                                    {errors.tipo && (
                                        <div className="invalid-feedback">{errors.tipo}</div>
                                    )}
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Valor final</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={valorFinal.toFixed(2)}
                                        disabled
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'Registrando...' : 'Registrar venda'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Ingressos da sessão */}
                <div className="col-lg-4">
                    <div className="card">
                        <div className="card-header">Ingressos desta sessão</div>
                        <div className="card-body">
                            {ingressos.length === 0 ? (
                                <p>Nenhum ingresso vendido ainda.</p>
                            ) : (
                                <div className="table-responsive">
                                    <table className="table table-striped align-middle cine-table">
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Tipo</th>
                                            <th>Valor</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {ingressos.map(ingresso => (
                                            <tr key={ingresso.id}>
                                                <td>{ingresso.id}</td>
                                                <td>{ingresso.tipo}</td>
                                                <td>
                                                    {ingresso.valor.toLocaleString('pt-BR', {
                                                        style: 'currency',
                                                        currency: 'BRL',
                                                    })}
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

import {
    type FormEvent,
    useEffect,
    useState,
    type ChangeEvent,
} from 'react';
import { filmeSchema, type FilmeFormData } from '../../schemas/filmeSchema';
import type { Filme } from '../../types/filme';
import {
    listarFilmes,
    criarFilme,
    excluirFilme,
    atualizarFilme,
} from '../../services/filmesService';

type FormErrors = Partial<Record<keyof FilmeFormData, string>>;

const emptyForm: FilmeFormData = {
    titulo: '',
    sinopse: '',
    classificacao: '',
    duracaoMin: 0,
    genero: '',
    dataInicio: '',
    dataFim: '',
};

export function FilmesPage() {
    const [filmes, setFilmes] = useState<Filme[]>([]);
    const [form, setForm] = useState<FilmeFormData>(emptyForm);
    const [errors, setErrors] = useState<FormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingId, setEditingId] = useState<string | number | null>(null);

    useEffect(() => {
        (async () => {
            try {
                const data = await listarFilmes();
                setFilmes(data);
            } catch (error) {
                console.error('Erro ao carregar filmes', error);
            }
        })();
    }, []);

    function handleChange(
        event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
    ) {
        const { name, value } = event.target;
        setForm((prev) => ({
            ...prev,
            [name]: name === 'duracaoMin' ? Number(value) || 0 : value,
        }));
        setErrors((prev) => ({
            ...prev,
            [name]: undefined,
        }));
    }

    function preencherFormParaEdicao(filme: Filme) {
        setForm({
            titulo: filme.titulo,
            sinopse: filme.sinopse,
            classificacao: filme.classificacao,
            duracaoMin: filme.duracaoMin,
            genero: filme.genero,
            dataInicio: filme.dataInicio,
            dataFim: filme.dataFim,
        });
        setEditingId(filme.id ?? null);
        setErrors({});
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

        const result = filmeSchema.safeParse(form);

        if (!result.success) {
            const fieldErrors: FormErrors = {};
            result.error.issues.forEach((issue) => {
                const fieldName = issue.path[0] as keyof FilmeFormData;
                fieldErrors[fieldName] = issue.message;
            });
            setErrors(fieldErrors);
            setIsSubmitting(false);
            return;
        }

        try {
            const payload = result.data;

            if (editingId !== null) {
                // edição
                const atualizado = await atualizarFilme(editingId, payload);
                setFilmes((prev) =>
                    prev.map((f) => (f.id === atualizado.id ? atualizado : f)),
                );
            } else {
                // inclusão
                const novoFilme = await criarFilme(payload);
                setFilmes((prev) => [...prev, novoFilme]);
            }

            setForm(emptyForm);
            setEditingId(null);
        } catch (error) {
            console.error('Erro ao salvar filme', error);
        } finally {
            setIsSubmitting(false);
        }
    }

    async function handleDelete(id?: string | number) {
        if (!id) return;
        const confirmar = window.confirm(
            'Tem certeza que deseja excluir este filme?',
        );
        if (!confirmar) return;

        try {
            await excluirFilme(id);
            setFilmes((prev) => prev.filter((f) => f.id !== id));
            if (editingId === id) {
                cancelarEdicao();
            }
        } catch (error) {
            console.error('Erro ao excluir filme', error);
        }
    }

    return (
        <div className="container py-4 cine-page">
            <h1 className="mb-4">Gestão de Filmes</h1>

            {/* Formulário */}
            <div className="row">
                <div className="col-lg-5 mb-4">
                    <div className="card">
                        <div className="card-header">
                            <strong>{editingId ? 'Editar Filme' : 'Novo Filme'}</strong>
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleSubmit} noValidate>
                                {/* Título */}
                                <div className="mb-3">
                                    <label className="form-label">Título</label>
                                    <input
                                        type="text"
                                        name="titulo"
                                        className={`form-control ${
                                            errors.titulo ? 'is-invalid' : ''
                                        }`}
                                        value={form.titulo}
                                        onChange={handleChange}
                                    />
                                    {errors.titulo && (
                                        <div className="invalid-feedback">{errors.titulo}</div>
                                    )}
                                </div>

                                {/* Gênero */}
                                <div className="mb-3">
                                    <label className="form-label">Gênero</label>
                                    <input
                                        type="text"
                                        name="genero"
                                        className={`form-control ${
                                            errors.genero ? 'is-invalid' : ''
                                        }`}
                                        value={form.genero}
                                        onChange={handleChange}
                                    />
                                    {errors.genero && (
                                        <div className="invalid-feedback">{errors.genero}</div>
                                    )}
                                </div>

                                {/* Classificação */}
                                <div className="mb-3">
                                    <label className="form-label">Classificação</label>
                                    <input
                                        type="text"
                                        name="classificacao"
                                        className={`form-control ${
                                            errors.classificacao ? 'is-invalid' : ''
                                        }`}
                                        value={form.classificacao}
                                        onChange={handleChange}
                                    />
                                    {errors.classificacao && (
                                        <div className="invalid-feedback">
                                            {errors.classificacao}
                                        </div>
                                    )}
                                </div>

                                {/* Duração */}
                                <div className="mb-3">
                                    <label className="form-label">Duração (minutos)</label>
                                    <input
                                        type="number"
                                        name="duracaoMin"
                                        className={`form-control ${
                                            errors.duracaoMin ? 'is-invalid' : ''
                                        }`}
                                        value={form.duracaoMin || ''}
                                        onChange={handleChange}
                                        min={1}
                                    />
                                    {errors.duracaoMin && (
                                        <div className="invalid-feedback">
                                            {errors.duracaoMin}
                                        </div>
                                    )}
                                </div>

                                {/* Datas */}
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Data início</label>
                                        <input
                                            type="date"
                                            name="dataInicio"
                                            className={`form-control ${
                                                errors.dataInicio ? 'is-invalid' : ''
                                            }`}
                                            value={form.dataInicio}
                                            onChange={handleChange}
                                        />
                                        {errors.dataInicio && (
                                            <div className="invalid-feedback">
                                                {errors.dataInicio}
                                            </div>
                                        )}
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Data fim</label>
                                        <input
                                            type="date"
                                            name="dataFim"
                                            className={`form-control ${
                                                errors.dataFim ? 'is-invalid' : ''
                                            }`}
                                            value={form.dataFim}
                                            onChange={handleChange}
                                        />
                                        {errors.dataFim && (
                                            <div className="invalid-feedback">
                                                {errors.dataFim}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Sinopse */}
                                <div className="mb-3">
                                    <label className="form-label">Sinopse</label>
                                    <textarea
                                        name="sinopse"
                                        rows={3}
                                        className={`form-control ${
                                            errors.sinopse ? 'is-invalid' : ''
                                        }`}
                                        value={form.sinopse}
                                        onChange={handleChange}
                                    />
                                    {errors.sinopse && (
                                        <div className="invalid-feedback">{errors.sinopse}</div>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-primary w-100"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting
                                        ? 'Salvando...'
                                        : editingId
                                            ? 'Salvar alterações'
                                            : 'Salvar Filme'}
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

                {/* Listagem */}
                <div className="col-lg-7">
                    <h2 className="h4 mb-3">Filmes cadastrados</h2>

                    {filmes.length === 0 && <p>Nenhum filme cadastrado ainda.</p>}

                    <div className="row row-cols-1 row-cols-md-2 g-3">
                        {filmes.map((filme) => (
                            <div key={filme.id} className="col">
                                <div className="card h-100">
                                    <div className="card-body d-flex flex-column">
                                        <div className="d-flex justify-content-between align-items-start mb-2">
                                            <h3 className="h5 mb-0">
                                                <i className="bi bi-film me-2" />
                                                {filme.titulo}
                                            </h3>
                                            <span className="badge text-bg-secondary">
                        {filme.classificacao}
                      </span>
                                        </div>

                                        <p className="mb-1">
                      <span className="cine-movie-chip me-2">
                        {filme.genero}
                      </span>
                                            <span className="text-muted small">
                        {filme.classificacao} • {filme.duracaoMin} min
                      </span>
                                        </p>

                                        <p className="card-text flex-grow-1">
                                            {filme.sinopse}
                                        </p>

                                        <div className="d-flex justify-content-between mt-2">
                                            <button
                                                type="button"
                                                className="btn btn-outline-primary btn-sm"
                                                onClick={() => preencherFormParaEdicao(filme)}
                                            >
                                                <i className="bi bi-pencil-square me-1" />
                                                Editar
                                            </button>

                                            <button
                                                type="button"
                                                className="btn btn-outline-danger btn-sm align-self-end"
                                                onClick={() => handleDelete(filme.id)}
                                            >
                                                <i className="bi bi-trash me-1" />
                                                Excluir
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

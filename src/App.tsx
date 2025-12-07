import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import { FilmesPage } from './pages/filmes/FilmesPage';
import SalasPage from './pages/salas/SalasPage';
import SessoesPage from './pages/sessoes/SessoesPage';
import HomePage from './pages/HomePage';
import VenderIngressoPage from './pages/ingressos/VenderIngressoPage';

export default function App() {
    return (
        <Routes>
            <Route path="/" element={<MainLayout />}>
                <Route index element={<HomePage />} />
                <Route path="filmes" element={<FilmesPage />} />
                <Route path="salas" element={<SalasPage />} />
                <Route path="sessoes" element={<SessoesPage />} />
                <Route path="sessoes/:sessaoId/ingressos" element={<VenderIngressoPage />} />
            </Route>
        </Routes>
    );
}

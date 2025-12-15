import type { FC } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { Footer } from './Footer';

const MainLayout: FC = () => {
    return (
        <div className="d-flex flex-column min-vh-100">
            <nav className="navbar navbar-expand-lg cine-navbar mb-4">
                <div className="container">
                    <Link className="navbar-brand" to="/">
                        CineGestor
                    </Link>

                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#mainNavbar"
                    >
                        <span className="navbar-toggler-icon" />
                    </button>

                    <div className="collapse navbar-collapse" id="mainNavbar">
                        <ul className="navbar-nav me-auto">
                            <li className="nav-item">
                                <NavLink end to="/" className="nav-link">
                                    Início
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink to="/filmes" className="nav-link">
                                    Filmes
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink to="/salas" className="nav-link">
                                    Salas
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink to="/sessoes" className="nav-link">
                                    Sessões
                                </NavLink>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

            <main className="container mb-5 cine-main flex-grow-1">
                <Outlet />
            </main>

            <Footer />
        </div>
    );
};

export default MainLayout;

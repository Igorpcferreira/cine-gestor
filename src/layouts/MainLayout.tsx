import type { FC } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';

const MainLayout: FC = () => {
    return (
        <>
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

            <main className="container mb-5 cine-main">
                <Outlet />
            </main>
        </>
    );
};

export default MainLayout;

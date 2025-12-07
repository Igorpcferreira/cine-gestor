import type {ReactNode} from 'react';
import { NavLink } from 'react-router-dom';

type DefaultLayoutProps = {
    children: ReactNode;
};

export function DefaultLayout({ children }: DefaultLayoutProps) {
    return (
        <div>
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
                <div className="container-fluid">
          <span className="navbar-brand">
            <i className="bi bi-film me-2" />
            CineGestor
          </span>

                    <div className="collapse navbar-collapse show">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
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

            <main className="container">{children}</main>
        </div>
    );
}

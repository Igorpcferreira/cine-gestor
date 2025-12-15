export function Footer() {
    return (
        <footer
            style={{
                // Fundo semi-transparente por cima do gradiente da página
                background: 'rgba(5, 10, 25, 0.92)',
                backdropFilter: 'blur(6px)',
                borderTop: '1px solid rgba(148, 163, 184, 0.2)',
                padding: '24px 0',
                // sem margem para não criar aquela faixa entre conteúdo e footer
                marginTop: 0,
                color: '#e4e4e4',
            }}
        >
            <div className="container d-flex justify-content-between flex-wrap align-items-start">
                {/* ESQUERDA */}
                <div style={{ maxWidth: '500px' }}>
                    <h4 style={{ color: '#ffffff', fontWeight: 600 }}>CineGestor</h4>

                    <p style={{ fontSize: '1rem', marginBottom: '6px' }}>
                        Desenvolvido com <span style={{ color: '#ff5f80' }}>♡</span> e café por{' '}
                        <a
                            href="https://www.linkedin.com/in/igor-cferreira"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                color: '#4da3ff',
                                fontWeight: 600,
                                textDecoration: 'none',
                            }}
                        >
                            Igor Ferreira
                        </a>
                    </p>

                    <small style={{ opacity: 0.7 }}>
                        Copyright © {new Date().getFullYear()} — Todos os direitos reservados
                    </small>
                </div>

                {/* DIREITA */}
                <div className="text-end mt-4 mt-md-0">
                    <h6 style={{ color: '#ffffff', fontWeight: 600 }}>Legal</h6>

                    <a
                        href="#"
                        style={{
                            display: 'block',
                            color: '#7db2ff',
                            textDecoration: 'none',
                            marginTop: '4px',
                        }}
                    >
                        Termos de uso
                    </a>

                    <a
                        href="#"
                        style={{
                            display: 'block',
                            color: '#7db2ff',
                            textDecoration: 'none',
                            marginTop: '4px',
                        }}
                    >
                        Política de privacidade
                    </a>
                </div>
            </div>
        </footer>
    );
}

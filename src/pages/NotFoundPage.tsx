import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="page">
      <h1>Página não encontrada</h1>
      <p style={{ color: "var(--muted)" }}>A rota que você tentou acessar não existe.</p>
      <Link className="button" to="/">Voltar para o início</Link>
    </div>
  );
}


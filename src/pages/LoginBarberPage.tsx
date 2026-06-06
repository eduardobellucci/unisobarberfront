import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function LoginBarberPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("admin@unisobarber.com");
  const [password, setPassword] = useState("123456");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setLoading(true);
    const response = await login(email, password);
    setLoading(false);
    if (response.ok) {
      navigate("/painel");
    } else {
      setError(response.message ?? "Credenciais inválidas.");
    }
  };

  return (
    <div className="page">
      <header className="topbar">
        <div>
          <h1>Acesso Barbeiro</h1>
          <p style={{ margin: "4px 0", color: "var(--muted)" }}>Área exclusiva para administração</p>
        </div>
      </header>

      <form className="card stack" onSubmit={handleSubmit}>
        <label className="stack" style={{ gap: 6 }}>
          <span>Email</span>
          <input
            className="input"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </label>
        <label className="stack" style={{ gap: 6 }}>
          <span>Senha</span>
          <input
            className="input"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </label>
        {error && <p style={{ color: "var(--danger)", margin: 0 }}>{error}</p>}
        <button className="button" type="submit" disabled={loading}>
          {loading ? "Entrando..." : "Entrar"}
        </button>
        <small style={{ color: "var(--muted)" }}>
          Dica: admin@unisobarber.com | 123456
        </small>
      </form>
    </div>
  );
}


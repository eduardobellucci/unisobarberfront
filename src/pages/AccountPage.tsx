import { useNavigate } from "react-router-dom";
import { clientProfile } from "../data/client";
import { useSettings } from "../hooks/useSettings";

export default function AccountPage() {
  const { settings } = useSettings();
  const navigate = useNavigate();

  return (
    <div className="page">
      <header className="topbar">
        <div>
          <h1>Conta</h1>
          <p style={{ margin: "4px 0", color: "var(--muted)" }}>Seus dados e preferências</p>
        </div>
      </header>

      <div className="card">
        <h2 style={{ margin: 0 }}>{clientProfile.name}</h2>
        <p style={{ color: "var(--muted)", margin: "6px 0" }}>Bem-vindo à {settings.name}</p>
        <p style={{ color: "var(--muted)", margin: "6px 0" }}>{clientProfile.email}</p>
        <span className="badge">{clientProfile.memberSince}</span>
      </div>

      <div className="section-title">Sobre</div>
      <div className="card">
        <p style={{ margin: 0, color: "var(--muted)" }}>{settings.aboutText}</p>
      </div>

      <div className="section-title">Contato</div>
      <div className="stack">
        <div className="card">
          <strong>Endereço</strong>
          <p style={{ margin: "6px 0", color: "var(--muted)" }}>{settings.address}</p>
        </div>
        <div className="card">
          <strong>Telefone</strong>
          <p style={{ margin: "6px 0", color: "var(--muted)" }}>{settings.phone}</p>
        </div>
        <div className="card">
          <strong>Instagram</strong>
          <p style={{ margin: "6px 0", color: "var(--muted)" }}>{settings.instagram}</p>
        </div>
        <div className="card">
          <strong>Facebook</strong>
          <p style={{ margin: "6px 0", color: "var(--muted)" }}>{settings.facebook}</p>
        </div>
      </div>

      <div style={{ marginTop: 24 }}>
        <button className="button" onClick={() => navigate("/login-barbeiro")}>Acesso Barbeiro</button>
      </div>
    </div>
  );
}


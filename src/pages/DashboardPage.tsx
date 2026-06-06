import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { dashboardService, type DashboardSummary } from "../services/dashboardService";

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [summary, setSummary] = useState<DashboardSummary>({ barbers: 0, services: 0, appointments: 0 });

  useEffect(() => {
    dashboardService.summary().then((response) => {
      if (response.ok && response.data) {
        setSummary(response.data);
      }
    });
  }, []);

  const actions = [
    { label: "Gerenciar Barbeiros", path: "/painel/barbeiros" },
    { label: "Gerenciar Serviços", path: "/painel/servicos" },
    { label: "Gerenciar Horários", path: "/painel/horarios" },
    { label: "Ver Agendamentos", path: "/painel/agendamentos" },
    { label: "Personalizar App", path: "/painel/personalizacao" },
  ];

  return (
    <div className="page page--admin">
      <header className="topbar">
        <div>
          <h1>Olá, {user?.name ?? "Administrador"}</h1>
          <p style={{ margin: "4px 0", color: "var(--muted)" }}>Painel da UnisoBarber</p>
        </div>
      </header>

      <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))" }}>
        <div className="card">
          <strong>{summary.barbers}</strong>
          <p style={{ margin: "6px 0", color: "var(--muted)" }}>Barbeiros</p>
        </div>
        <div className="card">
          <strong>{summary.services}</strong>
          <p style={{ margin: "6px 0", color: "var(--muted)" }}>Serviços</p>
        </div>
        <div className="card">
          <strong>{summary.appointments}</strong>
          <p style={{ margin: "6px 0", color: "var(--muted)" }}>Agendamentos</p>
        </div>
      </div>

      <div className="section-title">Ações rápidas</div>
      <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))" }}>
        {actions.map((action) => (
          <button
            key={action.label}
            className="card"
            style={{ textAlign: "left" }}
            onClick={() => navigate(action.path)}
          >
            <strong>{action.label}</strong>
            <p style={{ margin: "6px 0", color: "var(--muted)" }}>Acessar</p>
          </button>
        ))}
      </div>
    </div>
  );
}


import { NavLink } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const links = [
  { label: "Painel", path: "/painel" },
  { label: "Barbeiros", path: "/painel/barbeiros" },
  { label: "Serviços", path: "/painel/servicos" },
  { label: "Horários", path: "/painel/horarios" },
  { label: "Agendamentos", path: "/painel/agendamentos" },
  { label: "Personalização", path: "/painel/personalizacao" },
];

export function AdminNav() {
  const { logout } = useAuth();

  return (
    <div style={{ padding: "16px 16px 0" }}>
      <div className="row-between" style={{ alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <nav className="admin-nav">
          {links.map((link) => (
            <NavLink key={link.path} to={link.path} end={link.path === "/painel"}>
              {link.label}
            </NavLink>
          ))}
        </nav>
        <button className="button-secondary" onClick={logout}>Sair</button>
      </div>
    </div>
  );
}


import { CalendarDays, Star, UserRound, Wand2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { BarberCard } from "../components/BarberCard";
import { barbersService } from "../services/barbersService";
import type { Barber } from "../types";
import { useSettings } from "../hooks/useSettings";

const shortcuts = [
  { label: "Agendar", icon: CalendarDays, path: "/barbeiros" },
  { label: "Barbeiros", icon: UserRound, path: "/barbeiros" },
  { label: "Horários", icon: Wand2, path: "/agendamentos" },
  { label: "Avaliações", icon: Star, path: "/barbeiros" },
];

export default function HomePage() {
  const navigate = useNavigate();
  const { settings } = useSettings();
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    barbersService.list().then((response) => {
      if (response.ok && response.data) {
        setBarbers(response.data);
      }
    });
  }, []);

  const featured = useMemo(() => {
    return [...barbers].sort((a, b) => b.rating - a.rating).slice(0, 3);
  }, [barbers]);

  const handleSearch = (event: FormEvent) => {
    event.preventDefault();
    const query = search.trim();
    navigate(query ? `/barbeiros?search=${encodeURIComponent(query)}` : "/barbeiros");
  };

  return (
    <div className="page">
      <header className="topbar">
        <div>
          <h1>Bem-vindo de volta</h1>
          <p style={{ margin: "4px 0", color: "var(--muted)" }}>{settings.welcomeText}</p>
        </div>
      </header>

      <form onSubmit={handleSearch} className="stack">
        <input
          className="input"
          placeholder="Buscar barbeiro ou especialidade"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <div
          className="banner"
          style={{
            backgroundImage: `linear-gradient(120deg, rgba(59, 130, 246, 0.9), rgba(14, 116, 144, 0.9)), url(${settings.bannerUrl})`,
          }}
        >
          <strong>Agende seu próximo corte sem filas</strong>
          <span>Escolha o barbeiro e o horário perfeito para você.</span>
          <button type="button" className="button" onClick={() => navigate("/barbeiros")}>
            Agendar agora
          </button>
        </div>
      </form>

      <div className="section-title">Atalhos rápidos</div>
      <div className="shortcut-grid">
        {shortcuts.map((shortcut) => (
          <button
            key={shortcut.label}
            className="shortcut-item"
            type="button"
            onClick={() => navigate(shortcut.path)}
          >
            <shortcut.icon size={20} />
            {shortcut.label}
          </button>
        ))}
      </div>

      <div className="section-title">Barbeiros em destaque</div>
      <div className="stack">
        {featured.map((barber) => (
          <BarberCard key={barber.id} barber={barber} />
        ))}
        {!featured.length && <p style={{ color: "var(--muted)" }}>Carregando barbeiros...</p>}
      </div>
    </div>
  );
}


import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { BarberCard } from "../components/BarberCard";
import { barbersService } from "../services/barbersService";
import type { Barber } from "../types";

export default function BarbersPage() {
  const [params] = useSearchParams();
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [search, setSearch] = useState(params.get("search") ?? "");
  const [category, setCategory] = useState(params.get("category") ?? "Todos");

  useEffect(() => {
    barbersService.list().then((response) => {
      if (response.ok && response.data) {
        setBarbers(response.data);
      }
    });
  }, []);

  useEffect(() => {
    setSearch(params.get("search") ?? "");
    setCategory(params.get("category") ?? "Todos");
  }, [params]);

  const categories = useMemo(() => {
    const set = new Set<string>();
    barbers.forEach((barber) => barber.specialties.forEach((spec) => set.add(spec)));
    const base = ["Degradê", "Barba", "Pigmentação", "Corte Social"];
    base.forEach((item) => set.add(item));
    return ["Todos", ...Array.from(set)];
  }, [barbers]);

  const filtered = useMemo(() => {
    return barbers.filter((barber) => {
      const searchLower = search.toLowerCase();
      const matchesSearch =
        !searchLower ||
        barber.name.toLowerCase().includes(searchLower) ||
        barber.specialties.some((spec) => spec.toLowerCase().includes(searchLower));
      const matchesCategory = category === "Todos" || barber.specialties.includes(category);
      return matchesSearch && matchesCategory;
    });
  }, [barbers, search, category]);

  return (
    <div className="page">
      <header className="topbar">
        <div>
          <h1>Barbeiros</h1>
          <p style={{ margin: "4px 0", color: "var(--muted)" }}>Escolha seu profissional ideal</p>
        </div>
      </header>

      <div className="stack">
        <input
          className="input"
          placeholder="Buscar por nome ou especialidade"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />

        <div className="chip-group">
          {categories.map((item) => (
            <button
              key={item}
              type="button"
              className={`chip ${item === category ? "active" : ""}`}
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="section-title">Lista completa</div>
      <div className="stack">
        {filtered.map((barber) => (
          <BarberCard key={barber.id} barber={barber} />
        ))}
        {!filtered.length && <p style={{ color: "var(--muted)" }}>Nenhum barbeiro encontrado.</p>}
      </div>
    </div>
  );
}


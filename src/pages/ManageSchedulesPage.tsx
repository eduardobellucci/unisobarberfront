import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { barbersService } from "../services/barbersService";
import { schedulesService } from "../services/schedulesService";
import type { Barber, ScheduleSlot } from "../types";
import { formatFullDate } from "../utils/date";

export default function ManageSchedulesPage() {
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [schedules, setSchedules] = useState<ScheduleSlot[]>([]);
  const [barberId, setBarberId] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [error, setError] = useState<string | null>(null);

  const loadData = () => {
    barbersService.list().then((response) => {
      if (response.ok && response.data) {
        setBarbers(response.data);
      }
    });
    schedulesService.list().then((response) => {
      if (response.ok && response.data) {
        setSchedules(response.data);
      }
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  const grouped = useMemo(() => {
    return barbers.map((barber) => ({
      barber,
      slots: schedules.filter((slot) => slot.barberId === barber.id),
    }));
  }, [barbers, schedules]);

  const handleAdd = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    if (!barberId || !date || !time) {
      setError("Preencha barbeiro, data e horário.");
      return;
    }

    const exists = schedules.some((slot) => slot.barberId === barberId && slot.date === date && slot.time === time);
    if (exists) {
      setError("Esse horário já existe para o barbeiro.");
      return;
    }

    const response = await schedulesService.create({ barberId, date, time });
    if (response.ok && response.data) {
      setSchedules((prev) => [...prev, response.data!]);
      setDate("");
      setTime("");
    }
  };

  const handleRemove = async (id: string) => {
    await schedulesService.remove(id);
    setSchedules((prev) => prev.filter((slot) => slot.id !== id));
  };

  return (
    <div className="page page--admin">
      <header className="topbar">
        <div>
          <h1>Gerenciar Horários</h1>
          <p style={{ margin: "4px 0", color: "var(--muted)" }}>Disponibilidade por barbeiro</p>
        </div>
      </header>

      <form className="card stack" onSubmit={handleAdd}>
        <div className="row" style={{ gap: 12, flexWrap: "wrap" }}>
          <label className="stack" style={{ flex: 1, minWidth: 180 }}>
            <span>Barbeiro</span>
            <select className="select" value={barberId} onChange={(e) => setBarberId(e.target.value)}>
              <option value="">Selecione</option>
              {barbers.map((barber) => (
                <option key={barber.id} value={barber.id}>
                  {barber.name}
                </option>
              ))}
            </select>
          </label>
          <label className="stack" style={{ flex: 1, minWidth: 160 }}>
            <span>Data</span>
            <input className="input" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </label>
          <label className="stack" style={{ flex: 1, minWidth: 140 }}>
            <span>Horário</span>
            <input className="input" type="time" value={time} onChange={(e) => setTime(e.target.value)} />
          </label>
        </div>
        {error && <p style={{ color: "var(--danger)", margin: 0 }}>{error}</p>}
        <button className="button" type="submit">
          Adicionar horário
        </button>
      </form>

      <div className="section-title">Horários cadastrados</div>
      <div className="stack">
        {grouped.map(({ barber, slots }) => (
          <div key={barber.id} className="card">
            <strong>{barber.name}</strong>
            {slots.length === 0 && <p style={{ color: "var(--muted)" }}>Sem horários cadastrados.</p>}
            <div className="stack" style={{ marginTop: 12 }}>
              {slots.map((slot) => (
                <div key={slot.id} className="row-between">
                  <span className="badge">{formatFullDate(slot.date)} • {slot.time}</span>
                  <button className="button-secondary" onClick={() => handleRemove(slot.id)}>
                    Remover
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
        {!barbers.length && <p style={{ color: "var(--muted)" }}>Nenhum barbeiro cadastrado.</p>}
      </div>
    </div>
  );
}


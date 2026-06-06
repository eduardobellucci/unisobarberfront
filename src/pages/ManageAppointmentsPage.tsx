import { useCallback, useEffect, useMemo, useState } from "react";
import { appointmentsService } from "../services/appointmentsService";
import { barbersService } from "../services/barbersService";
import { servicesService } from "../services/servicesService";
import type { Appointment, AppointmentStatus, Barber, Service } from "../types";
import { formatFullDate } from "../utils/date";

const statuses: AppointmentStatus[] = ["Confirmado", "Cancelado", "Concluído"];

export default function ManageAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [filterBarber, setFilterBarber] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const loadAppointments = useCallback(() => {
    appointmentsService.list().then((response) => {
      if (response.ok && response.data) {
        setAppointments([...response.data].reverse());
      }
    });
  }, []);

  useEffect(() => {
    loadAppointments();
    barbersService.list().then((response) => {
      if (response.ok && response.data) {
        setBarbers(response.data);
      }
    });
    servicesService.list().then((response) => {
      if (response.ok && response.data) {
        setServices(response.data);
      }
    });
  }, [loadAppointments]);

  useEffect(() => {
    const refreshInterval = window.setInterval(loadAppointments, 5000);
    const onFocus = () => loadAppointments();

    window.addEventListener("focus", onFocus);

    return () => {
      window.clearInterval(refreshInterval);
      window.removeEventListener("focus", onFocus);
    };
  }, [loadAppointments]);

  const filtered = useMemo(() => {
    return appointments.filter((appointment) => {
      const matchesBarber = !filterBarber || appointment.barberId === filterBarber;
      const matchesStatus = !filterStatus || appointment.status === filterStatus;
      return matchesBarber && matchesStatus;
    });
  }, [appointments, filterBarber, filterStatus]);

  const handleStatusChange = async (appointmentId: string, status: AppointmentStatus) => {
    const response = await appointmentsService.updateStatus(appointmentId, status);
    if (response.ok && response.data) {
      setAppointments((prev) => prev.map((item) => (item.id === appointmentId ? response.data! : item)));
    }
  };

  return (
    <div className="page page--admin">
      <header className="topbar">
        <div>
          <h1>Ver Agendamentos</h1>
          <p style={{ margin: "4px 0", color: "var(--muted)" }}>Controle geral de reservas</p>
        </div>
      </header>

      <div className="card stack">
        <div className="row" style={{ gap: 12, flexWrap: "wrap" }}>
          <label className="stack" style={{ flex: 1, minWidth: 200 }}>
            <span>Barbeiro</span>
            <select className="select" value={filterBarber} onChange={(e) => setFilterBarber(e.target.value)}>
              <option value="">Todos</option>
              {barbers.map((barber) => (
                <option key={barber.id} value={barber.id}>
                  {barber.name}
                </option>
              ))}
            </select>
          </label>
          <label className="stack" style={{ flex: 1, minWidth: 200 }}>
            <span>Status</span>
            <select className="select" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="">Todos</option>
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className="section-title">Agendamentos</div>
      <div className="stack">
        {filtered.map((appointment) => {
          const barber = barbers.find((item) => item.id === appointment.barberId);
          const service = services.find((item) => item.id === appointment.serviceId);
          return (
            <div key={appointment.id} className="card">
              <div className="row-between">
                <div>
                  <strong>{barber?.name ?? "Barbeiro"}</strong>
                  <p style={{ margin: "6px 0", color: "var(--muted)" }}>{service?.name ?? "Serviço"}</p>
                  <small style={{ color: "var(--muted)" }}>
                    {appointment.clientName} • {formatFullDate(appointment.date)} às {appointment.time}
                  </small>
                </div>
                <select
                  className="select"
                  style={{ maxWidth: 160 }}
                  value={appointment.status}
                  onChange={(e) => handleStatusChange(appointment.id, e.target.value as AppointmentStatus)}
                >
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          );
        })}
        {!filtered.length && <p style={{ color: "var(--muted)" }}>Nenhum agendamento encontrado.</p>}
      </div>
    </div>
  );
}

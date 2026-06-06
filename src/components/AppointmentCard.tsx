import type { Appointment, Barber, Service } from "../types";
import { formatFullDate } from "../utils/date";

function statusClass(status: Appointment["status"]) {
  if (status === "Confirmado") return "confirmado";
  if (status === "Cancelado") return "cancelado";
  return "concluido";
}

export function AppointmentCard({
  appointment,
  barber,
  service,
  onCancel,
}: {
  appointment: Appointment;
  barber?: Barber;
  service?: Service;
  onCancel?: (id: string) => void;
}) {
  const photo = barber?.photo ?? "/placeholder.svg";
  const name = barber?.name ?? "Barbeiro";

  return (
    <div className="card list-card">
      <img src={photo} alt={name} />
      <div style={{ flex: 1 }}>
        <div className="row-between">
          <div>
            <h3>{name}</h3>
            <p>{service?.name ?? "Serviço"}</p>
          </div>
          <span className={`status ${statusClass(appointment.status)}`}>
            {appointment.status}
          </span>
        </div>
        <div className="row" style={{ marginTop: 8, gap: 16, flexWrap: "wrap" }}>
          <span className="badge">{formatFullDate(appointment.date)}</span>
          <span className="badge">{appointment.time}</span>
        </div>
        {onCancel && appointment.status === "Confirmado" && (
          <div style={{ marginTop: 10 }}>
            <button className="button-secondary" onClick={() => onCancel(appointment.id)}>
              Cancelar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}


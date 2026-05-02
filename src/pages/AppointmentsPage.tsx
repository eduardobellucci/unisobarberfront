import { useCallback, useEffect, useMemo, useState } from "react";
import { AppointmentCard } from "../components/AppointmentCard";
import { clientProfile } from "../data/client";
import { appointmentsService } from "../services/appointmentsService";
import { barbersService } from "../services/barbersService";
import { servicesService } from "../services/servicesService";
import type { Appointment, Barber, Service } from "../types";
import { isUpcoming } from "../utils/date";

type AppointmentIdentityFields = Appointment & Partial<{
  userId: string;
  clientId: string;
  customerId: string;
  email: string;
  clientEmail: string;
  customerEmail: string;
}>;

const STATUS_CONFIRMADO = "Confirmado";
const STATUS_CANCELADO = "Cancelado";
const STATUS_CONCLUIDO = "Conclu\u00eddo";

function normalize(value?: string) {
  return (value ?? "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export default function AppointmentsPage() {
  const [tab, setTab] = useState<"upcoming" | "past">("upcoming");
  const [hasInitializedTab, setHasInitializedTab] = useState(false);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [services, setServices] = useState<Service[]>([]);

  const currentClientName = normalize(clientProfile.name);
  const currentClientEmail = normalize(clientProfile.email);

  const loadAppointments = useCallback(() => {
    appointmentsService.list().then((response) => {
      if (response.ok && response.data) {
        setAppointments(response.data);
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

  const clientAppointments = useMemo(() => {
    return appointments.filter((appointment) => {
      const entry = appointment as AppointmentIdentityFields;
      const appointmentName = normalize(entry.clientName);
      const appointmentEmail = normalize(entry.email || entry.clientEmail || entry.customerEmail);

      if (currentClientEmail && appointmentEmail) {
        return appointmentEmail === currentClientEmail;
      }

      return appointmentName === currentClientName;
    });
  }, [appointments, currentClientEmail, currentClientName]);

  const upcoming = useMemo(() => {
    return clientAppointments.filter(
      (appointment) => isUpcoming(appointment.date, appointment.time) || appointment.status === STATUS_CONFIRMADO
    );
  }, [clientAppointments]);

  const past = useMemo(() => {
    return clientAppointments.filter(
      (appointment) =>
        appointment.status === STATUS_CANCELADO ||
        appointment.status === STATUS_CONCLUIDO ||
        (!isUpcoming(appointment.date, appointment.time) && appointment.status !== STATUS_CONFIRMADO)
    );
  }, [clientAppointments]);

  useEffect(() => {
    if (hasInitializedTab || !clientAppointments.length) return;
    if (!upcoming.length && past.length) {
      setTab("past");
    }
    setHasInitializedTab(true);
  }, [clientAppointments.length, hasInitializedTab, past.length, upcoming.length]);

  const handleCancel = async (id: string) => {
    const response = await appointmentsService.cancel(id);
    if (response.ok && response.data) {
      setAppointments((prev) => prev.map((item) => (item.id === id ? response.data! : item)));
    }
  };

  const list = tab === "upcoming" ? upcoming : past;

  return (
    <div className="page">
      <header className="topbar">
        <div>
          <h1>Agendamentos</h1>
          <p style={{ margin: "4px 0", color: "var(--muted)" }}>Acompanhe seu hist\u00f3rico</p>
        </div>
      </header>

      <div className="chip-group">
        <button className={`chip ${tab === "upcoming" ? "active" : ""}`} onClick={() => setTab("upcoming")}>
          Pr\u00f3ximos
        </button>
        <button className={`chip ${tab === "past" ? "active" : ""}`} onClick={() => setTab("past")}>
          Anteriores
        </button>
      </div>

      <div className="section-title">{tab === "upcoming" ? "Pr\u00f3ximos agendamentos" : "Hist\u00f3rico"}</div>
      <div className="stack">
        {list.map((appointment) => (
          <AppointmentCard
            key={appointment.id}
            appointment={appointment}
            barber={barbers.find((barber) => barber.id === appointment.barberId)}
            service={services.find((service) => service.id === appointment.serviceId)}
            onCancel={tab === "upcoming" ? handleCancel : undefined}
          />
        ))}
        {!list.length && <p style={{ color: "var(--muted)" }}>Nenhum agendamento encontrado.</p>}
      </div>
    </div>
  );
}

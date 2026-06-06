import { ArrowLeft } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { RatingStars } from "../components/RatingStars";
import { ServiceCard } from "../components/ServiceCard";
import { appointmentsService } from "../services/appointmentsService";
import { barbersService } from "../services/barbersService";
import { schedulesService } from "../services/schedulesService";
import { servicesService } from "../services/servicesService";
import type { Barber, ScheduleSlot, Service } from "../types";
import { formatDateLabel } from "../utils/date";
import { clientProfile } from "../data/client";

export default function BarberProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [barber, setBarber] = useState<Barber | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [schedules, setSchedules] = useState<ScheduleSlot[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<ScheduleSlot | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    barbersService.get(id).then((response) => {
      if (response.ok && response.data) {
        setBarber(response.data);
      }
    });
    servicesService.list(id).then((response) => {
      if (response.ok && response.data) {
        setServices(response.data);
      }
    });
    schedulesService.list(id).then((response) => {
      if (response.ok && response.data) {
        setSchedules(response.data);
      }
    });
  }, [id]);

  const grouped = useMemo(() => {
    const map: Record<string, ScheduleSlot[]> = {};
    schedules.forEach((slot) => {
      if (!map[slot.date]) {
        map[slot.date] = [];
      }
      map[slot.date].push(slot);
    });
    Object.values(map).forEach((slots) => slots.sort((a, b) => a.time.localeCompare(b.time)));
    return map;
  }, [schedules]);

  const availableDates = useMemo(() => Object.keys(grouped).sort(), [grouped]);

  const slotsForDate = selectedDate ? grouped[selectedDate] ?? [] : [];

  const handleConfirm = async () => {
    if (!id || !selectedService || !selectedSlot) return;
    const response = await appointmentsService.create({
      barberId: id,
      serviceId: selectedService.id,
      date: selectedSlot.date,
      time: selectedSlot.time,
      clientName: clientProfile.name,
    });
    if (response.ok) {
      setSchedules((prev) => prev.filter((slot) => slot.id !== selectedSlot.id));
      setMessage("Agendamento confirmado! Você pode acompanhar em Agendamentos.");
      setSelectedService(null);
      setSelectedDate(null);
      setSelectedSlot(null);
      setTimeout(() => navigate("/agendamentos"), 800);
    } else {
      setMessage(response.message ?? "Não foi possível concluir o agendamento.");
    }
  };

  if (!barber) {
    return (
      <div className="page">
        <button className="button-ghost" onClick={() => navigate(-1)}>
          <ArrowLeft size={16} /> Voltar
        </button>
        <p style={{ color: "var(--muted)" }}>Carregando barbeiro...</p>
      </div>
    );
  }

  return (
    <div className="page">
      <button className="button-ghost" onClick={() => navigate(-1)}>
        <ArrowLeft size={16} /> Voltar
      </button>

      <div className="card" style={{ marginTop: 12 }}>
        <div className="row" style={{ alignItems: "flex-start" }}>
          <img
            src={barber.photo}
            alt={barber.name}
            style={{ width: 96, height: 96, borderRadius: 18, objectFit: "cover" }}
          />
          <div style={{ flex: 1 }}>
            <h2 style={{ margin: "0 0 6px" }}>{barber.name}</h2>
            <RatingStars rating={barber.rating} />
            <p style={{ margin: "6px 0", color: "var(--muted)" }}>
              {barber.reviewCount} avaliações • {barber.specialties.join(" • ")}
            </p>
          </div>
        </div>
        <p style={{ marginTop: 12, color: "var(--muted)" }}>{barber.description}</p>
      </div>

      <div className="section-title">Serviços</div>
      <div className="stack">
        {services.map((service) => (
          <ServiceCard
            key={service.id}
            service={service}
            selected={selectedService?.id === service.id}
            onSelect={setSelectedService}
          />
        ))}
        {!services.length && <p style={{ color: "var(--muted)" }}>Nenhum serviço cadastrado.</p>}
      </div>

      <div className="section-title">Datas disponíveis</div>
      <div className="chip-group">
        {availableDates.map((date) => (
          <button
            key={date}
            className={`chip ${selectedDate === date ? "active" : ""}`}
            type="button"
            onClick={() => {
              setSelectedDate(date);
              setSelectedSlot(null);
            }}
          >
            {formatDateLabel(date)}
          </button>
        ))}
        {!availableDates.length && <p style={{ color: "var(--muted)" }}>Sem horários disponíveis.</p>}
      </div>

      {selectedDate && (
        <>
          <div className="section-title">Horários</div>
          <div className="chip-group">
            {slotsForDate.map((slot) => (
              <button
                key={slot.id}
                className={`chip ${selectedSlot?.id === slot.id ? "active" : ""}`}
                type="button"
                onClick={() => setSelectedSlot(slot)}
              >
                {slot.time}
              </button>
            ))}
          </div>
        </>
      )}

      {message && <p style={{ marginTop: 12, color: "var(--primary)" }}>{message}</p>}

      <div style={{ marginTop: 20 }}>
        <button
          className="button"
          disabled={!selectedService || !selectedSlot}
          onClick={handleConfirm}
        >
          Confirmar agendamento
        </button>
      </div>
    </div>
  );
}


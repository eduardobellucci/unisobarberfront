import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { barbersService } from "../services/barbersService";
import { servicesService } from "../services/servicesService";
import type { Barber, Service } from "../types";
import { formatCurrency } from "../utils/date";

const emptyForm = {
  name: "",
  description: "",
  price: "",
  duration: "",
  barberId: "",
};

type ServiceForm = typeof emptyForm;

export default function ManageServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [form, setForm] = useState<ServiceForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadData = () => {
    servicesService.list().then((response) => {
      if (response.ok && response.data) {
        setServices(response.data);
      }
    });
    barbersService.list().then((response) => {
      if (response.ok && response.data) {
        setBarbers(response.data);
      }
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleChange = (field: keyof ServiceForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleEdit = (service: Service) => {
    setEditingId(service.id);
    setForm({
      name: service.name,
      description: service.description,
      price: String(service.price),
      duration: String(service.duration),
      barberId: service.barberId,
    });
  };

  const resetForm = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);

    if (!form.name || !form.description || !form.price || !form.duration || !form.barberId) {
      setError("Preencha todos os campos.");
      return;
    }

    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      duration: Number(form.duration),
      barberId: form.barberId,
    };

    if (editingId) {
      const response = await servicesService.update(editingId, payload);
      if (response.ok) {
        loadData();
        resetForm();
      }
      return;
    }

    const response = await servicesService.create(payload);
    if (response.ok) {
      loadData();
      resetForm();
    }
  };

  const handleRemove = async (id: string) => {
    await servicesService.remove(id);
    loadData();
  };

  return (
    <div className="page page--admin">
      <header className="topbar">
        <div>
          <h1>Gerenciar Serviços</h1>
          <p style={{ margin: "4px 0", color: "var(--muted)" }}>Lista completa de serviços</p>
        </div>
      </header>

      <form className="card stack" onSubmit={handleSubmit}>
        <div className="row" style={{ gap: 12, flexWrap: "wrap" }}>
          <label className="stack" style={{ flex: 1, minWidth: 200 }}>
            <span>Serviço</span>
            <input className="input" value={form.name} onChange={(e) => handleChange("name", e.target.value)} />
          </label>
          <label className="stack" style={{ flex: 1, minWidth: 200 }}>
            <span>Barbeiro</span>
            <select className="select" value={form.barberId} onChange={(e) => handleChange("barberId", e.target.value)}>
              <option value="">Selecione</option>
              {barbers.map((barber) => (
                <option key={barber.id} value={barber.id}>
                  {barber.name}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="stack">
          <span>Descrição</span>
          <textarea className="textarea" value={form.description} onChange={(e) => handleChange("description", e.target.value)} />
        </label>

        <div className="row" style={{ gap: 12, flexWrap: "wrap" }}>
          <label className="stack" style={{ flex: 1, minWidth: 160 }}>
            <span>Preço (R$)</span>
            <input className="input" type="number" value={form.price} onChange={(e) => handleChange("price", e.target.value)} />
          </label>
          <label className="stack" style={{ flex: 1, minWidth: 160 }}>
            <span>Duração (min)</span>
            <input className="input" type="number" value={form.duration} onChange={(e) => handleChange("duration", e.target.value)} />
          </label>
        </div>

        {error && <p style={{ color: "var(--danger)", margin: 0 }}>{error}</p>}

        <div className="row" style={{ gap: 12, flexWrap: "wrap" }}>
          <button className="button" type="submit">
            {editingId ? "Salvar alterações" : "Cadastrar serviço"}
          </button>
          {editingId && (
            <button className="button-secondary" type="button" onClick={resetForm}>
              Cancelar edição
            </button>
          )}
        </div>
      </form>

      <div className="section-title">Serviços cadastrados</div>
      <div className="stack">
        {services.map((service) => (
          <div key={service.id} className="card">
            <div className="row-between">
              <div>
                <strong>{service.name}</strong>
                <p style={{ margin: "6px 0", color: "var(--muted)" }}>{service.description}</p>
                <small style={{ color: "var(--muted)" }}>
                  {barbers.find((barber) => barber.id === service.barberId)?.name ?? "Sem barbeiro"}
                </small>
              </div>
              <div style={{ textAlign: "right" }}>
                <strong>{formatCurrency(service.price)}</strong>
                <p style={{ margin: "6px 0", color: "var(--muted)" }}>{service.duration} min</p>
                <div className="row" style={{ justifyContent: "flex-end", gap: 8 }}>
                  <button className="button-secondary" onClick={() => handleEdit(service)}>
                    Editar
                  </button>
                  <button className="button-secondary" onClick={() => handleRemove(service.id)}>
                    Remover
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
        {!services.length && <p style={{ color: "var(--muted)" }}>Nenhum serviço cadastrado.</p>}
      </div>
    </div>
  );
}


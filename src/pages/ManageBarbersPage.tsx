import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { barbersService } from "../services/barbersService";
import type { Barber } from "../types";

const emptyForm = {
  name: "",
  photo: "",
  description: "",
  specialties: "",
  rating: "4.5",
  reviewCount: "0",
};

type BarberForm = typeof emptyForm;

export default function ManageBarbersPage() {
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [form, setForm] = useState<BarberForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadBarbers = () => {
    barbersService.list().then((response) => {
      if (response.ok && response.data) {
        setBarbers(response.data);
      }
    });
  };

  useEffect(() => {
    loadBarbers();
  }, []);

  const handleChange = (field: keyof BarberForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleEdit = (barber: Barber) => {
    setEditingId(barber.id);
    setForm({
      name: barber.name,
      photo: barber.photo,
      description: barber.description,
      specialties: barber.specialties.join(", "),
      rating: String(barber.rating),
      reviewCount: String(barber.reviewCount),
    });
  };

  const resetForm = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);

    if (!form.name || !form.photo || !form.description || !form.specialties) {
      setError("Preencha nome, foto, descrição e especialidades.");
      return;
    }

    const payload = {
      name: form.name.trim(),
      photo: form.photo.trim(),
      description: form.description.trim(),
      specialties: form.specialties.split(",").map((item) => item.trim()).filter(Boolean),
      rating: Number(form.rating),
      reviewCount: Number(form.reviewCount),
    };

    if (editingId) {
      const response = await barbersService.update(editingId, payload);
      if (response.ok) {
        loadBarbers();
        resetForm();
      }
      return;
    }

    const response = await barbersService.create(payload);
    if (response.ok) {
      loadBarbers();
      resetForm();
    }
  };

  const handleRemove = async (id: string) => {
    await barbersService.remove(id);
    loadBarbers();
  };

  return (
    <div className="page page--admin">
      <header className="topbar">
        <div>
          <h1>Gerenciar Barbeiros</h1>
          <p style={{ margin: "4px 0", color: "var(--muted)" }}>Cadastros da equipe</p>
        </div>
      </header>

      <form className="card stack" onSubmit={handleSubmit}>
        <div className="row" style={{ gap: 12, flexWrap: "wrap" }}>
          <label className="stack" style={{ flex: 1, minWidth: 220 }}>
            <span>Nome</span>
            <input className="input" value={form.name} onChange={(e) => handleChange("name", e.target.value)} />
          </label>
          <label className="stack" style={{ flex: 1, minWidth: 220 }}>
            <span>Foto (URL)</span>
            <input className="input" value={form.photo} onChange={(e) => handleChange("photo", e.target.value)} />
          </label>
        </div>

        <label className="stack">
          <span>Descrição</span>
          <textarea className="textarea" value={form.description} onChange={(e) => handleChange("description", e.target.value)} />
        </label>

        <label className="stack">
          <span>Especialidades (separadas por vírgula)</span>
          <input
            className="input"
            value={form.specialties}
            onChange={(e) => handleChange("specialties", e.target.value)}
          />
        </label>

        <div className="row" style={{ gap: 12, flexWrap: "wrap" }}>
          <label className="stack" style={{ flex: 1, minWidth: 160 }}>
            <span>Nota média</span>
            <input
              className="input"
              type="number"
              step="0.1"
              value={form.rating}
              onChange={(e) => handleChange("rating", e.target.value)}
            />
          </label>
          <label className="stack" style={{ flex: 1, minWidth: 160 }}>
            <span>Qtd. avaliações</span>
            <input
              className="input"
              type="number"
              value={form.reviewCount}
              onChange={(e) => handleChange("reviewCount", e.target.value)}
            />
          </label>
        </div>

        {error && <p style={{ color: "var(--danger)", margin: 0 }}>{error}</p>}

        <div className="row" style={{ gap: 12, flexWrap: "wrap" }}>
          <button className="button" type="submit">
            {editingId ? "Salvar alterações" : "Cadastrar barbeiro"}
          </button>
          {editingId && (
            <button className="button-secondary" type="button" onClick={resetForm}>
              Cancelar edição
            </button>
          )}
        </div>
      </form>

      <div className="section-title">Lista de barbeiros</div>
      <div className="stack">
        {barbers.map((barber) => (
          <div key={barber.id} className="card list-card">
            <img src={barber.photo} alt={barber.name} />
            <div style={{ flex: 1 }}>
              <strong>{barber.name}</strong>
              <p>{barber.specialties.join(" • ")}</p>
            </div>
            <div className="row" style={{ gap: 8 }}>
              <button className="button-secondary" onClick={() => handleEdit(barber)}>
                Editar
              </button>
              <button className="button-secondary" onClick={() => handleRemove(barber.id)}>
                Remover
              </button>
            </div>
          </div>
        ))}
        {!barbers.length && <p style={{ color: "var(--muted)" }}>Nenhum barbeiro cadastrado.</p>}
      </div>
    </div>
  );
}


import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useSettings } from "../hooks/useSettings";
import { settingsService } from "../services/settingsService";
import type { AppSettings } from "../types";

export default function CustomizeAppPage() {
  const { settings, update } = useSettings();
  const [form, setForm] = useState<AppSettings>(settings);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    setForm(settings);
  }, [settings]);

  const handleChange = (field: keyof AppSettings, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setMessage(null);
    const response = await settingsService.update(form);
    if (response.ok && response.data) {
      update(response.data);
      setMessage("Configurações salvas com sucesso.");
    } else {
      setMessage(response.message ?? "Não foi possível salvar.");
    }
  };

  return (
    <div className="page page--admin">
      <header className="topbar">
        <div>
          <h1>Personalizar App</h1>
          <p style={{ margin: "4px 0", color: "var(--muted)" }}>Ajustes visuais e contatos</p>
        </div>
      </header>

      <form className="card stack" onSubmit={handleSubmit}>
        <label className="stack">
          <span>Nome da barbearia</span>
          <input className="input" value={form.name} onChange={(e) => handleChange("name", e.target.value)} />
        </label>
        <label className="stack">
          <span>Texto de boas-vindas</span>
          <input className="input" value={form.welcomeText} onChange={(e) => handleChange("welcomeText", e.target.value)} />
        </label>
        <label className="stack">
          <span>Telefone</span>
          <input className="input" value={form.phone} onChange={(e) => handleChange("phone", e.target.value)} />
        </label>
        <label className="stack">
          <span>Endereço</span>
          <input className="input" value={form.address} onChange={(e) => handleChange("address", e.target.value)} />
        </label>
        <label className="stack">
          <span>Instagram</span>
          <input className="input" value={form.instagram} onChange={(e) => handleChange("instagram", e.target.value)} />
        </label>
        <label className="stack">
          <span>Facebook</span>
          <input className="input" value={form.facebook} onChange={(e) => handleChange("facebook", e.target.value)} />
        </label>
        <label className="stack">
          <span>URL do banner</span>
          <input className="input" value={form.bannerUrl} onChange={(e) => handleChange("bannerUrl", e.target.value)} />
        </label>
        <label className="stack">
          <span>Texto da seção Sobre</span>
          <textarea className="textarea" value={form.aboutText} onChange={(e) => handleChange("aboutText", e.target.value)} />
        </label>
        {message && <p style={{ color: "var(--primary)", margin: 0 }}>{message}</p>}
        <button className="button" type="submit">Salvar personalização</button>
      </form>
    </div>
  );
}


import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { settingsService } from "../services/settingsService";
import type { AppSettings } from "../types";

const STORAGE_KEY = "unisobarber_settings";

const defaultSettings: AppSettings = {
  id: "settings",
  name: "UnisoBarber",
  welcomeText: "Seu corte com horário marcado e sem fila.",
  phone: "(11) 93245-7788",
  address: "Rua das Acácias, 45 - Sorocaba/SP",
  instagram: "@unisobarber",
  facebook: "/unisobarber",
  bannerUrl:
    "https://images.unsplash.com/photo-1517832207067-4db24a2ae47c?auto=format&fit=crop&w=1200&q=80",
  aboutText:
    "A UnisoBarber é uma barbearia moderna, com foco em atendimento pontual e cortes alinhados ao seu estilo.",
};

type SettingsContextValue = {
  settings: AppSettings;
  refresh: () => Promise<void>;
  update: (next: AppSettings) => void;
};

const SettingsContext = createContext<SettingsContextValue | undefined>(undefined);

function readStoredSettings(): AppSettings | null {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  if (raw.includes("�")) return null;
  try {
    return JSON.parse(raw) as AppSettings;
  } catch {
    return null;
  }
}

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(() => readStoredSettings() ?? defaultSettings);

  const refresh = useCallback(async () => {
    const response = await settingsService.get();
    if (response.ok && response.data) {
      setSettings(response.data);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(response.data));
    }
  }, []);

  const update = useCallback((next: AppSettings) => {
    setSettings(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const value = useMemo(() => ({ settings, refresh, update }), [settings, refresh, update]);

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within SettingsProvider");
  }
  return context;
}


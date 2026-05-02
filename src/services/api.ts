const API_URL = import.meta.env.VITE_API_URL?.trim().replace(/\/+$/, "") ?? "";

type RequestOptions = RequestInit & {
  body?: unknown;
};

function normalizeErrorMessage(error: unknown) {
  if (error instanceof TypeError && error.message.includes("Failed to fetch")) {
    return "Nao foi possivel conectar a API. Verifique se VITE_API_URL esta configurada corretamente e se o backend esta acessivel.";
  }
  return error instanceof Error ? error.message : "Erro inesperado";
}

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {},
): Promise<{ ok: boolean; data?: T; message?: string }> {
  try {
    if (!API_URL) {
      return { ok: false, message: "VITE_API_URL nao configurada." };
    }

    const endpoint = path.startsWith("/") ? path : `/${path}`;
    const response = await fetch(`${API_URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...(options.headers ?? {}),
      },
      ...options,
      body: options.body ? JSON.stringify(options.body) : undefined,
    });

    const text = await response.text();
    const data = text ? (JSON.parse(text) as T) : undefined;

    if (!response.ok) {
      return {
        ok: false,
        message: (data as { message?: string })?.message ?? "Erro na requisicao",
      };
    }

    return { ok: true, data };
  } catch (error) {
    return { ok: false, message: normalizeErrorMessage(error) };
  }
}

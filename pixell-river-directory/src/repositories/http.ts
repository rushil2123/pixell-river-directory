// src/repositories/http.ts

export async function http<T>(
  path: string,
  token?: string,
  options: RequestInit = {}
): Promise<T> {
  const base = import.meta.env.VITE_API_URL as string | undefined;
  const apiKey = import.meta.env.VITE_API_KEY as string | undefined;

  if (!base) {
    console.error("VITE_API_URL is missing in .env");
    throw new Error("API base URL is not configured");
  }

  const url = `${base}${path}`;
  console.log("[HTTP] →", url);

  // Build auth header only if we have a token
  const authHeader: Record<string, string> = token
    ? { Authorization: `Bearer ${token}` }
    : {};

  // Merge headers into a valid HeadersInit
  const mergedHeaders: HeadersInit = {
    "Content-Type": "application/json",
    ...(apiKey ? { "X-API-Key": apiKey } : {}),
    ...authHeader,
    ...(options.headers as HeadersInit), // cast to HeadersInit to satisfy TS
  };

  let res: Response;

  try {
    res = await fetch(url, {
      ...options,
      headers: mergedHeaders,
    });
  } catch (err) {
    console.error("[HTTP] Network error", err);
    throw new Error("Failed to fetch");
  }

  let body: any = null;
  try {
    body = await res.json();
  } catch {
  }

  if (!res.ok) {
    const msg = body?.error || `HTTP ${res.status}`;
    console.error("[HTTP ERROR]", res.status, msg, body);
    throw new Error(msg);
  }

  console.log("[HTTP] ✓", body);
  return body as T;
}

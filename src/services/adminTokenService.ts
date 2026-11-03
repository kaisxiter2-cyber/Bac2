export interface ApiTokenRecord {
  id: string;
  name: string;
  created_at: string;
  revoked_at: string | null;
}

const TOKENS_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/site-admin/tokens`;

async function request<T>(adminCode: string, init: { method?: string; body?: unknown; path?: string } = {}): Promise<T> {
  const response = await fetch(`${TOKENS_URL}${init.path ?? ''}`, {
    method: init.method ?? 'GET',
    headers: {
      apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
      'X-Admin-Code': adminCode,
    },
    body: init.body === undefined ? undefined : JSON.stringify(init.body),
  });

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(typeof data?.error === 'string' ? data.error : `Request failed (${response.status})`);
  }
  return data as T;
}

export async function listApiTokens(adminCode: string): Promise<ApiTokenRecord[]> {
  const data = await request<{ tokens?: ApiTokenRecord[] }>(adminCode);
  if (!Array.isArray(data.tokens)) throw new Error('Unexpected response from the server');
  return data.tokens;
}

export async function createApiToken(adminCode: string, name: string): Promise<{ token: string; record: ApiTokenRecord }> {
  const data = await request<{ token?: string; record?: ApiTokenRecord }>(adminCode, {
    method: 'POST',
    body: { name },
  });
  if (typeof data.token !== 'string' || !data.record) throw new Error('Unexpected response from the server');
  return { token: data.token, record: data.record };
}

export async function revokeApiToken(adminCode: string, id: string): Promise<void> {
  await request<unknown>(adminCode, { method: 'DELETE', path: `/${id}` });
}

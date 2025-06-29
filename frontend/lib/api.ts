import { API_URL } from "../config/config";

export async function fetchUser() {
  const res = await fetch(`${API_URL}/api/user`, {
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Not logged in');
  return await res.json();
}

export async function fetchGuilds() {
  const res = await fetch(`${API_URL}/api/guilds`, {
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Not logged in');
  return await res.json();
}

export async function refreshGuilds() {
  const res = await fetch(`${API_URL}/api/refresh`, {
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to refresh');
  return await res.json();
}

export async function fetchGuildDetails(id: string) {
  const res = await fetch(`${API_URL}/api/guilds/${id}`, {
    credentials: 'include',
  });

  if (!res.ok) {
    throw new Error('Failed to fetch guild details');
  }

  const details = await res.json();

  const settingsRes = await fetch(`${API_URL}/api/guilds/${id}/settings`, {
    credentials: 'include',
  });

  if (!settingsRes.ok) {
    throw new Error('Failed to fetch guild settings');
  }

  const settings = await settingsRes.json() || {};

  return {
    ...details,
    settings,
  };
}

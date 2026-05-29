import API_BASE_URL from '../config/config.js';

const JSON_HEADERS = { 'Content-Type': 'application/json' };

async function handleResponse(res) {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Error ${res.status}`);
  }
}

export async function getPersonas() {
  const res = await fetch(`${API_BASE_URL}/personas`);
  await handleResponse(res);
  return res.json();
}

export async function createPersona(data) {
  const res = await fetch(`${API_BASE_URL}/personas`, {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify(data),
  });
  await handleResponse(res);
}

export async function updatePersona(id, data) {
  const res = await fetch(`${API_BASE_URL}/personas/${id}`, {
    method: 'PUT',
    headers: JSON_HEADERS,
    body: JSON.stringify(data),
  });
  await handleResponse(res);
}

export async function deletePersona(id) {
  const res = await fetch(`${API_BASE_URL}/personas/${id}`, { method: 'DELETE' });
  await handleResponse(res);
}

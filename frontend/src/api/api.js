const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

async function request(path, { method = 'GET', body, token } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;

  let response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch (networkErr) {
    throw new Error('Unable to reach the server. Please check your connection and try again.');
  }

  let data;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const message = data?.message || `Request failed with status ${response.status}`;
    throw new Error(message);
  }

  return data;
}

export const authApi = {
  login: (email, password) => request('/auth/login', { method: 'POST', body: { email, password } }),
  register: (name, email, password) =>
    request('/auth/register', { method: 'POST', body: { name, email, password } }),
  me: (token) => request('/auth/me', { token }),
};

export const taskApi = {
  getAll: (token, params = {}) => {
    const query = new URLSearchParams(
      Object.fromEntries(Object.entries(params).filter(([, v]) => v !== '' && v !== undefined))
    ).toString();
    return request(`/tasks${query ? `?${query}` : ''}`, { token });
  },
  getOne: (token, id) => request(`/tasks/${id}`, { token }),
  create: (token, task) => request('/tasks', { method: 'POST', body: task, token }),
  update: (token, id, task) => request(`/tasks/${id}`, { method: 'PUT', body: task, token }),
  remove: (token, id) => request(`/tasks/${id}`, { method: 'DELETE', token }),
};

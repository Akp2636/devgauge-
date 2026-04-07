const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const getToken = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('dg_token');
};

const request = async (path: string, options: RequestInit = {}) => {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
};

export const api = {
  // Auth
  register: (body: object) => request('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login: (body: object) => request('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  me: () => request('/auth/me'),

  // User
  getProfile: () => request('/users/profile'),
  updateProfile: (body: object) => request('/users/profile', { method: 'PUT', body: JSON.stringify(body) }),
  getLeaderboard: () => request('/users/leaderboard'),
  getUserById: (id: string) => request(`/users/${id}`),

  // Projects
  submitProject: (body: object) => request('/projects', { method: 'POST', body: JSON.stringify(body) }),
  getMyProjects: () => request('/projects/my'),
  getAllProjects: () => request('/projects'),
  deleteProject: (id: string) => request(`/projects/${id}`, { method: 'DELETE' }),

  // Recruiter
  getCandidates: (params: Record<string, string>) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/recruiter/candidates?${qs}`);
  },
  getRecruiterStats: () => request('/recruiter/stats'),
};

export const setToken = (token: string) => localStorage.setItem('dg_token', token);
export const removeToken = () => localStorage.removeItem('dg_token');
export const isLoggedIn = () => !!getToken();

import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/v1';
const API_KEY = 'kjshrbksdrkjshertguyerfebfysd';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': API_KEY
  }
});

export const studentApi = {
  getAll: async (page = 1, limit = 10) => {
    const response = await api.get(`/students?page=${page}&limit=${limit}`);
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/students/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/students', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/students/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/students/${id}`);
    return response.data;
  },

  getMarks: async (id) => {
    const response = await api.get(`/students/${id}/marks`);
    return response.data;
  },

  addMark: async (id, data) => {
    const response = await api.post(`/students/${id}/marks`, data);
    return response.data;
  },

  getSubjects: async () => {
    const response = await api.get('/subjects');
    return response.data;
  },

  deleteMark: async (studentId, markId) => {
    const response = await api.delete(`/students/${studentId}/marks/${markId}`);
    return response.data;
  }
};
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' }
});

export const predictDisease = async (symptoms) => {
  const response = await api.post('/predict', { symptoms });
  return response.data;
};

export const getMetadata = async () => {
  const response = await api.get('/metadata');
  return response.data;
};

export const getSpecialist = async (disease) => {
  const response = await api.get(`/consult/specialist?disease=${encodeURIComponent(disease)}`);
  return response.data;
};

export const getMedicine = async (disease) => {
  const response = await api.get(`/consult/medicine?disease=${encodeURIComponent(disease)}`);
  return response.data;
};

export const getAllSpecialists = async () => {
  const response = await api.get('/consult/specialist');
  return response.data;
};

export const getAllMedicines = async () => {
  const response = await api.get('/consult/medicine');
  return response.data;
};

export default api;

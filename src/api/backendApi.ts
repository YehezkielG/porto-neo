import axios from 'axios';

const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();
export const BASE_URL = (configuredBaseUrl || 'http://localhost:8000').replace(/\/+$/, '');

export const delay = (ms = 200): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

const backendApi = axios.create({ baseURL: BASE_URL });

export const GetPublic = () => backendApi.get('/public');

export default backendApi;

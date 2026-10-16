import axios from 'axios';

const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();
export const BASE_URL = (configuredBaseUrl || 'http://localhost:8000').replace(/\/+$/, '');

type ApiPayload = Record<string, unknown>;
type RecordId = number | string;

export const delay = (ms = 200): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

const backendApi = axios.create({ baseURL: BASE_URL });

export const LoginApi = (username: string, password: string) =>
  backendApi.post('/login', { username, password });

export const LogoutApi = (token: string | null) =>
  backendApi.post('/logout', { token });

export const GetPublic = () => backendApi.get('/public');

export const GetUser = (token: string) =>
  backendApi.get('/users', { params: { token } });
export const UpdateUser = (formData: FormData) => backendApi.post('/users', formData);

export const GetAboutMe = (token: string) =>
  backendApi.get('/about_me', { params: { token } });
export const UpdateAboutMe = (data: ApiPayload) => backendApi.put('/about_me', data);

export const GetPendidikan = (token: string) =>
  backendApi.get('/pendidikan', { params: { token } });
export const AddPendidikan = (data: FormData) => backendApi.post('/pendidikan', data);
export const UpdatePendidikan = (data: FormData) => {
  data.append('_method', 'PUT');
  return backendApi.post('/pendidikan', data);
};
export const DeletePendidikan = (id: RecordId, token: string) =>
  backendApi.delete('/pendidikan', { data: { id, token } });

export const GetPengalaman = (token: string) =>
  backendApi.get('/pengalaman', { params: { token } });
export const AddPengalaman = (data: FormData) => backendApi.post('/pengalaman', data);
export const UpdatePengalaman = (data: FormData) => {
  data.append('_method', 'PUT');
  return backendApi.post('/pengalaman', data);
};
export const DeletePengalaman = (id: RecordId, token: string) =>
  backendApi.delete('/pengalaman', { data: { id, token } });

export const GetKeahlian = (token: string) =>
  backendApi.get('/keahlian', { params: { token } });
export const AddKeahlian = (data: ApiPayload) => backendApi.post('/keahlian', data);
export const UpdateKeahlian = (data: ApiPayload) => backendApi.put('/keahlian', data);
export const DeleteKeahlian = (id: RecordId, token: string) =>
  backendApi.delete('/keahlian', { data: { id, token } });

export const GetTechnicalDomains = (token: string) =>
  backendApi.get('/technical_domains', { params: { token } });
export const AddTechnicalDomain = (data: ApiPayload) =>
  backendApi.post('/technical_domains', data);
export const UpdateTechnicalDomain = (data: ApiPayload) =>
  backendApi.put('/technical_domains', data);
export const DeleteTechnicalDomain = (id: RecordId, token: string) =>
  backendApi.delete('/technical_domains', { data: { id, token } });

export const GetLinks = (token: string) =>
  backendApi.get('/links', { params: { token } });
export const UpdateLink = (data: ApiPayload) => backendApi.put('/links', data);

export const GetKarya = (token: string) =>
  backendApi.get('/karya', { params: { token } });
export const AddKarya = (data: FormData) => backendApi.post('/karya', data);
export const UpdateKarya = (data: FormData) => {
  data.append('_method', 'PUT');
  return backendApi.post('/karya', data);
};
export const DeleteKarya = (id: RecordId, token: string) =>
  backendApi.delete('/karya', { data: { id, token } });

export default backendApi;

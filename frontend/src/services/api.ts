import '../firebase';
import axios from 'axios';
import { getAuth } from 'firebase/auth';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use(async (config) => {
  const auth = getAuth();
  const user = auth.currentUser;
  if (user && config.headers) {
    const token = await user.getIdToken();
    config.headers.set('Authorization', `Bearer ${token}`);
  }
  return config;
});

export default api;

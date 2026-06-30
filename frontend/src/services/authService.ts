import api from './api';

export interface AuthProfile {
  uid: string;
  email: string;
  displayName: string;
  role: 'Buyer' | 'Seller' | 'Admin';
}

export async function fetchProfile(idToken: string) {
  const response = await api.get<AuthProfile>('/auth/profile', {
    headers: {
      Authorization: `Bearer ${idToken}`
    }
  });
  return response.data;
}

export async function assignRole(idToken: string, role: string, adminCode?: string) {
  const response = await api.post<AuthProfile>(
    '/auth/signup',
    { role, adminCode },
    {
      headers: {
        Authorization: `Bearer ${idToken}`
      }
    }
  );
  return response.data;
}

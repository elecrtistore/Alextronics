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

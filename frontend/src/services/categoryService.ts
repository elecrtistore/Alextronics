import api from './api';

export interface Category {
  _id: string;
  name: string;
  icon: string;
  image: string;
}

export async function fetchCategories() {
  const response = await api.get<Category[]>('/categories');
  return response.data;
}

export async function createCategory(data: { name: string; icon?: string; image?: string }) {
  const response = await api.post<Category>('/categories', data);
  return response.data;
}

export async function updateCategory(id: string, data: { name?: string; icon?: string; image?: string }) {
  const response = await api.put<Category>(`/categories/${id}`, data);
  return response.data;
}

export async function deleteCategory(id: string) {
  await api.delete(`/categories/${id}`);
}

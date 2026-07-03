import api from './api';
import { Product } from '../types/product';

export async function fetchProducts() {
  const response = await api.get<Product[]>('/products');
  return response.data;
}

export async function fetchProductById(id: string) {
  const response = await api.get<Product>(`/products/${id}`);
  return response.data;
}

export async function createProduct(product: Omit<Product, '_id' | 'createdAt'>) {
  const response = await api.post<Product>('/products', product);
  return response.data;
}

export async function importProducts(csvText: string) {
  const response = await api.post<{ created: number; skipped: number; errors: Array<{ row: number; field?: string; message: string }>; products: Product[] }>('/products/import', { csvText });
  return response.data;
}

export async function updateProduct(id: string, product: Partial<Product>) {
  const response = await api.put<Product>(`/products/${id}`, product);
  return response.data;
}

export async function deleteProduct(id: string) {
  await api.delete(`/products/${id}`);
}

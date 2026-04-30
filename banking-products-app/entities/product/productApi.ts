import axios from 'axios';
import { Product } from './product.types';

const BASE_URL = 'http://172.31.134.104:3002';

export async function getProducts(): Promise<Product[]> {
  const response = await axios.get<{ data: Product[] }>(`${BASE_URL}/bp/products`);
  return response.data.data;
}

export async function verifyProductId(id: string): Promise<boolean> {
  try {
    const response = await axios.get<boolean>(`${BASE_URL}/bp/products/verification/${id}`);
    return !response.data; // true = disponible (el backend retorna true si el ID ya existe)
  } catch {
    return false;
  }
}

type CreateProductPayload = {
  id: string;
  name: string;
  description: string;
  logo: string;
  date_release: string;
  date_revision: string;
};

export async function createProduct(data: CreateProductPayload): Promise<Product> {
  const response = await axios.post<{ data: Product }>(`${BASE_URL}/bp/products`, data);
  return response.data.data;
}

export async function getProductById(id: string): Promise<Product> {
  try {
    const response = await axios.get<Product>(`${BASE_URL}/bp/products/${id}`);
    if (response.data?.id) return response.data;
    throw new Error('Empty response');
  } catch {
    const all = await getProducts();
    const found = all.find(p => String(p.id) === String(id));
    if (!found) throw new Error('Producto no encontrado');
    return found;
  }
}

export async function deleteProduct(id: string): Promise<void> {
  await axios.delete(`${BASE_URL}/bp/products/${id}`);
}

type UpdateProductPayload = {
  name: string;
  description: string;
  logo: string;
  date_release: string;
  date_revision: string;
};

export async function updateProduct(id: string, data: UpdateProductPayload): Promise<Product> {
  const response = await axios.put<Product>(`${BASE_URL}/bp/products/${id}`, data);
  return response.data;
}

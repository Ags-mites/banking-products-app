import axios from 'axios';
import { Product } from './product.types';

const BASE_URL = 'http://172.31.134.104:3002';

export async function getProducts(): Promise<Product[]> {
  const response = await axios.get<{ data: Product[] }>(`${BASE_URL}/bp/products`);
  return response.data.data;
}

export async function verifyProductId(id: string): Promise<boolean> {
  try {
    await axios.get(`${BASE_URL}/bp/products/verification/${id}`);
    return true;
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

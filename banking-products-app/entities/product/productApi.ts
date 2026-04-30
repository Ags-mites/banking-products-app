import axios from 'axios';
import { Product } from './product.types';

const BASE_URL = 'http://172.31.134.104:3002';

export async function getProducts(): Promise<Product[]> {
  const response = await axios.get<{ data: Product[] }>(`${BASE_URL}/bp/products`);
  return response.data.data;
}

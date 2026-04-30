import { useState, useEffect, useMemo } from 'react';
import { Product } from '../../entities/product/product.types';
import { getProducts } from '../../entities/product/productApi';

export function useProductSearch() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    
    getProducts()
      .then((data) => {
        setProducts(data);
      })
      .catch(() => {
        setError('Error al cargar los productos. Intenta nuevamente.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const filteredProducts = useMemo(
    () =>
      searchTerm.trim() === ''
        ? products
        : products.filter((p) =>
            p.name.toLowerCase().includes(searchTerm.toLowerCase()),
          ),
    [products, searchTerm],
  );

  return { products, filteredProducts, searchTerm, setSearchTerm, loading, error };
}
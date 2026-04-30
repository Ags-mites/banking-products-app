import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { getProductById, deleteProduct } from '../../entities/product/productApi';
import { Product } from '../../entities/product/product.types';

export function useProductDetail(id: string) {
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      setError('ID de producto no encontrado.');
      return;
    }
    setLoading(true);
    setError('');
    getProductById(id)
      .then(setProduct)
      .catch(() => setError('No se pudo cargar el producto. Verifica tu conexión.'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteProduct(id);
      router.replace('/products');
    } catch {
      setError('No se pudo eliminar el producto. Intenta de nuevo.');
      setDeleting(false);
    }
  };

  return { product, loading, error, deleting, handleDelete };
}

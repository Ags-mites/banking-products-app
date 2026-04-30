import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'expo-router';
import { getProductById, updateProduct } from '../../entities/product/productApi';
import { Product } from '../../entities/product/product.types';
import {
  validateName,
  validateDescription,
  validateLogo,
  isValidReleaseDate,
  calculateReviewDate,
  maskDateInput,
} from '../../shared/lib/productValidations';
import { ProductFormData, ProductFormErrors } from '../productRegistration/productRegistration.types';

function productToForm(p: Product): ProductFormData {
  return {
    id: p.id,
    name: p.name,
    description: p.description ?? '',
    logo: p.logo ?? '',
    date_release: p.date_release ?? '',
    date_revision: p.date_revision ?? '',
  };
}

export function useProductEdit(id: string) {
  const router = useRouter();
  const [original, setOriginal] = useState<ProductFormData | null>(null);
  const [form, setForm] = useState<ProductFormData | null>(null);
  const [errors, setErrors] = useState<ProductFormErrors>({});
  const [networkError, setNetworkError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [initialError, setInitialError] = useState('');
  const prevDateRef = useRef('');

  useEffect(() => {
    if (!id) {
      setInitialError('ID de producto no encontrado.');
      setInitialLoading(false);
      return;
    }
    getProductById(id)
      .then(p => {
        const f = productToForm(p);
        setOriginal(f);
        setForm(f);
        prevDateRef.current = f.date_release;
      })
      .catch(() => setInitialError('No se pudo cargar el producto. Verifica tu conexión.'))
      .finally(() => setInitialLoading(false));
  }, [id]);

  useEffect(() => {
    if (!successMessage) return;
    const timer = setTimeout(() => router.replace(`/products/${id}`), 2000);
    return () => clearTimeout(timer);
  }, [successMessage, id, router]);

  const handleChange = (field: keyof ProductFormData, value: string) => {
    if (!form) return;
    setNetworkError('');
    setErrors(prev => ({ ...prev, [field]: undefined }));

    if (field === 'date_release') {
      const masked = maskDateInput(value, prevDateRef.current);
      prevDateRef.current = masked;
      const review = masked.length === 10 ? calculateReviewDate(masked) : '';
      setForm(prev => prev ? { ...prev, date_release: masked, date_revision: review } : prev);
      return;
    }

    setForm(prev => prev ? { ...prev, [field]: value } : prev);
  };

  const handleReset = () => {
    if (!original) return;
    setForm(original);
    setErrors({});
    setNetworkError('');
    prevDateRef.current = original.date_release;
  };

  const handleSubmit = async () => {
    if (!form) return;

    const nameError = validateName(form.name);
    const descError = validateDescription(form.description);
    const logoError = validateLogo(form.logo);
    const dateError = isValidReleaseDate(form.date_release);

    if (nameError || descError || logoError || dateError) {
      setErrors({ name: nameError, description: descError, logo: logoError, date_release: dateError });
      return;
    }

    setLoading(true);
    setNetworkError('');

    try {
      await updateProduct(id, {
        name: form.name,
        description: form.description,
        logo: form.logo,
        date_release: form.date_release,
        date_revision: form.date_revision,
      });
      setSuccessMessage('¡Producto actualizado exitosamente!');
    } catch {
      setNetworkError('Error de conexión. Verifica tu red e intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    errors,
    networkError,
    successMessage,
    loading,
    initialLoading,
    initialError,
    handleChange,
    handleSubmit,
    handleReset,
  };
}

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { verifyProductId, createProduct } from '../../entities/product/productApi';
import {
  validateId,
  validateName,
  validateDescription,
  validateLogo,
  isValidReleaseDate,
  calculateReviewDate,
  generateProductId,
} from '../../shared/lib/productValidations';
import {
  ProductFormData,
  ProductFormErrors,
  INITIAL_FORM,
} from './productRegistration.types';

const freshForm = (): ProductFormData => ({ ...INITIAL_FORM, id: generateProductId() });

export function useProductRegistration() {
  const router = useRouter();
  const [form, setForm] = useState<ProductFormData>(freshForm);
  const [errors, setErrors] = useState<ProductFormErrors>({});
  const [networkError, setNetworkError] = useState('');
  const [idAvailable, setIdAvailable] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!successMessage) return;
    const timer = setTimeout(() => router.replace('/products'), 2000);
    return () => clearTimeout(timer);
  }, [successMessage, router]);

  useEffect(() => {
    verifyProductId(form.id).then(available => {
      setIdAvailable(available);
      if (!available) setErrors(prev => ({ ...prev, id: 'ID no disponible' }));
    }).catch(() => {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (field: keyof ProductFormData, value: string) => {
    setNetworkError('');

    if (field === 'date_release') {
      const review = value.length === 10 ? calculateReviewDate(value) : '';
      setForm(prev => ({ ...prev, date_release: value, date_revision: review }));
      setErrors(prev => ({ ...prev, date_release: undefined }));
      return;
    }

    setForm(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: undefined }));

    if (field === 'id') {
      setIdAvailable(null);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (value.length >= 3 && value.length <= 10) {
        debounceRef.current = setTimeout(async () => {
          try {
            const available = await verifyProductId(value);
            setIdAvailable(available);
            if (!available) {
              setErrors(prev => ({ ...prev, id: 'ID no disponible' }));
            }
          } catch {
            setNetworkError('Error de conexión. Verifica tu red e intenta de nuevo.');
          }
        }, 500);
      }
    }
  };

  const handleReset = () => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    const newForm = freshForm();
    setForm(newForm);
    setErrors({});
    setNetworkError('');
    setSuccessMessage('');
    setIdAvailable(null);
    verifyProductId(newForm.id).then(available => {
      setIdAvailable(available);
      if (!available) setErrors(prev => ({ ...prev, id: 'ID no disponible' }));
    }).catch(() => {});
  };

  const handleSubmit = async () => {
    const idError = validateId(form.id);
    const nameError = validateName(form.name);
    const descError = validateDescription(form.description);
    const logoError = validateLogo(form.logo);
    const dateError = isValidReleaseDate(form.date_release);

    const newErrors: ProductFormErrors = {
      id: idError,
      name: nameError,
      description: descError,
      logo: logoError,
      date_release: dateError,
    };

    if (idError || nameError || descError || logoError || dateError) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setNetworkError('');

    try {
      const available = await verifyProductId(form.id);
      if (!available) {
        setErrors(prev => ({ ...prev, id: 'ID no disponible' }));
        setLoading(false);
        return;
      }

      await createProduct(form);

      setSuccessMessage('¡Producto registrado exitosamente!');
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
    idAvailable,
    loading,
    handleChange,
    handleSubmit,
    handleReset,
  };
}

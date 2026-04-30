import { renderHook, act, waitFor } from '@testing-library/react-native';
import { useProductRegistration } from '../useProductRegistration';

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

const mockReplace = jest.fn();
const mockPush = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({ replace: mockReplace, push: mockPush, back: jest.fn() }),
  useLocalSearchParams: () => ({}),
}));

jest.mock('../../../entities/product/productApi', () => ({
  verifyProductId: jest.fn(),
  createProduct: jest.fn(),
}));

// generateProductId devuelve un ID fijo para poder asertarlo
jest.mock('../../../shared/lib/productValidations', () => {
  const original = jest.requireActual('../../../shared/lib/productValidations');
  return {
    ...original,
    generateProductId: jest.fn(() => '123456'),
  };
});

import { verifyProductId, createProduct } from '../../../entities/product/productApi';

const mockVerify = verifyProductId as jest.MockedFunction<typeof verifyProductId>;
const mockCreate = createProduct as jest.MockedFunction<typeof createProduct>;

// Producto válido para tests de submit
const VALID_FORM_VALUES = {
  name: 'Tarjeta Válida',
  description: 'Descripción válida con más de diez caracteres.',
  logo: 'https://example.com/logo.png',
  date_release: '2027-01-15',
};

describe('useProductRegistration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Por defecto el ID generado está disponible
    mockVerify.mockResolvedValue(true);
  });

  // -------------------------------------------------------------------------
  // Estado inicial
  // -------------------------------------------------------------------------
  it('el estado inicial tiene campos vacíos y id = "123456"', async () => {
    // Arrange & Act
    const { result } = renderHook(() => useProductRegistration());
    await waitFor(() => expect(result.current.idAvailable).not.toBeNull());

    // Assert
    expect(result.current.form.id).toBe('123456');
    expect(result.current.form.name).toBe('');
    expect(result.current.form.description).toBe('');
    expect(result.current.form.logo).toBe('');
    expect(result.current.form.date_release).toBe('');
    expect(result.current.form.date_revision).toBe('');
    expect(result.current.errors).toEqual({});
    expect(result.current.networkError).toBe('');
    expect(result.current.loading).toBe(false);
  });

  // -------------------------------------------------------------------------
  // handleChange — campos de texto
  // -------------------------------------------------------------------------
  it('handleChange actualiza form.name correctamente', async () => {
    // Arrange
    const { result } = renderHook(() => useProductRegistration());
    await waitFor(() => expect(result.current.idAvailable).not.toBeNull());

    // Act
    act(() => { result.current.handleChange('name', 'Nuevo Nombre'); });

    // Assert
    expect(result.current.form.name).toBe('Nuevo Nombre');
  });

  it('handleChange con date_release calcula date_revision', async () => {
    // Arrange
    const { result } = renderHook(() => useProductRegistration());
    await waitFor(() => expect(result.current.idAvailable).not.toBeNull());

    // Act
    act(() => { result.current.handleChange('date_release', '2027-01-15'); });

    // Assert
    expect(result.current.form.date_release).toBe('2027-01-15');
    expect(result.current.form.date_revision).toBe('2028-01-15');
  });

  it('handleChange con date_release parcial (<10 chars) deja date_revision vacío', async () => {
    // Arrange
    const { result } = renderHook(() => useProductRegistration());
    await waitFor(() => expect(result.current.idAvailable).not.toBeNull());

    // Act
    act(() => { result.current.handleChange('date_release', '2027-01'); });

    // Assert
    expect(result.current.form.date_revision).toBe('');
  });

  // -------------------------------------------------------------------------
  // handleChange — campo id con debounce
  // -------------------------------------------------------------------------
  it('handleChange con id dispara debounce y llama verifyProductId tras 500ms', async () => {
    // Arrange
    jest.useFakeTimers();
    mockVerify.mockResolvedValue(true);
    const { result } = renderHook(() => useProductRegistration());

    // Act
    act(() => { result.current.handleChange('id', 'abc'); });
    act(() => { jest.advanceTimersByTime(600); });

    // Assert
    await waitFor(() => expect(mockVerify).toHaveBeenCalledWith('abc'));
    jest.useRealTimers();
  });

  it('handleChange con id de longitud < 3 no dispara debounce', async () => {
    // Arrange
    jest.useFakeTimers();
    const { result } = renderHook(() => useProductRegistration());
    // Limpiar el mock de la llamada inicial del useEffect
    mockVerify.mockClear();

    // Act
    act(() => { result.current.handleChange('id', 'ab'); });
    act(() => { jest.advanceTimersByTime(600); });

    // Assert — no debe haber nuevas llamadas más allá de la inicial
    await waitFor(() => { /* sin error */ });
    expect(mockVerify).not.toHaveBeenCalled();
    jest.useRealTimers();
  });

  // -------------------------------------------------------------------------
  // handleReset
  // -------------------------------------------------------------------------
  it('handleReset restaura el formulario y limpia errores', async () => {
    // Arrange
    const { result } = renderHook(() => useProductRegistration());
    await waitFor(() => expect(result.current.idAvailable).not.toBeNull());

    act(() => { result.current.handleChange('name', 'Cambiado'); });
    expect(result.current.form.name).toBe('Cambiado');

    // Act
    act(() => { result.current.handleReset(); });
    await waitFor(() => expect(result.current.idAvailable).not.toBeNull());

    // Assert
    expect(result.current.form.name).toBe('');
    expect(result.current.errors).toEqual({});
    expect(result.current.networkError).toBe('');
  });

  // -------------------------------------------------------------------------
  // handleSubmit — validación de campos vacíos
  // -------------------------------------------------------------------------
  it('handleSubmit con campos vacíos setea errores en todos los campos', async () => {
    // Arrange
    const { result } = renderHook(() => useProductRegistration());
    await waitFor(() => expect(result.current.idAvailable).not.toBeNull());

    // Act — formulario en estado inicial (id='123456' es válido, el resto vacío)
    await act(async () => { await result.current.handleSubmit(); });

    // Assert
    expect(result.current.errors.name).toBeDefined();
    expect(result.current.errors.description).toBeDefined();
    expect(result.current.errors.logo).toBeDefined();
    expect(result.current.errors.date_release).toBeDefined();
  });

  // -------------------------------------------------------------------------
  // handleSubmit — ID no disponible
  // -------------------------------------------------------------------------
  it('handleSubmit con verifyProductId retornando false setea error en campo id', async () => {
    // Arrange
    mockVerify.mockResolvedValue(false);
    const { result } = renderHook(() => useProductRegistration());
    await waitFor(() => expect(result.current.idAvailable).not.toBeNull());

    // Rellenar el form con datos válidos
    act(() => {
      result.current.handleChange('name', VALID_FORM_VALUES.name);
      result.current.handleChange('description', VALID_FORM_VALUES.description);
      result.current.handleChange('logo', VALID_FORM_VALUES.logo);
      result.current.handleChange('date_release', VALID_FORM_VALUES.date_release);
    });

    // Act
    await act(async () => { await result.current.handleSubmit(); });

    // Assert
    expect(result.current.errors.id).toBe('ID no disponible');
    expect(mockCreate).not.toHaveBeenCalled();
  });

  // -------------------------------------------------------------------------
  // handleSubmit — flujo exitoso
  // -------------------------------------------------------------------------
  it('handleSubmit exitoso con datos válidos llama createProduct y setea successMessage', async () => {
    // Arrange
    mockVerify.mockResolvedValue(true);
    mockCreate.mockResolvedValue({ id: '123456', name: VALID_FORM_VALUES.name });
    const { result } = renderHook(() => useProductRegistration());
    await waitFor(() => expect(result.current.idAvailable).not.toBeNull());

    act(() => {
      result.current.handleChange('name', VALID_FORM_VALUES.name);
      result.current.handleChange('description', VALID_FORM_VALUES.description);
      result.current.handleChange('logo', VALID_FORM_VALUES.logo);
      result.current.handleChange('date_release', VALID_FORM_VALUES.date_release);
    });

    // Act
    await act(async () => { await result.current.handleSubmit(); });

    // Assert
    expect(mockCreate).toHaveBeenCalledTimes(1);
    expect(result.current.successMessage).toBe('¡Producto registrado exitosamente!');
    expect(result.current.networkError).toBe('');
  });

  // -------------------------------------------------------------------------
  // handleSubmit — error de red en createProduct
  // -------------------------------------------------------------------------
  it('handleSubmit setea networkError cuando createProduct lanza una excepción', async () => {
    // Arrange
    mockVerify.mockResolvedValue(true);
    mockCreate.mockRejectedValue(new Error('Network error'));
    const { result } = renderHook(() => useProductRegistration());
    await waitFor(() => expect(result.current.idAvailable).not.toBeNull());

    act(() => {
      result.current.handleChange('name', VALID_FORM_VALUES.name);
      result.current.handleChange('description', VALID_FORM_VALUES.description);
      result.current.handleChange('logo', VALID_FORM_VALUES.logo);
      result.current.handleChange('date_release', VALID_FORM_VALUES.date_release);
    });

    // Act
    await act(async () => { await result.current.handleSubmit(); });

    // Assert
    expect(result.current.networkError).toBe('Error de conexión. Verifica tu red e intenta de nuevo.');
    expect(result.current.loading).toBe(false);
  });

  // -------------------------------------------------------------------------
  // handleSubmit — loading flag
  // -------------------------------------------------------------------------
  it('handleSubmit pone loading en true durante la petición', async () => {
    // Arrange
    let resolveCreate: (value: any) => void;
    mockVerify.mockResolvedValue(true);
    mockCreate.mockReturnValue(new Promise(resolve => { resolveCreate = resolve; }));

    const { result } = renderHook(() => useProductRegistration());
    await waitFor(() => expect(result.current.idAvailable).not.toBeNull());

    act(() => {
      result.current.handleChange('name', VALID_FORM_VALUES.name);
      result.current.handleChange('description', VALID_FORM_VALUES.description);
      result.current.handleChange('logo', VALID_FORM_VALUES.logo);
      result.current.handleChange('date_release', VALID_FORM_VALUES.date_release);
    });

    // Act
    act(() => { result.current.handleSubmit(); });
    await waitFor(() => expect(result.current.loading).toBe(true));

    // Cleanup — resolver la promesa para no dejar timers colgados
    await act(async () => { resolveCreate({ id: '123456', name: 'Test' }); });
  });
});

import { renderHook, act, waitFor } from '@testing-library/react-native';
import { useProductEdit } from '../useProductEdit';

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

const mockReplace = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({ replace: mockReplace, push: jest.fn(), back: jest.fn() }),
  useLocalSearchParams: () => ({ id: 'prod-001' }),
}));

jest.mock('../../../entities/product/productApi', () => ({
  getProductById: jest.fn(),
  updateProduct: jest.fn(),
}));

import { getProductById, updateProduct } from '../../../entities/product/productApi';

const mockGetById = getProductById as jest.MockedFunction<typeof getProductById>;
const mockUpdate = updateProduct as jest.MockedFunction<typeof updateProduct>;

const MOCK_PRODUCT = {
  id: 'prod-001',
  name: 'Tarjeta de Crédito',
  description: 'Descripción del producto de crédito.',
  logo: 'https://example.com/logo.png',
  date_release: '2027-06-01',
  date_revision: '2028-06-01',
};

describe('useProductEdit', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // -------------------------------------------------------------------------
  // Carga inicial del formulario
  // -------------------------------------------------------------------------
  it('inicializa form con los datos del producto tras cargar', async () => {
    // Arrange
    mockGetById.mockResolvedValue(MOCK_PRODUCT);

    // Act
    const { result } = renderHook(() => useProductEdit('prod-001'));
    await waitFor(() => expect(result.current.initialLoading).toBe(false));

    // Assert
    expect(result.current.form?.id).toBe('prod-001');
    expect(result.current.form?.name).toBe('Tarjeta de Crédito');
    expect(result.current.form?.description).toBe('Descripción del producto de crédito.');
    expect(result.current.form?.logo).toBe('https://example.com/logo.png');
    expect(result.current.form?.date_release).toBe('2027-06-01');
    expect(result.current.form?.date_revision).toBe('2028-06-01');
  });

  // -------------------------------------------------------------------------
  // handleChange — campos de texto
  // -------------------------------------------------------------------------
  it('handleChange actualiza form.name', async () => {
    // Arrange
    mockGetById.mockResolvedValue(MOCK_PRODUCT);
    const { result } = renderHook(() => useProductEdit('prod-001'));
    await waitFor(() => expect(result.current.initialLoading).toBe(false));

    // Act
    act(() => { result.current.handleChange('name', 'Nuevo Nombre del Producto'); });

    // Assert
    expect(result.current.form?.name).toBe('Nuevo Nombre del Producto');
  });

  it('handleChange con date_release calcula date_revision correctamente', async () => {
    // Arrange
    mockGetById.mockResolvedValue(MOCK_PRODUCT);
    const { result } = renderHook(() => useProductEdit('prod-001'));
    await waitFor(() => expect(result.current.initialLoading).toBe(false));

    // Act — la función usa maskDateInput internamente, pasamos la fecha ya formateada
    // maskDateInput('2028-03-10', '2027-06-01') → '2028-03-10' (ya tiene el formato correcto)
    act(() => { result.current.handleChange('date_release', '2028-03-10'); });

    // Assert
    expect(result.current.form?.date_release).toBe('2028-03-10');
    expect(result.current.form?.date_revision).toBe('2029-03-10');
  });

  // -------------------------------------------------------------------------
  // handleReset
  // -------------------------------------------------------------------------
  it('handleReset restaura el form a los valores originales del producto', async () => {
    // Arrange
    mockGetById.mockResolvedValue(MOCK_PRODUCT);
    const { result } = renderHook(() => useProductEdit('prod-001'));
    await waitFor(() => expect(result.current.initialLoading).toBe(false));

    // Modificar algunos campos
    act(() => {
      result.current.handleChange('name', 'Nombre cambiado');
      result.current.handleChange('description', 'Descripción cambiada por el usuario.');
    });
    expect(result.current.form?.name).toBe('Nombre cambiado');

    // Act
    act(() => { result.current.handleReset(); });

    // Assert — vuelve al original
    expect(result.current.form?.name).toBe('Tarjeta de Crédito');
    expect(result.current.form?.description).toBe('Descripción del producto de crédito.');
    expect(result.current.form?.date_release).toBe('2027-06-01');
    expect(result.current.errors).toEqual({});
    expect(result.current.networkError).toBe('');
  });

  // -------------------------------------------------------------------------
  // handleSubmit — validación
  // -------------------------------------------------------------------------
  it('handleSubmit con name vacío setea error en campo name', async () => {
    // Arrange
    mockGetById.mockResolvedValue({ ...MOCK_PRODUCT, name: '' });
    const { result } = renderHook(() => useProductEdit('prod-001'));
    await waitFor(() => expect(result.current.initialLoading).toBe(false));

    // Act
    await act(async () => { await result.current.handleSubmit(); });

    // Assert
    expect(result.current.errors.name).toBeDefined();
    expect(mockUpdate).not.toHaveBeenCalled();
  });

  it('handleSubmit con description inválida setea error en campo description', async () => {
    // Arrange
    mockGetById.mockResolvedValue({ ...MOCK_PRODUCT, description: 'corta' });
    const { result } = renderHook(() => useProductEdit('prod-001'));
    await waitFor(() => expect(result.current.initialLoading).toBe(false));

    // Act
    await act(async () => { await result.current.handleSubmit(); });

    // Assert
    expect(result.current.errors.description).toBeDefined();
  });

  // -------------------------------------------------------------------------
  // handleSubmit — éxito
  // -------------------------------------------------------------------------
  it('handleSubmit con datos válidos llama updateProduct con payload correcto (sin id)', async () => {
    // Arrange
    mockGetById.mockResolvedValue(MOCK_PRODUCT);
    mockUpdate.mockResolvedValue(MOCK_PRODUCT);

    const { result } = renderHook(() => useProductEdit('prod-001'));
    await waitFor(() => expect(result.current.initialLoading).toBe(false));

    // Act
    await act(async () => { await result.current.handleSubmit(); });

    // Assert
    expect(mockUpdate).toHaveBeenCalledWith('prod-001', {
      name: 'Tarjeta de Crédito',
      description: 'Descripción del producto de crédito.',
      logo: 'https://example.com/logo.png',
      date_release: '2027-06-01',
      date_revision: '2028-06-01',
    });
    // El payload NO debe contener el id
    const callArgs = mockUpdate.mock.calls[0][1];
    expect(callArgs).not.toHaveProperty('id');
  });

  it('handleSubmit exitoso setea successMessage', async () => {
    // Arrange
    mockGetById.mockResolvedValue(MOCK_PRODUCT);
    mockUpdate.mockResolvedValue(MOCK_PRODUCT);

    const { result } = renderHook(() => useProductEdit('prod-001'));
    await waitFor(() => expect(result.current.initialLoading).toBe(false));

    // Act
    await act(async () => { await result.current.handleSubmit(); });

    // Assert
    expect(result.current.successMessage).toBe('¡Producto actualizado exitosamente!');
    expect(result.current.networkError).toBe('');
  });

  // -------------------------------------------------------------------------
  // handleSubmit — error de red
  // -------------------------------------------------------------------------
  it('handleSubmit setea networkError cuando updateProduct lanza', async () => {
    // Arrange
    mockGetById.mockResolvedValue(MOCK_PRODUCT);
    mockUpdate.mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useProductEdit('prod-001'));
    await waitFor(() => expect(result.current.initialLoading).toBe(false));

    // Act
    await act(async () => { await result.current.handleSubmit(); });

    // Assert
    expect(result.current.networkError).toBe('Error de conexión. Verifica tu red e intenta de nuevo.');
    expect(result.current.loading).toBe(false);
  });

  // -------------------------------------------------------------------------
  // initialError
  // -------------------------------------------------------------------------
  it('initialError se setea si getProductById lanza una excepción', async () => {
    // Arrange
    mockGetById.mockRejectedValue(new Error('Not found'));

    // Act
    const { result } = renderHook(() => useProductEdit('prod-001'));
    await waitFor(() => expect(result.current.initialLoading).toBe(false));

    // Assert
    expect(result.current.initialError).toBe('No se pudo cargar el producto. Verifica tu conexión.');
    expect(result.current.form).toBeNull();
  });

  it('initialError se setea si id está vacío sin llamar a la API', async () => {
    // Arrange & Act
    const { result } = renderHook(() => useProductEdit(''));
    await waitFor(() => expect(result.current.initialLoading).toBe(false));

    // Assert
    expect(result.current.initialError).toBe('ID de producto no encontrado.');
    expect(mockGetById).not.toHaveBeenCalled();
  });

  // -------------------------------------------------------------------------
  // loading flag
  // -------------------------------------------------------------------------
  it('loading se pone en true durante la actualización y en false al terminar', async () => {
    // Arrange
    mockGetById.mockResolvedValue(MOCK_PRODUCT);
    let resolveUpdate: (value: any) => void;
    mockUpdate.mockReturnValue(new Promise(resolve => { resolveUpdate = resolve; }));

    const { result } = renderHook(() => useProductEdit('prod-001'));
    await waitFor(() => expect(result.current.initialLoading).toBe(false));

    // Act — iniciar submit sin esperar
    act(() => { result.current.handleSubmit(); });
    await waitFor(() => expect(result.current.loading).toBe(true));

    // Cleanup — resolver para no dejar la promesa colgada
    await act(async () => { resolveUpdate(MOCK_PRODUCT); });
    await waitFor(() => expect(result.current.loading).toBe(false));
  });
});

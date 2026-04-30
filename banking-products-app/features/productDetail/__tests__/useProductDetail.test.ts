import { renderHook, act, waitFor } from '@testing-library/react-native';
import { useProductDetail } from '../useProductDetail';

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

const mockReplace = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({ replace: mockReplace, push: jest.fn(), back: jest.fn() }),
  useLocalSearchParams: () => ({ id: 'test-id' }),
}));

jest.mock('../../../entities/product/productApi', () => ({
  getProductById: jest.fn(),
  deleteProduct: jest.fn(),
}));

import { getProductById, deleteProduct } from '../../../entities/product/productApi';

const mockGetById = getProductById as jest.MockedFunction<typeof getProductById>;
const mockDelete = deleteProduct as jest.MockedFunction<typeof deleteProduct>;

const MOCK_PRODUCT = {
  id: 'prod-001',
  name: 'Tarjeta de Crédito',
  description: 'Una descripción del producto',
  logo: 'https://example.com/logo.png',
  date_release: '2026-01-01',
  date_revision: '2027-01-01',
};

describe('useProductDetail', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // -------------------------------------------------------------------------
  // Carga inicial
  // -------------------------------------------------------------------------
  it('inicia con loading: true y lo pone en false tras cargar el producto', async () => {
    // Arrange
    mockGetById.mockResolvedValue(MOCK_PRODUCT);

    // Act
    const { result } = renderHook(() => useProductDetail('prod-001'));
    expect(result.current.loading).toBe(true);

    // Assert
    await waitFor(() => expect(result.current.loading).toBe(false));
  });

  it('product contiene el producto tras una carga exitosa', async () => {
    // Arrange
    mockGetById.mockResolvedValue(MOCK_PRODUCT);

    // Act
    const { result } = renderHook(() => useProductDetail('prod-001'));
    await waitFor(() => expect(result.current.loading).toBe(false));

    // Assert
    expect(result.current.product).toEqual(MOCK_PRODUCT);
    expect(result.current.error).toBe('');
  });

  // -------------------------------------------------------------------------
  // Error de carga
  // -------------------------------------------------------------------------
  it('error se setea si getProductById lanza una excepción', async () => {
    // Arrange
    mockGetById.mockRejectedValue(new Error('Not found'));

    // Act
    const { result } = renderHook(() => useProductDetail('prod-001'));
    await waitFor(() => expect(result.current.loading).toBe(false));

    // Assert
    expect(result.current.error).toBe('No se pudo cargar el producto. Verifica tu conexión.');
    expect(result.current.product).toBeNull();
  });

  // -------------------------------------------------------------------------
  // ID vacío
  // -------------------------------------------------------------------------
  it('si id está vacío setea error "ID de producto no encontrado." sin llamar a la API', async () => {
    // Arrange & Act
    const { result } = renderHook(() => useProductDetail(''));

    // Assert
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBe('ID de producto no encontrado.');
    expect(mockGetById).not.toHaveBeenCalled();
  });

  // -------------------------------------------------------------------------
  // handleDelete — éxito
  // -------------------------------------------------------------------------
  it('handleDelete llama deleteProduct con el id correcto y navega a /products', async () => {
    // Arrange
    mockGetById.mockResolvedValue(MOCK_PRODUCT);
    mockDelete.mockResolvedValue(undefined);

    const { result } = renderHook(() => useProductDetail('prod-001'));
    await waitFor(() => expect(result.current.loading).toBe(false));

    // Act
    await act(async () => { await result.current.handleDelete(); });

    // Assert
    expect(mockDelete).toHaveBeenCalledWith('prod-001');
    expect(mockReplace).toHaveBeenCalledWith('/products');
  });

  // -------------------------------------------------------------------------
  // handleDelete — error
  // -------------------------------------------------------------------------
  it('handleDelete setea error si deleteProduct lanza una excepción', async () => {
    // Arrange
    mockGetById.mockResolvedValue(MOCK_PRODUCT);
    mockDelete.mockRejectedValue(new Error('Server error'));

    const { result } = renderHook(() => useProductDetail('prod-001'));
    await waitFor(() => expect(result.current.loading).toBe(false));

    // Act
    await act(async () => { await result.current.handleDelete(); });

    // Assert
    expect(result.current.error).toBe('No se pudo eliminar el producto. Intenta de nuevo.');
    expect(result.current.deleting).toBe(false);
    expect(mockReplace).not.toHaveBeenCalled();
  });

  // -------------------------------------------------------------------------
  // Estado de deleting
  // -------------------------------------------------------------------------
  it('deleting se pone en true durante la eliminación', async () => {
    // Arrange
    mockGetById.mockResolvedValue(MOCK_PRODUCT);
    let resolveDelete: () => void;
    mockDelete.mockReturnValue(new Promise<void>(resolve => { resolveDelete = resolve; }));

    const { result } = renderHook(() => useProductDetail('prod-001'));
    await waitFor(() => expect(result.current.loading).toBe(false));

    // Act — iniciar la eliminación sin esperar
    act(() => { result.current.handleDelete(); });
    await waitFor(() => expect(result.current.deleting).toBe(true));

    // Cleanup
    await act(async () => { resolveDelete(); });
  });
});

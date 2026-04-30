import { renderHook, act, waitFor } from '@testing-library/react-native';
import { useProductSearch } from '../useProductSearch';

// Mock de la API — sin llamadas HTTP reales
jest.mock('../../../entities/product/productApi', () => ({
  getProducts: jest.fn(),
}));

import { getProducts } from '../../../entities/product/productApi';

const mockGetProducts = getProducts as jest.MockedFunction<typeof getProducts>;

const PRODUCTS = [
  { id: '1', name: 'Tarjeta de Crédito', description: 'Desc 1', logo: 'http://a.com/logo.png', date_release: '2026-01-01', date_revision: '2027-01-01' },
  { id: '2', name: 'Cuenta de Ahorros', description: 'Desc 2', logo: 'http://b.com/logo.png', date_release: '2026-02-01', date_revision: '2027-02-01' },
  { id: '3', name: 'Tarjeta Débito', description: 'Desc 3', logo: 'http://c.com/logo.png', date_release: '2026-03-01', date_revision: '2027-03-01' },
];

describe('useProductSearch', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('inicia con loading: true y loading: false tras el fetch exitoso', async () => {
    // Arrange
    mockGetProducts.mockResolvedValue(PRODUCTS);

    // Act
    const { result } = renderHook(() => useProductSearch());
    expect(result.current.loading).toBe(true);

    // Assert
    await waitFor(() => expect(result.current.loading).toBe(false));
  });

  it('retorna los productos tras un fetch exitoso', async () => {
    // Arrange
    mockGetProducts.mockResolvedValue(PRODUCTS);

    // Act
    const { result } = renderHook(() => useProductSearch());
    await waitFor(() => expect(result.current.loading).toBe(false));

    // Assert
    expect(result.current.products).toHaveLength(3);
    expect(result.current.products[0].name).toBe('Tarjeta de Crédito');
  });

  it('filtra productos por nombre de forma case-insensitive', async () => {
    // Arrange
    mockGetProducts.mockResolvedValue(PRODUCTS);
    const { result } = renderHook(() => useProductSearch());
    await waitFor(() => expect(result.current.loading).toBe(false));

    // Act
    act(() => {
      result.current.setSearchTerm('tarjeta');
    });

    // Assert — "Tarjeta de Crédito" y "Tarjeta Débito" coinciden
    expect(result.current.filteredProducts).toHaveLength(2);
    expect(result.current.filteredProducts.map(p => p.name)).toContain('Tarjeta de Crédito');
    expect(result.current.filteredProducts.map(p => p.name)).toContain('Tarjeta Débito');
  });

  it('retorna array vacío cuando no hay coincidencia en el filtro', async () => {
    // Arrange
    mockGetProducts.mockResolvedValue(PRODUCTS);
    const { result } = renderHook(() => useProductSearch());
    await waitFor(() => expect(result.current.loading).toBe(false));

    // Act
    act(() => {
      result.current.setSearchTerm('xyz-inexistente');
    });

    // Assert
    expect(result.current.filteredProducts).toHaveLength(0);
  });

  it('retorna todos los productos cuando searchTerm se resetea a cadena vacía', async () => {
    // Arrange
    mockGetProducts.mockResolvedValue(PRODUCTS);
    const { result } = renderHook(() => useProductSearch());
    await waitFor(() => expect(result.current.loading).toBe(false));

    act(() => { result.current.setSearchTerm('tarjeta'); });
    expect(result.current.filteredProducts).toHaveLength(2);

    // Act — resetear el término
    act(() => { result.current.setSearchTerm(''); });

    // Assert
    expect(result.current.filteredProducts).toHaveLength(3);
  });

  it('filteredProducts.length refleja el conteo filtrado correctamente', async () => {
    // Arrange
    mockGetProducts.mockResolvedValue(PRODUCTS);
    const { result } = renderHook(() => useProductSearch());
    await waitFor(() => expect(result.current.loading).toBe(false));

    // Act
    act(() => { result.current.setSearchTerm('Cuenta'); });

    // Assert
    expect(result.current.filteredProducts).toHaveLength(1);
    expect(result.current.filteredProducts[0].name).toBe('Cuenta de Ahorros');
  });

  it('setea error si getProducts lanza una excepción', async () => {
    // Arrange
    mockGetProducts.mockRejectedValue(new Error('Network error'));

    // Act
    const { result } = renderHook(() => useProductSearch());
    await waitFor(() => expect(result.current.loading).toBe(false));

    // Assert
    expect(result.current.error).toBe('Error al cargar los productos. Intenta nuevamente.');
    expect(result.current.products).toHaveLength(0);
  });

  it('inicia con error: null y sin productos', () => {
    // Arrange
    mockGetProducts.mockReturnValue(new Promise(() => {})); // pendiente

    // Act
    const { result } = renderHook(() => useProductSearch());

    // Assert — estado inicial
    expect(result.current.error).toBeNull();
    expect(result.current.products).toHaveLength(0);
    expect(result.current.searchTerm).toBe('');
  });
});

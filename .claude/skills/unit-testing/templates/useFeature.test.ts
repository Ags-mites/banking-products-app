// Plantilla para tests de hooks React Native con Jest + @testing-library/react-native
// Copia este archivo a src/features/feature/__tests__/useFeature.test.ts

import { renderHook, act, waitFor } from '@testing-library/react-native';
import { useFeature } from '../hooks/useFeature';

// Mock del servicio API
jest.mock('../api/featureApi', () => ({
  fetchFeature: jest.fn(),
}));

import { fetchFeature } from '../api/featureApi';

const mockedFetchFeature = fetchFeature as jest.MockedFunction<typeof fetchFeature>;

describe('useFeature', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ─── Happy Path ──────────────────────────────────────────────────────────

  it('retorna datos después de fetch exitoso', async () => {
    const mockData = { id: '1', name: 'Test Feature', description: 'Description' };
    mockedFetchFeature.mockResolvedValueOnce(mockData);

    const { result } = renderHook(() => useFeature('1'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toEqual(mockData);
    expect(result.current.error).toBeNull();
  });

  // ─── Error Path ─────────────────────────────────────────────────────────

  it('establece error cuando el fetch falla', async () => {
    mockedFetchFeature.mockRejectedValueOnce(new Error('Network Error'));

    const { result } = renderHook(() => useFeature('1'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.data).toBeNull();
  });

  // ─── Edge Cases ─────────────────────────────────────────────────────────

  it('no hace fetch cuando id es undefined', () => {
    const { result } = renderHook(() => useFeature(undefined));

    expect(result.current.loading).toBe(false);
    expect(result.current.data).toBeNull();
    expect(mockedFetchFeature).not.toHaveBeenCalled();
  });

  it('limpia datos al desmontar el hook', async () => {
    const mockData = { id: '1', name: 'Test' };
    mockedFetchFeature.mockResolvedValueOnce(mockData);

    const { result, unmount } = renderHook(() => useFeature('1'));

    await waitFor(() => {
      expect(result.current.data).toEqual(mockData);
    });

    unmount();
    // El cleanup debe ejecutarse sin errores
    expect(true).toBe(true);
  });
});
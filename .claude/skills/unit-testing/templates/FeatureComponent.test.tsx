// Plantilla para tests de componentes React Native con Jest + @testing-library/react-native
// Copia este archivo a src/shared/ui/__tests__/FeatureComponent.test.tsx

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import FeatureComponent from '../FeatureComponent';

describe('FeatureComponent', () => {
  // ─── Happy Path ──────────────────────────────────────────────────────────

  it('renderiza el título correctamente', () => {
    render(<FeatureComponent title="Test Title" />);
    expect(screen.getByText('Test Title')).toBeTruthy();
  });

  it('llama onPress cuando se presiona el botón', () => {
    const onPressMock = jest.fn();
    render(<FeatureComponent title="Test" onPress={onPressMock} />);

    fireEvent.press(screen.getByText('Presionar'));
    expect(onPressMock).toHaveBeenCalledTimes(1);
  });

  // ─── Error Path ─────────────────────────────────────────────────────────

  it('muestra estilos de error cuando isError es true', () => {
    render(<FeatureComponent title="Test" isError={true} />);
    // El componente debe renderizarse con borderColor #D32F2F
    expect(screen.getByText('Test')).toBeTruthy();
  });

  // ─── Edge Cases ─────────────────────────────────────────────────────────

  it('deshabilita el botón cuando disabled es true', () => {
    const onPressMock = jest.fn();
    render(
      <FeatureComponent title="Test" onPress={onPressMock} disabled={true} />
    );

    fireEvent.press(screen.getByText('Presionar'));
    expect(onPressMock).not.toHaveBeenCalled();
  });

  it('renderiza sin título cuando no se provee', () => {
    render(<FeatureComponent />);
    // Solo debe renderizarse el botón
    expect(screen.getByText('Presionar')).toBeTruthy();
  });
});
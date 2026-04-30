import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ProductItem } from '../ProductItem';

// Mock expo-router (no lo usa ProductItem directamente, pero puede importarlo transitivamente)
jest.mock('expo-router', () => ({
  useRouter: () => ({ replace: jest.fn(), push: jest.fn(), back: jest.fn() }),
  useLocalSearchParams: () => ({}),
}));

// Mock ChevronRightIcon para aislar el componente del SVG
jest.mock('../../icons/ChevronRightIcon', () => ({
  ChevronRightIcon: () => null,
}));

const mockProduct = {
  id: 'prod-001',
  name: 'Tarjeta de Crédito',
  description: 'Descripción del producto',
  logo: 'https://example.com/logo.png',
  date_release: '2026-01-01',
  date_revision: '2027-01-01',
};

describe('ProductItem', () => {
  it('renderiza el nombre del producto', () => {
    // Arrange
    const onPress = jest.fn();

    // Act
    const { getByText } = render(<ProductItem product={mockProduct} onPress={onPress} />);

    // Assert
    expect(getByText('Tarjeta de Crédito')).toBeTruthy();
  });

  it('renderiza el ID del producto con prefijo "ID: "', () => {
    // Arrange
    const onPress = jest.fn();

    // Act
    const { getByText } = render(<ProductItem product={mockProduct} onPress={onPress} />);

    // Assert
    expect(getByText('ID: prod-001')).toBeTruthy();
  });

  it('llama onPress cuando se presiona el componente', () => {
    // Arrange
    const onPress = jest.fn();
    const { getByTestId } = render(<ProductItem product={mockProduct} onPress={onPress} />);

    // Act
    fireEvent.press(getByTestId('product-item'));

    // Assert
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('renderiza sin error con un producto que tiene solo campos obligatorios', () => {
    // Arrange
    const minimalProduct = { id: 'min-001', name: 'Mínimo Producto' };
    const onPress = jest.fn();

    // Act & Assert
    const { getByText } = render(<ProductItem product={minimalProduct} onPress={onPress} />);
    expect(getByText('Mínimo Producto')).toBeTruthy();
    expect(getByText('ID: min-001')).toBeTruthy();
  });
});

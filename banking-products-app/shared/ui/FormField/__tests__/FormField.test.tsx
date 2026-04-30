import React from 'react';
import { render } from '@testing-library/react-native';
import { FormField } from '../FormField';

// Mock maskDateInput para aislar la lógica de enmascaramiento
// Ruta relativa desde el test hasta shared/lib/productValidations
const mockMaskDateInput = jest.fn((value: string) => value);

jest.mock('../../../lib/productValidations', () => ({
  maskDateInput: (...args: [string, string]) => mockMaskDateInput(...args),
}));

describe('FormField', () => {
  const defaultProps = {
    label: 'Nombre del producto',
    value: 'Valor de prueba',
    onChangeText: jest.fn(),
  };

  it('renderiza el label con el texto correcto', () => {
    // Arrange & Act
    const { getByText } = render(<FormField {...defaultProps} />);

    // Assert
    expect(getByText('Nombre del producto')).toBeTruthy();
  });

  it('renderiza el TextInput con el valor dado', () => {
    // Arrange & Act
    const { getByDisplayValue } = render(<FormField {...defaultProps} />);

    // Assert
    expect(getByDisplayValue('Valor de prueba')).toBeTruthy();
  });

  it('muestra borde rojo y mensaje de error cuando error está definido', () => {
    // Arrange
    const error = 'Campo requerido';

    // Act
    const { getByText, getByDisplayValue } = render(
      <FormField {...defaultProps} error={error} />,
    );

    // Assert — el mensaje de error se muestra
    expect(getByText('Campo requerido')).toBeTruthy();

    // Assert — el input tiene borde de error (borderColor: '#D32F2F')
    const input = getByDisplayValue('Valor de prueba');
    const flatStyle = Array.isArray(input.props.style)
      ? Object.assign({}, ...input.props.style.filter(Boolean))
      : input.props.style;
    expect(flatStyle.borderColor).toBe('#D32F2F');
  });

  it('no muestra mensaje de error cuando no hay error', () => {
    // Arrange & Act
    const { queryByText } = render(<FormField {...defaultProps} />);

    // Assert
    expect(queryByText('Campo requerido')).toBeNull();
  });

  it('aplica backgroundColor de surface cuando editable es false', () => {
    // Arrange & Act
    const { getByDisplayValue } = render(
      <FormField {...defaultProps} editable={false} />,
    );

    // Assert — backgroundColor aplicado cuando editable=false
    const input = getByDisplayValue('Valor de prueba');
    const flatStyle = Array.isArray(input.props.style)
      ? Object.assign({}, ...input.props.style.filter(Boolean))
      : input.props.style;
    expect(flatStyle.backgroundColor).toBe('#F4F6F9');
  });

  it('el TextInput acepta editable=false como prop', () => {
    // Arrange & Act
    const { getByDisplayValue } = render(
      <FormField {...defaultProps} editable={false} />,
    );

    // Assert
    const input = getByDisplayValue('Valor de prueba');
    expect(input.props.editable).toBe(false);
  });

  it('renderiza un placeholder cuando se proporciona', () => {
    // Arrange & Act
    const { getByPlaceholderText } = render(
      <FormField {...defaultProps} value="" placeholder="Ingresa el nombre" />,
    );

    // Assert
    expect(getByPlaceholderText('Ingresa el nombre')).toBeTruthy();
  });

  it('en dateMode aplica keyboardType numeric y llama maskDateInput al cambiar texto', () => {
    const onChangeText = jest.fn();

    const { getByDisplayValue } = render(
      <FormField {...defaultProps} value="2026" onChangeText={onChangeText} dateMode />,
    );

    const input = getByDisplayValue('2026');
    expect(input.props.keyboardType).toBe('numeric');
    // Simula cambio de texto — mockMaskDateInput debe ser invocado
    input.props.onChangeText('20261');
    expect(mockMaskDateInput).toHaveBeenCalledWith('20261', '2026');
  });
});

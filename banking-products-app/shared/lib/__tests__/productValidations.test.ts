import {
  validateId,
  validateName,
  validateDescription,
  validateLogo,
  isValidReleaseDate,
  calculateReviewDate,
  maskDateInput,
  generateProductId,
} from '../productValidations';

// ---------------------------------------------------------------------------
// generateProductId
// ---------------------------------------------------------------------------
describe('generateProductId', () => {
  it('retorna un string numérico de 6 dígitos en el rango [100000, 999999]', () => {
    const id = generateProductId();
    expect(typeof id).toBe('string');
    const num = Number(id);
    expect(num).toBeGreaterThanOrEqual(100000);
    expect(num).toBeLessThanOrEqual(999999);
  });
});

// ---------------------------------------------------------------------------
// validateId
// ---------------------------------------------------------------------------
describe('validateId', () => {
  it('retorna error cuando el id es vacío', () => {
    expect(validateId('')).toBe('ID no válido');
  });

  it('retorna error cuando el id tiene menos de 3 caracteres', () => {
    expect(validateId('ab')).toBe('ID no válido');
  });

  it('retorna error cuando el id tiene exactamente 2 caracteres', () => {
    expect(validateId('12')).toBe('ID no válido');
  });

  it('retorna error cuando el id tiene más de 10 caracteres', () => {
    expect(validateId('12345678901')).toBe('ID no válido');
  });

  it('retorna undefined cuando el id tiene exactamente 3 caracteres (mínimo válido)', () => {
    expect(validateId('abc')).toBeUndefined();
  });

  it('retorna undefined cuando el id tiene exactamente 10 caracteres (máximo válido)', () => {
    expect(validateId('1234567890')).toBeUndefined();
  });

  it('retorna undefined cuando el id tiene longitud intermedia válida', () => {
    expect(validateId('abc123')).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// validateName
// ---------------------------------------------------------------------------
describe('validateName', () => {
  it('retorna error cuando el nombre es vacío', () => {
    expect(validateName('')).toBe('El nombre debe tener al menos 5 caracteres');
  });

  it('retorna error cuando el nombre tiene menos de 5 caracteres', () => {
    expect(validateName('abcd')).toBe('El nombre debe tener al menos 5 caracteres');
  });

  it('retorna error cuando el nombre tiene exactamente 4 caracteres', () => {
    expect(validateName('1234')).toBe('El nombre debe tener al menos 5 caracteres');
  });

  it('retorna error cuando el nombre supera 100 caracteres', () => {
    expect(validateName('a'.repeat(101))).toBe('El nombre no puede superar 100 caracteres');
  });

  it('retorna undefined cuando el nombre tiene exactamente 5 caracteres (mínimo válido)', () => {
    expect(validateName('abcde')).toBeUndefined();
  });

  it('retorna undefined cuando el nombre tiene exactamente 100 caracteres (máximo válido)', () => {
    expect(validateName('a'.repeat(100))).toBeUndefined();
  });

  it('retorna undefined cuando el nombre tiene longitud intermedia válida', () => {
    expect(validateName('Tarjeta de Crédito')).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// validateDescription
// ---------------------------------------------------------------------------
describe('validateDescription', () => {
  it('retorna error cuando la descripción es vacía', () => {
    expect(validateDescription('')).toBe('La descripción debe tener al menos 10 caracteres');
  });

  it('retorna error cuando la descripción tiene menos de 10 caracteres', () => {
    expect(validateDescription('corta')).toBe('La descripción debe tener al menos 10 caracteres');
  });

  it('retorna error cuando la descripción tiene exactamente 9 caracteres', () => {
    expect(validateDescription('123456789')).toBe('La descripción debe tener al menos 10 caracteres');
  });

  it('retorna error cuando la descripción supera 200 caracteres', () => {
    expect(validateDescription('a'.repeat(201))).toBe('La descripción no puede superar 200 caracteres');
  });

  it('retorna undefined cuando la descripción tiene exactamente 10 caracteres (mínimo válido)', () => {
    expect(validateDescription('1234567890')).toBeUndefined();
  });

  it('retorna undefined cuando la descripción tiene exactamente 200 caracteres (máximo válido)', () => {
    expect(validateDescription('a'.repeat(200))).toBeUndefined();
  });

  it('retorna undefined cuando la descripción tiene longitud intermedia válida', () => {
    expect(validateDescription('Una descripción válida para el producto.')).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// validateLogo
// ---------------------------------------------------------------------------
describe('validateLogo', () => {
  it('retorna error cuando la URL es vacía', () => {
    expect(validateLogo('')).toBe('URL de logo requerida');
  });

  it('retorna error cuando la URL no contiene "://"', () => {
    expect(validateLogo('http//sin-doble-slash.com')).toBe('URL de logo requerida');
  });

  it('retorna error cuando la URL es solo un texto sin protocolo', () => {
    expect(validateLogo('logo.png')).toBe('URL de logo requerida');
  });

  it('retorna undefined cuando la URL contiene "://" (http)', () => {
    expect(validateLogo('http://example.com/logo.png')).toBeUndefined();
  });

  it('retorna undefined cuando la URL contiene "://" (https)', () => {
    expect(validateLogo('https://example.com/logo.png')).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// isValidReleaseDate
// ---------------------------------------------------------------------------
describe('isValidReleaseDate', () => {
  const FIXED_TODAY = '2026-04-30';

  beforeEach(() => {
    // Fijamos la fecha del sistema a 2026-04-30
    jest.spyOn(Date.prototype, 'toISOString').mockReturnValue(`${FIXED_TODAY}T00:00:00.000Z`);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('retorna error cuando la fecha es vacía', () => {
    expect(isValidReleaseDate('')).toBe('Fecha de liberación debe ser igual o posterior a hoy');
  });

  it('retorna error cuando la fecha es anterior a hoy', () => {
    expect(isValidReleaseDate('2026-04-29')).toBe('Fecha de liberación debe ser igual o posterior a hoy');
  });

  it('retorna error cuando la fecha es un año atrás', () => {
    expect(isValidReleaseDate('2025-01-01')).toBe('Fecha de liberación debe ser igual o posterior a hoy');
  });

  it('retorna undefined cuando la fecha es hoy', () => {
    expect(isValidReleaseDate('2026-04-30')).toBeUndefined();
  });

  it('retorna undefined cuando la fecha es en el futuro', () => {
    expect(isValidReleaseDate('2027-01-15')).toBeUndefined();
  });

  it('retorna undefined cuando la fecha es mañana', () => {
    expect(isValidReleaseDate('2026-05-01')).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// calculateReviewDate
// ---------------------------------------------------------------------------
describe('calculateReviewDate', () => {
  it('calcula la fecha de revisión sumando exactamente 1 año', () => {
    expect(calculateReviewDate('2025-01-15')).toBe('2026-01-15');
  });

  it('calcula la fecha de revisión para un año bisiesto (2024-02-29 → 2025-03-01)', () => {
    // JS Date.setFullYear desborda a marzo cuando el día no existe en el año destino
    expect(calculateReviewDate('2024-02-29')).toBe('2025-03-01');
  });

  it('calcula correctamente para fin de año', () => {
    expect(calculateReviewDate('2025-12-31')).toBe('2026-12-31');
  });

  it('calcula correctamente para inicio de año', () => {
    expect(calculateReviewDate('2026-01-01')).toBe('2027-01-01');
  });
});

// ---------------------------------------------------------------------------
// maskDateInput
// ---------------------------------------------------------------------------
describe('maskDateInput', () => {
  it('no inserta guión cuando hay 4 o menos dígitos', () => {
    expect(maskDateInput('2026', '')).toBe('2026');
  });

  it('inserta guión después de posición 4 cuando hay 5 dígitos', () => {
    expect(maskDateInput('20261', '2026')).toBe('2026-1');
  });

  it('inserta segundo guión después de posición 7 cuando hay 7 dígitos', () => {
    expect(maskDateInput('20260430', '2026-04')).toBe('2026-04-30');
  });

  it('trunca el resultado a máximo 10 caracteres', () => {
    // Más de 8 dígitos → se trunca
    expect(maskDateInput('202604305', '2026-04-30')).toBe('2026-04-30');
  });

  it('elimina guión al final cuando se está borrando', () => {
    // Borrar el '0' de '2026-0' deja '2026-' → lo convierte en '2026'
    const result = maskDateInput('2026-', '2026-0');
    expect(result).toBe('2026');
  });

  it('retorna string vacío cuando el input es vacío', () => {
    expect(maskDateInput('', '2')).toBe('');
  });

  it('ignora caracteres no numéricos', () => {
    expect(maskDateInput('abcd', '')).toBe('');
  });
});

export function generateProductId(): string {
  return String(Math.floor(Math.random() * 900000) + 100000);
}

export function validateId(id: string): string | undefined {
  if (!id || id.length < 3 || id.length > 10) return 'ID no válido';
}

export function validateName(name: string): string | undefined {
  if (!name || name.length < 5) return 'El nombre debe tener al menos 5 caracteres';
  if (name.length > 100) return 'El nombre no puede superar 100 caracteres';
}

export function validateDescription(desc: string): string | undefined {
  if (!desc || desc.length < 10) return 'La descripción debe tener al menos 10 caracteres';
  if (desc.length > 200) return 'La descripción no puede superar 200 caracteres';
}

export function validateLogo(url: string): string | undefined {
  if (!url || !url.includes('://')) return 'URL de logo requerida';
}

export function isValidReleaseDate(date: string): string | undefined {
  if (!date) return 'Fecha de liberación debe ser igual o posterior a hoy';
  const today = new Date().toISOString().slice(0, 10);
  if (date < today) return 'Fecha de liberación debe ser igual o posterior a hoy';
}

export function calculateReviewDate(date: string): string {
  const d = new Date(date);
  d.setFullYear(d.getFullYear() + 1);
  return d.toISOString().slice(0, 10);
}

export function maskDateInput(value: string, prev: string): string {
  const isDeleting = value.length < prev.length;
  const digits = value.replace(/\D/g, '');
  let masked = digits;
  if (digits.length > 4) masked = `${digits.slice(0, 4)}-${digits.slice(4)}`;
  if (digits.length > 6) masked = `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6)}`;
  masked = masked.slice(0, 10);
  if (isDeleting && (masked.endsWith('-'))) masked = masked.slice(0, -1);
  return masked;
}

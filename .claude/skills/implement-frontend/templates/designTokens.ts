// src/shared/theme/designTokens.ts — Design Tokens para React Native
// Basado en .claude/docs/design-system.md
// Uso: import { colors, typography, spacing } from '../shared/theme/designTokens';

export const colors = {
  primary: '#0F265C',        // Azul Marino - textos principales, header, iconos
  accent: '#FFD200',          // Amarillo Banco - botón principal
  background: '#FFFFFF',      // Fondo de pantallas
  surface: '#F4F6F9',        // Inputs deshabilitados, botones secundarios
  border: '#E0E0E0',         // Bordes, divisores
  error: '#D32F2F',          // Error, peligro, botón eliminar
  textMuted: '#757575',      // Placeholders, descripciones
  white: '#FFFFFF',
  black: '#000000',
};

export const typography = {
  title: {
    fontSize: 20,
    fontWeight: 'bold' as const,
    color: colors.primary,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold' as const,
    color: colors.primary,
  },
  body: {
    fontSize: 16,
    fontWeight: 'normal' as const,
    color: colors.primary,
  },
  caption: {
    fontSize: 12,
    fontWeight: 'normal' as const,
    color: colors.error,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold' as const,
    color: colors.primary,
  },
  button: {
    fontSize: 16,
    fontWeight: 'bold' as const,
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
};

export const shadows = {
  card: {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
};
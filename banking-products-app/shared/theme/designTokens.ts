export const colors = {
  primary: '#0F265C',
  accent: '#FFD200',
  background: '#FFFFFF',
  appBackground: '#F5F5F5',
  surface: '#F4F6F9',
  border: '#E0E0E0',
  itemBorder: '#EEEEEE',
  error: '#D32F2F',
  textPrimary: '#2C3E50',
  textMuted: '#757575',
  textSecondary: '#888888',
  gray: '#e4eaf0',
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
  xxxl: 40,
};

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
};

export const fonts = {
  regular: 'NotoSerifToto_400Regular',
  semiBold: 'NotoSerifToto_600SemiBold',
  bold: 'NotoSerifToto_700Bold',
};

export const shadows = {
  card: {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  listCard: {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
};

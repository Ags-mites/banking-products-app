import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useProductDetail } from '../../features/productDetail/useProductDetail';
import { CashIcon } from '../../shared/ui/icons/CashIcon';
import { colors, fonts, spacing, borderRadius, shadows } from '../../shared/theme/designTokens';

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue} numberOfLines={2}>{value || '—'}</Text>
    </View>
  );
}

export function ProductDetailPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { product, loading, error, deleting, handleDelete } = useProductDetail(id ?? '');

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>

          <View style={styles.header}>
            <CashIcon size={20} color={colors.primary} />
            <Text style={styles.title}>BANCO</Text>
          </View>

          {loading && (
            <View style={styles.stateContainer}>
              <ActivityIndicator size="large" color={colors.primary} testID="loading-indicator" />
            </View>
          )}

          {!!error && !loading && (
            <View style={styles.stateContainer}>
              <Text style={styles.errorText} testID="error-message">{error}</Text>
            </View>
          )}

          {!!product && !loading && (
            <>
              <Text style={styles.idText} testID="product-id">ID: {product.id}</Text>

              <View style={styles.divider} />

              <View style={styles.section}>
                <DetailRow label="Nombre" value={product.name} />
                <DetailRow label="Descripción" value={product.description ?? ''} />
              </View>

              <View style={styles.logoSection}>
                <Text style={styles.logoLabel}>Logo</Text>
                {product.logo ? (
                  <Image
                    source={{ uri: product.logo }}
                    style={styles.logo}
                    resizeMode="cover"
                    testID="product-logo"
                  />
                ) : (
                  <View style={[styles.logo, styles.logoFallback]}>
                    <Text style={styles.logoFallbackText}>Sin logo</Text>
                  </View>
                )}
              </View>

              <View style={styles.section}>
                <DetailRow label="Fecha Liberación" value={product.date_release ?? ''} />
                <DetailRow label="Fecha Revisión" value={product.date_revision ?? ''} />
              </View>

              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => router.push(`/products/${product.id}/edit`)}
                  testID="edit-button"
                >
                  <Text style={styles.editButtonText}>Editar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.deleteButton, deleting && styles.buttonDisabled]}
                  onPress={handleDelete}
                  disabled={deleting}
                  testID="delete-button"
                >
                  {deleting ? (
                    <ActivityIndicator size="small" color={colors.white} />
                  ) : (
                    <Text style={styles.deleteButtonText}>Eliminar</Text>
                  )}
                </TouchableOpacity>
              </View>
            </>
          )}

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.appBackground,
  },
  scrollContent: {
    flexGrow: 1,
    padding: spacing.xl,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    ...shadows.card,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: -spacing.xl,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.md,
    marginBottom: spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: 17,
    fontFamily: fonts.bold,
    color: colors.primary,
    marginLeft: spacing.sm,
  },
  stateContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xxl,
    minHeight: 120,
  },
  errorText: {
    fontSize: 14,
    color: colors.error,
    textAlign: 'center',
  },
  idText: {
    fontSize: 24,
    fontFamily: fonts.bold,
    color: colors.primary,
    marginTop: spacing.xl,
    marginBottom: spacing.xl,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginHorizontal: -spacing.xl,
    marginBottom: spacing.xxl,
  },
  section: {
    marginBottom: spacing.xxl,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.itemBorder,
    marginBottom: spacing.sm,
  },
  rowLabel: {
    fontSize: 14,
    fontFamily: fonts.bold,
    color: colors.primary,
    flexShrink: 0,
  },
  rowValue: {
    fontSize: 14,
    color: colors.textPrimary,
    textAlign: 'right',
    flexShrink: 1,
    marginLeft: spacing.md,
  },
  logoSection: {
    marginBottom: spacing.xxl,
  },
  logoLabel: {
    fontSize: 14,
    fontFamily: fonts.bold,
    color: colors.primary,
    marginBottom: spacing.sm,
  },
  logo: {
    width: '100%',
    height: 160,
    borderRadius: borderRadius.md,
  },
  logoFallback: {
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoFallbackText: {
    fontSize: 14,
    color: colors.textMuted,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  editButton: {
    flex: 1,
    backgroundColor: colors.gray,
    borderRadius: borderRadius.sm,
    paddingVertical: spacing.lg,
    alignItems: 'center',
  },
  editButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
  },
  deleteButton: {
    flex: 1,
    backgroundColor: colors.error,
    borderRadius: borderRadius.sm,
    paddingVertical: spacing.lg,
    alignItems: 'center',
  },
  deleteButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.white,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});

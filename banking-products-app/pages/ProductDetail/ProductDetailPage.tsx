import {
  View,
  Text,
  Image,
  Modal,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useState } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useProductDetail } from '../../features/productDetail/useProductDetail';
import { CashIcon } from '../../shared/ui/icons/CashIcon';
import { CloseIcon } from '../../shared/ui/icons/CloseIcon';
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
  const [imgError, setImgError] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
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
            <Text style={styles.descText} testID="product-description">
              Información extra:
            </Text>

            <View style={styles.container}>
              <View style={styles.section}>
                <DetailRow label="Nombre" value={product.name} />
                <DetailRow label="Descripción" value={product.description ?? ''} />
              </View>

              <View style={styles.logoSection}>
                <Text style={styles.logoLabel}>Logo</Text>
                {product.logo && !imgError ? (
                  <Image
                    source={{ uri: product.logo }}
                    style={styles.logo}
                    resizeMode="cover"
                    testID="product-logo"
                    onError={() => setImgError(true)}
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
                onPress={() => setConfirmVisible(true)}
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
      </ScrollView>

      <Modal
        visible={confirmVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setConfirmVisible(false)}
        testID="confirm-modal"
      >
        <View style={styles.overlay}>
          <View style={styles.dialog}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setConfirmVisible(false)}
              testID="close-modal-button"
            >
              <CloseIcon size={20} color={colors.primary} />
            </TouchableOpacity>
            <View style={styles.separator} />
            <Text style={styles.dialogMessage}>
              ¿Estás seguro de eliminar el producto{'\n'}
              <Text style={styles.dialogProductName}>{product?.name}</Text>?
            </Text>
            <View style={styles.separator} />
            <View style={styles.dialogButtons}>
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={() => {
                  setConfirmVisible(false);
                  handleDelete();
                }}
                testID="confirm-delete-button"
              >
                <Text style={styles.confirmButtonText}>Confirmar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setConfirmVisible(false)}
                testID="cancel-delete-button"
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>

          </View>
        </View>
      </Modal>
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
    color: colors.textPrimary,
    marginTop: spacing.xl,
    marginBottom: spacing.xs,
  },
  descText: {
    fontSize: 14,
    color: colors.textPrimary,
    marginBottom: spacing.xxxl,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginHorizontal: -spacing.xl,
    marginBottom: spacing.xxl,
  },
  container: {
    padding: spacing.lg,
    marginTop: spacing.lg,
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
    fontWeight: 'bold',
    color: colors.textPrimary,
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
    fontWeight: 'bold',
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
    flexDirection: 'column',
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
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  dialog: {
    backgroundColor: colors.white,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    padding: spacing.xl,
    paddingBottom: spacing.xxxl,
    width: '100%',
    ...shadows.card,
  },
  dialogMessage: {
    fontSize: 18,
    textAlign: 'center',
    color: colors.textPrimary,
    lineHeight: 22,
    marginBottom: spacing.xxl,
  },
  dialogProductName: {
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  dialogButtons: {
    flexDirection: 'column',
    gap: spacing.md,
  },
  separator: {
    height: 1,
    backgroundColor: colors.itemBorder,
    marginHorizontal: -spacing.lg,
    marginBottom: spacing.xxl,
  },
  closeButton: {
    width: 32,
    height: 32,
    marginLeft: 'auto',
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
  },
  cancelButton: {
    backgroundColor: colors.gray,
    borderRadius: borderRadius.sm,
    paddingVertical: spacing.lg,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.primary,
  },
  confirmButton: {
    backgroundColor: colors.accent,
    borderRadius: borderRadius.sm,
    paddingVertical: spacing.lg,
    alignItems: 'center',
  },
  confirmButtonText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.primary,
  },
});

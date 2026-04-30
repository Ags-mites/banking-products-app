import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useProductEdit } from '../../features/productEdit/useProductEdit';
import { FormField } from '../../shared/ui/FormField/FormField';
import { CashIcon } from '../../shared/ui/icons/CashIcon';
import { colors, fonts, spacing, borderRadius, shadows } from '../../shared/theme/designTokens';

export function ProductEditPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const {
    form,
    errors,
    networkError,
    successMessage,
    loading,
    initialLoading,
    initialError,
    handleChange,
    handleSubmit,
    handleReset,
  } = useProductEdit(id ?? '');

  return (
    <SafeAreaView style={styles.screen}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >

            <View style={styles.header}>
              <CashIcon size={20} color={colors.primary} />
              <Text style={styles.title}>BANCO</Text>
            </View>

            {initialLoading && (
              <View style={styles.stateContainer}>
                <ActivityIndicator size="large" color={colors.primary} testID="loading-indicator" />
              </View>
            )}

            {!!initialError && !initialLoading && (
              <View style={styles.stateContainer}>
                <Text style={styles.errorText} testID="initial-error">{initialError}</Text>
              </View>
            )}

            {!!form && !initialLoading && (
              <>
                <FormField
                  label="ID"
                  value={form.id}
                  onChangeText={() => {}}
                  editable={false}
                  testID="field-id"
                />

                <FormField
                  label="Nombre"
                  value={form.name}
                  onChangeText={v => handleChange('name', v)}
                  error={errors.name}
                  placeholder="Ej: Tarjeta de Crédito"
                  testID="field-name"
                />

                <FormField
                  label="Descripción"
                  value={form.description}
                  onChangeText={v => handleChange('description', v)}
                  error={errors.description}
                  placeholder="Ej: Tarjeta de consumo bajo línea de crédito"
                  testID="field-description"
                />

                <FormField
                  label="Logo"
                  value={form.logo}
                  onChangeText={v => handleChange('logo', v)}
                  error={errors.logo}
                  placeholder="https://..."
                  keyboardType="url"
                  testID="field-logo"
                />

                <FormField
                  label="Fecha de Liberación"
                  value={form.date_release}
                  onChangeText={v => handleChange('date_release', v)}
                  error={errors.date_release}
                  placeholder="YYYY-MM-DD"
                  dateMode
                  testID="field-date-release"
                />

                <FormField
                  label="Fecha de Revisión"
                  value={form.date_revision}
                  onChangeText={() => {}}
                  editable={false}
                  placeholder="YYYY-MM-DD"
                  testID="field-date-revision"
                />

                {!!successMessage && (
                  <View style={styles.successBanner} testID="success-message">
                    <Text style={styles.successText}>{successMessage}</Text>
                    <Text style={styles.successSub}>Regresando al detalle...</Text>
                  </View>
                )}

                {!!networkError && (
                  <Text style={styles.networkError} testID="network-error">{networkError}</Text>
                )}

                <View style={styles.buttonCol}>
                  <TouchableOpacity
                    style={[styles.submitButton, loading && styles.buttonDisabled]}
                    onPress={handleSubmit}
                    disabled={loading}
                    testID="submit-button"
                  >
                    {loading ? (
                      <ActivityIndicator size="small" color={colors.primary} />
                    ) : (
                      <Text style={styles.submitButtonText}>Enviar</Text>
                    )}
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.resetButton}
                    onPress={handleReset}
                    testID="reset-button"
                  >
                    <Text style={styles.resetButtonText}>Reiniciar</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.white,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: spacing.xl,
  },
  card: {
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
    marginBottom: spacing.xxxl,
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
  successBanner: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.sm,
    padding: spacing.lg,
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  successText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.white,
  },
  successSub: {
    fontSize: 12,
    color: colors.white,
    opacity: 0.8,
    marginTop: spacing.xs,
  },
  networkError: {
    fontSize: 14,
    color: colors.error,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  buttonCol: {
    flexDirection: 'column',
    gap: spacing.md,
    marginTop: spacing.xxl,
  },
  resetButton: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.sm,
    paddingVertical: spacing.lg,
    alignItems: 'center',
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
  },
  submitButton: {
    flex: 1,
    backgroundColor: colors.accent,
    borderRadius: borderRadius.sm,
    paddingVertical: spacing.lg,
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});

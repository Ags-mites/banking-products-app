import { View, Text, TextInput, StyleSheet, KeyboardTypeOptions } from 'react-native';
import { colors, spacing, borderRadius } from '../../theme/designTokens';
import { maskDateInput } from '../../lib/productValidations';

type Props = {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  error?: string;
  placeholder?: string;
  editable?: boolean;
  keyboardType?: KeyboardTypeOptions;
  dateMode?: boolean;
  testID?: string;
};

export function FormField({
  label,
  value,
  onChangeText,
  error,
  placeholder,
  editable = true,
  keyboardType,
  dateMode = false,
  testID,
}: Props) {
  const handleChange = (text: string) => {
    if (dateMode) {
      onChangeText(maskDateInput(text, value));
    } else {
      onChangeText(text);
    }
  };

  return (
    <View>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[
          styles.input,
          !editable && styles.inputDisabled,
          !!error && styles.inputError,
          !error && { marginBottom: spacing.lg },
        ]}
        value={value}
        onChangeText={handleChange}
        placeholder={placeholder}
        placeholderTextColor={colors.textSecondary}
        editable={editable}
        keyboardType={dateMode ? 'numeric' : keyboardType}
        autoCapitalize="none"
        autoCorrect={false}
        testID={testID}
      />
      {!!error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  input: {
    height: 44,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing.md,
    fontSize: 15,
    color: colors.textPrimary,
    backgroundColor: colors.white,
    marginBottom: spacing.xs,
  },
  inputDisabled: {
    backgroundColor: colors.surface,
  },
  inputError: {
    borderColor: colors.error,
  },
  errorText: {
    fontSize: 12,
    color: colors.error,
    marginBottom: spacing.lg,
  },
});

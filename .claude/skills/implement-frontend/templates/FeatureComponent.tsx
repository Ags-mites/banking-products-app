// src/shared/ui/FeatureComponent.tsx — Componente atómico React Native
// Lee .claude/docs/design-system.md antes de crear estilos

import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

interface FeatureComponentProps {
  title?: string;
  subtitle?: string;
  onPress?: () => void;
  isError?: boolean;
  disabled?: boolean;
}

export default function FeatureComponent({
  title,
  subtitle,
  onPress,
  isError = false,
  disabled = false,
}: FeatureComponentProps) {
  return (
    <View style={[styles.container, isError && styles.containerError]}>
      {title && <Text style={styles.title}>{title}</Text>}
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      {onPress && (
        <Pressable
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed,
            disabled && styles.buttonDisabled,
          ]}
          onPress={onPress}
          disabled={disabled}
        >
          <Text style={[styles.buttonText, disabled && styles.buttonTextDisabled]}>
            Presionar
          </Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 4,
    padding: 16,
    marginBottom: 12,
  },
  containerError: {
    borderColor: '#D32F2F',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0F265C',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#FFD200',
    borderRadius: 4,
    paddingVertical: 16,
    alignItems: 'center',
  },
  buttonPressed: {
    opacity: 0.8,
  },
  buttonDisabled: {
    backgroundColor: '#F4F6F9',
  },
  buttonText: {
    color: '#0F265C',
    fontWeight: 'bold',
    fontSize: 16,
  },
  buttonTextDisabled: {
    color: '#757575',
  },
});
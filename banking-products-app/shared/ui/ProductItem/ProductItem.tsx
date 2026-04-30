import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Product } from '../../../entities/product/product.types';
import { colors, spacing } from '../../theme/designTokens';

type Props = {
  product: Product;
  onPress: () => void;
};

export function ProductItem({ product, onPress }: Props) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} testID="product-item">
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {product.name}
        </Text>
        <Text style={styles.id} numberOfLines={1}>
          {product.id}
        </Text>
      </View>
      <Text style={styles.chevron}>{'>'}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingHorizontal: spacing.lg,
    paddingVertical: 14,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  id: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  chevron: {
    fontSize: 13,
    color: '#CCCCCC',
    marginLeft: spacing.sm,
  },
});

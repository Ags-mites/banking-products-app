import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Product } from '../../../entities/product/product.types';
import { ChevronRightIcon } from '../icons/ChevronRightIcon';
import { colors, spacing } from '../../theme/designTokens';

type Props = {
  product: Product;
  onPress: () => void;
};

export function ProductItem({ product, onPress }: Props) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} testID="product-item">
      <View style={styles.content}>
        <View style={styles.info}>
          <Text style={styles.name} numberOfLines={1}>
            {product.name}
          </Text>
          <Text style={styles.id} numberOfLines={1}>
            ID: {product.id}
          </Text>
        </View>
        <ChevronRightIcon size={18} color="#CCCCCC" />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: 14,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.primary,
  },
  id: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
});

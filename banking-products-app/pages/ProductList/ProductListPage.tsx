import {
  View,
  Text,
  TextInput,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useProductSearch } from '../../features/productSearch/useProductSearch';
import { ProductItem } from '../../shared/ui/ProductItem/ProductItem';
import { colors, typography, spacing, borderRadius, shadows } from '../../shared/theme/designTokens';
import { Product } from '../../entities/product/product.types';

export function ProductListPage() {
  const router = useRouter();
  const { filteredProducts, searchTerm, setSearchTerm, loading, error } = useProductSearch();

  const handleItemPress = (product: Product) => {
    router.push({ pathname: '/products/[id]', params: { id: product.id } });
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.outerContainer}>
        <View style={styles.card}>

          {/* Header */}
          <View style={styles.header}>
            <Ionicons name="business-outline" size={18} color={colors.primary} style={styles.headerIcon} />
            <Text style={styles.title}>BANCO</Text>
          </View>

          {/* Search */}
          <TextInput
            style={styles.searchInput}
            placeholder="Search..."
            placeholderTextColor={colors.textSecondary}
            value={searchTerm}
            onChangeText={setSearchTerm}
            testID="search-input"
            autoCapitalize="none"
            autoCorrect={false}
          />

          {/* Counter */}
          <Text style={styles.counter} testID="product-counter">
            {filteredProducts.length} Productos
          </Text>

          {/* List card */}
          <View style={styles.listCard}>
            {loading ? (
              <View style={styles.stateContainer}>
                <ActivityIndicator size="large" color={colors.primary} testID="loading-indicator" />
              </View>
            ) : error ? (
              <View style={styles.stateContainer}>
                <Text style={styles.errorText} testID="error-message">{error}</Text>
              </View>
            ) : (
              <FlatList
                data={filteredProducts}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <ProductItem product={item} onPress={() => handleItemPress(item)} />
                )}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
                ListEmptyComponent={
                  <View style={styles.stateContainer}>
                    <Text style={styles.emptyText} testID="empty-state">
                      No se encontraron productos
                    </Text>
                  </View>
                }
                testID="product-list"
              />
            )}
          </View>

          {/* Add button */}
          <TouchableOpacity style={styles.addButton} onPress={() => {}} testID="add-button">
            <Text style={styles.addButtonText}>Agregar</Text>
          </TouchableOpacity>

        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.appBackground,
  },
  outerContainer: {
    flex: 1,
    padding: spacing.lg,
  },
  card: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    ...shadows.card,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  headerIcon: {
    marginRight: spacing.sm,
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.primary,
  },
  searchInput: {
    height: 44,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    fontSize: 15,
    color: colors.textPrimary,
    backgroundColor: colors.white,
    marginBottom: spacing.xl,
  },
  counter: {
    fontSize: 13,
    color: colors.textMuted,
    marginBottom: spacing.sm,
  },
  listCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    ...shadows.listCard,
  },
  separator: {
    height: 1,
    backgroundColor: colors.itemBorder,
    marginHorizontal: spacing.lg,
  },
  stateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xxl,
    minHeight: 120,
  },
  errorText: {
    ...typography.caption,
    fontSize: 14,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
  },
  addButton: {
    backgroundColor: colors.accent,
    borderRadius: borderRadius.sm,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
  },
});

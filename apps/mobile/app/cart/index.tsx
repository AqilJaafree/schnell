import { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Fonts, FontSizes, Spacing, BorderRadius } from '../../constants/theme';
import Button from '../../components/Button';
import Card from '../../components/Card';
import { DUMMY_CART, type CartItem } from '../../data/dummy';

export default function CartScreen() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>(DUMMY_CART);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.clothingItem.price * item.quantity,
    0,
  );

  const handleRemoveItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const renderCartItem = ({ item }: { item: CartItem }) => (
    <Card style={styles.cartItemCard}>
      <View style={styles.cartItemRow}>
        <View
          style={[
            styles.itemColorBox,
            { backgroundColor: item.clothingItem.color },
          ]}
        >
          <Ionicons name="shirt-outline" size={20} color={Colors.surface} />
        </View>
        <View style={styles.itemDetails}>
          <Text style={styles.itemName} numberOfLines={1}>
            {item.clothingItem.name}
          </Text>
          <Text style={styles.itemMeta}>
            {item.clothingItem.brand} &middot; Size {item.size}
          </Text>
          <View style={styles.itemBottomRow}>
            <Text style={styles.itemPrice}>
              ${item.clothingItem.price.toFixed(2)}
            </Text>
            <Text style={styles.itemQty}>Qty: {item.quantity}</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => handleRemoveItem(item.id)}
          hitSlop={8}
        >
          <Ionicons name="close-circle" size={22} color={Colors.mutedText} />
        </TouchableOpacity>
      </View>
    </Card>
  );

  if (cartItems.length === 0) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} hitSlop={8}>
            <Ionicons name="arrow-back" size={24} color={Colors.primaryText} />
          </TouchableOpacity>
          <Text style={styles.title}>Cart</Text>
          <View style={styles.headerSpacer} />
        </View>
        <View style={styles.emptyState}>
          <Ionicons name="cart-outline" size={64} color={Colors.border} />
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptySubtext}>
            Browse our collection and add items you love
          </Text>
          <Button
            title="Browse Collection"
            onPress={() => router.replace('/(tabs)/search')}
            style={styles.browseButton}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={8}>
          <Ionicons name="arrow-back" size={24} color={Colors.primaryText} />
        </TouchableOpacity>
        <Text style={styles.title}>Cart ({cartItems.length})</Text>
        <View style={styles.headerSpacer} />
      </View>

      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.id}
        renderItem={renderCartItem}
        contentContainerStyle={styles.listContent}
        ListFooterComponent={
          <View style={styles.footer}>
            <Card style={styles.summaryCard}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Subtotal</Text>
                <Text style={styles.summaryValue}>${subtotal.toFixed(2)}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Shipping</Text>
                <Text style={styles.summaryValueMuted}>Calculated at checkout</Text>
              </View>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryRow}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>${subtotal.toFixed(2)}</Text>
              </View>
            </Card>

            <Button
              title="Proceed to Checkout"
              onPress={() => router.push('/cart/checkout')}
              style={styles.checkoutButton}
            />
            <TouchableOpacity
              style={styles.continueShoppingLink}
              onPress={() => router.back()}
            >
              <Text style={styles.continueShoppingText}>Continue Shopping</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  title: {
    fontFamily: Fonts.dmSerifDisplay,
    fontSize: FontSizes.xl,
    color: Colors.primaryText,
    flex: 1,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 24,
  },
  listContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  cartItemCard: {
    marginBottom: Spacing.md,
    padding: Spacing.md,
  },
  cartItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemColorBox: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemDetails: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  itemName: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
    color: Colors.primaryText,
  },
  itemMeta: {
    fontSize: FontSizes.xs,
    color: Colors.mutedText,
    marginTop: 2,
  },
  itemBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing.xs,
  },
  itemPrice: {
    fontSize: FontSizes.sm,
    fontWeight: '700',
    color: Colors.primaryText,
  },
  itemQty: {
    fontSize: FontSizes.xs,
    color: Colors.secondaryText,
  },
  removeButton: {
    marginLeft: Spacing.sm,
    padding: Spacing.xs,
  },
  footer: {
    marginTop: Spacing.md,
  },
  summaryCard: {
    marginBottom: Spacing.lg,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  summaryLabel: {
    fontSize: FontSizes.sm,
    color: Colors.secondaryText,
  },
  summaryValue: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
    color: Colors.primaryText,
  },
  summaryValueMuted: {
    fontSize: FontSizes.sm,
    color: Colors.mutedText,
  },
  summaryDivider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: Spacing.sm,
  },
  totalLabel: {
    fontSize: FontSizes.md,
    fontWeight: '700',
    color: Colors.primaryText,
  },
  totalValue: {
    fontSize: FontSizes.md,
    fontWeight: '700',
    color: Colors.primaryText,
  },
  checkoutButton: {
    marginBottom: Spacing.md,
  },
  continueShoppingLink: {
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  continueShoppingText: {
    fontSize: FontSizes.sm,
    color: Colors.secondaryText,
    textDecorationLine: 'underline',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
  },
  emptyTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '600',
    color: Colors.primaryText,
    marginTop: Spacing.lg,
  },
  emptySubtext: {
    fontSize: FontSizes.sm,
    color: Colors.mutedText,
    marginTop: Spacing.xs,
    textAlign: 'center',
  },
  browseButton: {
    marginTop: Spacing.xl,
    paddingHorizontal: Spacing.xxl,
  },
});

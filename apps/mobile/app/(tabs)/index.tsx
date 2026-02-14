import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Fonts, FontSizes, Spacing, BorderRadius } from '../../constants/theme';
import AvatarPlaceholder from '../../components/AvatarPlaceholder';
import ClothesCard from '../../components/ClothesCard';
import { DUMMY_CLOTHES, DUMMY_CART, DUMMY_USER } from '../../data/dummy';

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export default function HomeScreen() {
  const router = useRouter();
  const greeting = getGreeting();
  const cartCount = DUMMY_CART.length;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <FlatList
        data={DUMMY_CLOTHES}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.gridRow}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View>
            {/* Header with greeting and cart */}
            <View style={styles.header}>
              <View>
                <Text style={styles.greeting}>{greeting},</Text>
                <Text style={styles.userName}>{DUMMY_USER.name}</Text>
              </View>
              <TouchableOpacity style={styles.cartButton} activeOpacity={0.7} onPress={() => router.push('/cart')}>
                <Ionicons name="cart-outline" size={24} color={Colors.primaryText} />
                {cartCount > 0 && (
                  <View style={styles.cartBadge}>
                    <Text style={styles.cartBadgeText}>{cartCount}</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>

            {/* Avatar Section */}
            <View style={styles.avatarSection}>
              <AvatarPlaceholder size={100} />
            </View>

            {/* Section Title */}
            <Text style={styles.sectionTitle}>Recommended for you</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.gridItem}>
            <ClothesCard item={item} />
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  listContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  greeting: {
    fontSize: FontSizes.md,
    color: Colors.secondaryText,
  },
  userName: {
    fontFamily: Fonts.dmSerifDisplay,
    fontSize: FontSizes.xl,
    color: Colors.primaryText,
  },
  cartButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  cartBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: Colors.error,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  cartBadgeText: {
    color: Colors.white,
    fontSize: 11,
    fontWeight: '700',
  },
  avatarSection: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    marginBottom: Spacing.lg,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
  },
  sectionTitle: {
    fontFamily: Fonts.dmSerifDisplay,
    fontSize: FontSizes.lg,
    color: Colors.primaryText,
    marginBottom: Spacing.lg,
  },
  gridRow: {
    justifyContent: 'space-between',
  },
  gridItem: {
    width: '48%',
    marginBottom: Spacing.md,
  },
});

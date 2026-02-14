import { useState, useMemo } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { usePrivy } from '@privy-io/expo';
import { Colors, Fonts, FontSizes, Spacing, BorderRadius } from '../../constants/theme';
import Avatar3DScene from '../../components/Avatar3DScene';
import AvatarErrorBoundary from '../../components/AvatarErrorBoundary';
import AvatarPlaceholder from '../../components/AvatarPlaceholder';
import ClothesCard from '../../components/ClothesCard';
import { useAvatarStorage } from '../../hooks/useAvatarStorage';
import { DUMMY_CLOTHES, DUMMY_CART, DUMMY_USER } from '../../data/dummy';

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export default function HomeScreen() {
  const router = useRouter();
  const { user } = usePrivy();
  const { avatarUri, isLoading: avatarLoading } = useAvatarStorage(user?.id);
  const greeting = getGreeting();
  const cartCount = DUMMY_CART.length;

  const tops = useMemo(() => DUMMY_CLOTHES.filter((c) => c.category === 'tops'), []);
  const bottoms = useMemo(() => DUMMY_CLOTHES.filter((c) => c.category === 'bottoms'), []);

  const [topIndex, setTopIndex] = useState(0);
  const [bottomIndex, setBottomIndex] = useState(0);

  const currentTop = tops[topIndex];
  const currentBottom = bottoms[bottomIndex];

  const cycleTop = (direction: 1 | -1) => {
    setTopIndex((prev) => (prev + direction + tops.length) % tops.length);
  };

  const cycleBottom = (direction: 1 | -1) => {
    setBottomIndex((prev) => (prev + direction + bottoms.length) % bottoms.length);
  };

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

            {/* Avatar Section with Clothes Mixing */}
            <View style={styles.avatarSection}>
              {avatarLoading ? (
                <AvatarPlaceholder size={100} />
              ) : avatarUri ? (
                <>
                  <View style={styles.avatarRow}>
                    {/* Left arrows */}
                    <View style={styles.arrowColumn}>
                      <TouchableOpacity
                        style={styles.arrowButton}
                        onPress={() => cycleTop(-1)}
                        activeOpacity={0.7}
                      >
                        <Ionicons name="chevron-back" size={20} color={Colors.primaryText} />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.arrowButton}
                        onPress={() => cycleBottom(-1)}
                        activeOpacity={0.7}
                      >
                        <Ionicons name="chevron-back" size={20} color={Colors.primaryText} />
                      </TouchableOpacity>
                    </View>

                    {/* 3D Avatar display */}
                    <AvatarErrorBoundary avatarUri={avatarUri} fallbackWidth={220} fallbackHeight={340}>
                      <Avatar3DScene
                        avatarUri={avatarUri}
                        topImage={currentTop?.image}
                        bottomImage={currentBottom?.image}
                        width={220}
                        height={340}
                      />
                    </AvatarErrorBoundary>

                    {/* Right arrows */}
                    <View style={styles.arrowColumn}>
                      <TouchableOpacity
                        style={styles.arrowButton}
                        onPress={() => cycleTop(1)}
                        activeOpacity={0.7}
                      >
                        <Ionicons name="chevron-forward" size={20} color={Colors.primaryText} />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.arrowButton}
                        onPress={() => cycleBottom(1)}
                        activeOpacity={0.7}
                      >
                        <Ionicons name="chevron-forward" size={20} color={Colors.primaryText} />
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* Outfit labels */}
                  <View style={styles.outfitInfo}>
                    <Text style={styles.outfitLabel}>{currentTop?.name}</Text>
                    <Text style={styles.outfitDivider}>|</Text>
                    <Text style={styles.outfitLabel}>{currentBottom?.name}</Text>
                  </View>
                </>
              ) : (
                <AvatarPlaceholder size={100} />
              )}
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
    paddingVertical: Spacing.lg,
    marginBottom: Spacing.lg,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowColumn: {
    justifyContent: 'space-around',
    height: 300,
    paddingVertical: Spacing.xxl,
  },
  arrowButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  outfitInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Spacing.md,
    gap: Spacing.sm,
  },
  outfitLabel: {
    fontSize: FontSizes.xs,
    color: Colors.secondaryText,
    fontWeight: '500',
  },
  outfitDivider: {
    fontSize: FontSizes.xs,
    color: Colors.mutedText,
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

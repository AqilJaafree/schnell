import { useMemo } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Fonts, FontSizes, Spacing } from '../../constants/theme';
import ClothesCard from '../../components/ClothesCard';
import { DUMMY_CLOTHES, SUGGESTED_CLOTHES } from '../../data/dummy';

export default function WardrobeScreen() {
  const savedClothes = useMemo(
    () => DUMMY_CLOTHES.filter((item) => item.saved),
    [],
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <FlatList
        data={[]}
        renderItem={null}
        contentContainerStyle={styles.content}
        ListHeaderComponent={
          <View>
            <Text style={styles.pageTitle}>Wardrobe</Text>

            {/* My Wardrobe Section */}
            <Text style={styles.sectionTitle}>My Wardrobe</Text>
            {savedClothes.length === 0 ? (
              <View style={styles.emptySection}>
                <Text style={styles.emptyText}>No saved items yet</Text>
                <Text style={styles.emptySubtext}>
                  Save items from Search to see them here
                </Text>
              </View>
            ) : (
              <View style={styles.grid}>
                {savedClothes.map((item) => (
                  <View key={item.id} style={styles.gridItem}>
                    <ClothesCard item={item} />
                  </View>
                ))}
              </View>
            )}

            {/* Suggested Section */}
            <Text style={[styles.sectionTitle, styles.suggestedTitle]}>
              Suggested for You
            </Text>
            <View style={styles.grid}>
              {SUGGESTED_CLOTHES.map((item) => (
                <View key={item.id} style={styles.gridItem}>
                  <ClothesCard item={item} />
                </View>
              ))}
            </View>
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
  content: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  pageTitle: {
    fontFamily: Fonts.dmSerifDisplay,
    fontSize: FontSizes.xxl,
    color: Colors.primaryText,
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '600',
    color: Colors.primaryText,
    marginBottom: Spacing.md,
  },
  suggestedTitle: {
    marginTop: Spacing.xxl,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridItem: {
    width: '48%',
    marginBottom: Spacing.md,
  },
  emptySection: {
    paddingVertical: Spacing.xxl,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    color: Colors.primaryText,
  },
  emptySubtext: {
    fontSize: FontSizes.sm,
    color: Colors.mutedText,
    marginTop: Spacing.xs,
    textAlign: 'center',
  },
});

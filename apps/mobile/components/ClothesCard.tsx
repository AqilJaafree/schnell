import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSizes, Spacing, BorderRadius } from '../constants/theme';
import type { ClothingItem } from '../data/dummy';

interface ClothesCardProps {
  item: ClothingItem;
  onPress?: () => void;
  onToggleSave?: () => void;
}

export default function ClothesCard({ item, onPress, onToggleSave }: ClothesCardProps) {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {item.image ? (
        <Image source={item.image} style={styles.image} resizeMode="cover" />
      ) : (
        <View style={[styles.imagePlaceholder, { backgroundColor: item.color }]}>
          <Ionicons name="shirt-outline" size={32} color={Colors.surface} />
        </View>
      )}
      <View style={styles.info}>
        <View style={styles.titleRow}>
          <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
          {onToggleSave && (
            <TouchableOpacity onPress={onToggleSave} hitSlop={8}>
              <Ionicons
                name={item.saved ? 'heart' : 'heart-outline'}
                size={20}
                color={item.saved ? Colors.error : Colors.mutedText}
              />
            </TouchableOpacity>
          )}
        </View>
        <Text style={styles.brand}>{item.brand}</Text>
        <Text style={styles.price}>${item.price.toFixed(2)}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  image: {
    height: 140,
    width: '100%',
  },
  imagePlaceholder: {
    height: 140,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    padding: Spacing.md,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
    color: Colors.primaryText,
    flex: 1,
    marginRight: Spacing.sm,
  },
  brand: {
    fontSize: FontSizes.xs,
    color: Colors.mutedText,
    marginTop: 2,
  },
  price: {
    fontSize: FontSizes.sm,
    fontWeight: '700',
    color: Colors.primaryText,
    marginTop: Spacing.xs,
  },
});

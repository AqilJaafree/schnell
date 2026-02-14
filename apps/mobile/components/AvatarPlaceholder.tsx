import { View, Text, Image, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSizes, Spacing } from '../constants/theme';

interface AvatarPlaceholderProps {
  size?: number;
  style?: StyleProp<ViewStyle>;
  avatarUri?: string | null;
}

export default function AvatarPlaceholder({ size = 120, style, avatarUri }: AvatarPlaceholderProps) {
  return (
    <View style={[styles.container, style]}>
      {avatarUri ? (
        <Image
          source={{ uri: avatarUri }}
          style={{
            width: size,
            height: size,
            borderRadius: size / 2,
          }}
          resizeMode="cover"
        />
      ) : (
        <View
          style={[
            styles.circle,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
            },
          ]}
        >
          <Ionicons name="person" size={size * 0.45} color={Colors.border} />
        </View>
      )}
      <Text style={styles.label}>3D Avatar</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  circle: {
    backgroundColor: Colors.surface,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: FontSizes.xs,
    color: Colors.mutedText,
    marginTop: Spacing.sm,
  },
});

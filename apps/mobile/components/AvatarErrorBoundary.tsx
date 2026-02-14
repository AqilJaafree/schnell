import React, { type ReactNode } from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSizes, Spacing, BorderRadius } from '../constants/theme';

interface Props {
  children: ReactNode;
  avatarUri: string | null;
  fallbackWidth?: number;
  fallbackHeight?: number;
}

interface State {
  hasError: boolean;
}

export default class AvatarErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  render() {
    const { fallbackWidth = 220, fallbackHeight = 340 } = this.props;

    if (this.state.hasError) {
      return (
        <View style={[styles.fallback, { width: fallbackWidth, height: fallbackHeight }]}>
          {this.props.avatarUri ? (
            <Image
              source={{ uri: this.props.avatarUri }}
              style={styles.fallbackImage}
              resizeMode="contain"
            />
          ) : (
            <View style={styles.placeholderCircle}>
              <Ionicons name="person" size={60} color={Colors.border} />
            </View>
          )}
          <Text style={styles.fallbackText}>3D view unavailable</Text>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  fallback: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
  },
  fallbackImage: {
    width: '100%',
    height: '80%',
    borderRadius: BorderRadius.lg,
  },
  placeholderCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.background,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fallbackText: {
    fontSize: FontSizes.xs,
    color: Colors.mutedText,
    marginTop: Spacing.sm,
  },
});

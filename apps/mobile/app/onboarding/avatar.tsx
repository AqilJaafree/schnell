import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Fonts, FontSizes, Spacing, BorderRadius } from '../../constants/theme';
import ProgressDots from '../../components/ProgressDots';
import { useOnboardingStatus } from '../../hooks/useOnboardingStatus';

export default function AvatarScreen() {
  const router = useRouter();
  const { markComplete } = useOnboardingStatus();

  const handleGetStarted = () => {
    markComplete();
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.inner}>
        <View style={styles.header}>
          <ProgressDots totalSteps={3} currentStep={2} />
          <Text style={styles.stepLabel}>Step 3 of 3</Text>
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>Your Avatar</Text>
          <Text style={styles.description}>
            Your personalized 3D avatar will be generated here.
          </Text>

          <View style={styles.avatarContainer}>
            <View style={styles.avatarCircle}>
              <Ionicons name="person" size={80} color={Colors.border} />
            </View>
            <Text style={styles.avatarText}>3D Avatar coming soon</Text>
            <Text style={styles.avatarSubtext}>
              Powered by Three.js
            </Text>
          </View>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.getStartedButton}
            onPress={handleGetStarted}
            activeOpacity={0.8}
          >
            <Text style={styles.getStartedButtonText}>Get Started</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  inner: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.xxl,
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.xxl,
  },
  stepLabel: {
    fontSize: FontSizes.sm,
    color: Colors.mutedText,
    marginTop: Spacing.sm,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: Fonts.dmSerifDisplay,
    fontSize: FontSizes.xxl,
    color: Colors.primaryText,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  description: {
    fontSize: FontSizes.md,
    color: Colors.secondaryText,
    marginBottom: Spacing.xxl,
    textAlign: 'center',
    lineHeight: 22,
  },
  avatarContainer: {
    alignItems: 'center',
  },
  avatarCircle: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: Colors.surface,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  avatarText: {
    fontSize: FontSizes.md,
    color: Colors.secondaryText,
    fontWeight: '500',
  },
  avatarSubtext: {
    fontSize: FontSizes.sm,
    color: Colors.mutedText,
    marginTop: Spacing.xs,
  },
  footer: {
    marginTop: Spacing.xl,
  },
  getStartedButton: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md,
    paddingVertical: 14,
    alignItems: 'center',
  },
  getStartedButtonText: {
    color: Colors.white,
    fontSize: FontSizes.md,
    fontWeight: '600',
  },
});

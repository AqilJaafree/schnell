import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Fonts, FontSizes, Spacing, BorderRadius } from '../../constants/theme';
import ProgressDots from '../../components/ProgressDots';

export default function SelfieScreen() {
  const router = useRouter();

  const handleContinue = () => {
    router.push('/onboarding/avatar');
  };

  const handleSkip = () => {
    router.push('/onboarding/avatar');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.inner}>
        <View style={styles.header}>
          <ProgressDots totalSteps={3} currentStep={1} />
          <Text style={styles.stepLabel}>Step 2 of 3</Text>
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>Upload a Selfie</Text>
          <Text style={styles.description}>
            Take or upload a photo to create your personalized avatar.
          </Text>

          <TouchableOpacity style={styles.uploadArea} activeOpacity={0.7}>
            <Ionicons name="camera-outline" size={48} color={Colors.mutedText} />
            <Text style={styles.uploadText}>Tap to take or upload a photo</Text>
            <Text style={styles.uploadSubtext}>Coming soon</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.continueButton}
            onPress={handleContinue}
            activeOpacity={0.8}
          >
            <Text style={styles.continueButtonText}>Continue</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.skipButton}
            onPress={handleSkip}
            activeOpacity={0.8}
          >
            <Text style={styles.skipButtonText}>Skip for now</Text>
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
  },
  title: {
    fontFamily: Fonts.dmSerifDisplay,
    fontSize: FontSizes.xxl,
    color: Colors.primaryText,
    marginBottom: Spacing.sm,
  },
  description: {
    fontSize: FontSizes.md,
    color: Colors.secondaryText,
    marginBottom: Spacing.xxl,
    lineHeight: 22,
  },
  uploadArea: {
    borderWidth: 2,
    borderColor: Colors.border,
    borderStyle: 'dashed',
    borderRadius: BorderRadius.lg,
    paddingVertical: 60,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surface,
  },
  uploadText: {
    fontSize: FontSizes.md,
    color: Colors.secondaryText,
    marginTop: Spacing.md,
  },
  uploadSubtext: {
    fontSize: FontSizes.sm,
    color: Colors.mutedText,
    marginTop: Spacing.xs,
  },
  footer: {
    gap: Spacing.md,
  },
  continueButton: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md,
    paddingVertical: 14,
    alignItems: 'center',
  },
  continueButtonText: {
    color: Colors.white,
    fontSize: FontSizes.md,
    fontWeight: '600',
  },
  skipButton: {
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  skipButtonText: {
    color: Colors.secondaryText,
    fontSize: FontSizes.sm,
    textDecorationLine: 'underline',
  },
});

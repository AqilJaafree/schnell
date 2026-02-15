import { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { File } from 'expo-file-system';
import { usePrivy } from '@privy-io/expo';
import { Colors, Fonts, FontSizes, Spacing, BorderRadius } from '../../constants/theme';
import ProgressDots from '../../components/ProgressDots';
import { useOnboardingStatus } from '../../hooks/useOnboardingStatus';
import { useAvatarStorage } from '../../hooks/useAvatarStorage';
import { generateAvatarFromSelfie } from '../../services/gemini';

export default function AvatarScreen() {
  const router = useRouter();
  const { selfieUri } = useLocalSearchParams<{ selfieUri?: string }>();
  const { markComplete } = useOnboardingStatus();
  const { user } = usePrivy();
  const { saveAvatar } = useAvatarStorage(user?.id);

  const [avatarPreviewUri, setAvatarPreviewUri] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateAvatar = useCallback(async () => {
    if (!selfieUri) {
      setError('No selfie provided. Please go back and take a photo.');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const selfieFile = new File(selfieUri);
      const arrayBuffer = await selfieFile.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);
      let binary = '';
      for (let i = 0; i < bytes.length; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      const base64 = btoa(binary);

      const mimeType = selfieUri.toLowerCase().endsWith('.png')
        ? 'image/png'
        : 'image/jpeg';

      const avatarBase64 = await generateAvatarFromSelfie(base64, mimeType);
      const savedUri = await saveAvatar(avatarBase64);

      if (savedUri) {
        setAvatarPreviewUri(savedUri);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to generate avatar. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  }, [selfieUri, saveAvatar]);

  useEffect(() => {
    if (selfieUri) {
      generateAvatar();
    }
  }, []);

  const handleGetStarted = async () => {
    await markComplete();
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
            {selfieUri
              ? 'Your personalized 3D avatar is being generated.'
              : 'No selfie was provided. You can generate an avatar later from your profile.'}
          </Text>

          <View style={styles.avatarContainer}>
            {isGenerating ? (
              <>
                <ActivityIndicator size="large" color={Colors.primary} />
                <Text style={styles.avatarText}>Generating your avatar...</Text>
                <Text style={styles.avatarSubtext}>This may take a few seconds</Text>
              </>
            ) : error ? (
              <>
                <Ionicons name="alert-circle-outline" size={48} color={Colors.error} />
                <Text style={[styles.avatarText, { color: Colors.error }]}>{error}</Text>
                <TouchableOpacity style={styles.retryButton} onPress={generateAvatar}>
                  <Text style={styles.retryButtonText}>Try Again</Text>
                </TouchableOpacity>
              </>
            ) : avatarPreviewUri ? (
              <>
                <Image
                  source={{ uri: avatarPreviewUri }}
                  style={styles.avatarImage}
                  resizeMode="contain"
                />
                <Text style={styles.avatarText}>Looking good!</Text>
              </>
            ) : (
              <>
                <View style={styles.avatarCircle}>
                  <Ionicons name="person" size={80} color={Colors.border} />
                </View>
                <Text style={styles.avatarText}>No selfie provided</Text>
                <Text style={styles.avatarSubtext}>
                  You can generate an avatar later
                </Text>
              </>
            )}
          </View>
        </View>

        <View style={styles.footer}>
          {avatarPreviewUri && !isGenerating && (
            <TouchableOpacity style={styles.regenerateButton} onPress={generateAvatar}>
              <Text style={styles.regenerateButtonText}>Regenerate Avatar</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={[styles.getStartedButton, isGenerating && styles.buttonDisabled]}
            onPress={handleGetStarted}
            disabled={isGenerating}
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
  avatarImage: {
    width: 220,
    height: 360,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.lg,
  },
  avatarText: {
    fontSize: FontSizes.md,
    color: Colors.secondaryText,
    fontWeight: '500',
    textAlign: 'center',
  },
  avatarSubtext: {
    fontSize: FontSizes.sm,
    color: Colors.mutedText,
    marginTop: Spacing.xs,
  },
  retryButton: {
    marginTop: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: BorderRadius.md,
  },
  retryButtonText: {
    color: Colors.primary,
    fontSize: FontSizes.sm,
    fontWeight: '600',
  },
  regenerateButton: {
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  regenerateButtonText: {
    color: Colors.secondaryText,
    fontSize: FontSizes.sm,
    textDecorationLine: 'underline',
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
  buttonDisabled: {
    opacity: 0.5,
  },
});

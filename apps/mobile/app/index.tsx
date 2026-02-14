import { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { usePrivy } from '@privy-io/expo';
import { Colors, Fonts, FontSizes } from '../constants/theme';
import { useOnboardingStatus } from '../hooks/useOnboardingStatus';

export default function SplashScreen() {
  const router = useRouter();
  const { isReady, user } = usePrivy();
  const { isComplete: onboardingComplete } = useOnboardingStatus();

  useEffect(() => {
    if (!isReady || onboardingComplete === null) return;

    const timer = setTimeout(() => {
      if (!user) {
        router.replace('/login');
      } else if (!onboardingComplete) {
        router.replace('/onboarding/height-weight');
      } else {
        router.replace('/(tabs)');
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [isReady, user, onboardingComplete]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Schnell</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  title: {
    fontFamily: Fonts.dmSerifDisplay,
    fontSize: FontSizes.title,
    color: Colors.primaryText,
  },
});

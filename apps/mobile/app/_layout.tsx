import { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { Slot, useRouter, useSegments } from 'expo-router';
import { PrivyProvider, usePrivy } from '@privy-io/expo';
import { PrivyElements } from '@privy-io/expo/ui';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useFonts, DMSerifDisplay_400Regular } from '@expo-google-fonts/dm-serif-display';
import * as SplashScreen from 'expo-splash-screen';
import { Colors } from '../constants/theme';
import { tempoModerato } from '../constants/chains';
import { OnboardingProvider, useOnboardingStatus } from '../hooks/useOnboardingStatus';

SplashScreen.preventAutoHideAsync();

const privyAppId = process.env.EXPO_PUBLIC_PRIVY_APP_ID ?? '';
const privyClientId = process.env.EXPO_PUBLIC_PRIVY_CLIENT_ID ?? '';

function AppGate() {
  const { user } = usePrivy();
  return (
    <OnboardingProvider userId={user?.id}>
      <AuthNavigator />
    </OnboardingProvider>
  );
}

function AuthNavigator() {
  const { isReady, user } = usePrivy();
  const { isComplete: onboardingComplete } = useOnboardingStatus();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!isReady) return;
    // When no user, onboardingComplete is null — that's fine, we just redirect to login
    if (onboardingComplete === null && user) return;

    const currentRoute = segments[0];
    const inTabs = currentRoute === '(tabs)';
    const inOnboarding = currentRoute === 'onboarding';
    const inCart = currentRoute === 'cart';
    const onLogin = currentRoute === 'login';
    const onSplash = currentRoute === undefined || currentRoute === '';

    if (!user) {
      // Not authenticated — go to login (unless already on splash or login)
      if (!onSplash && !onLogin) {
        router.replace('/login');
      }
    } else if (!onboardingComplete) {
      // Authenticated but hasn't completed onboarding
      if (!inOnboarding) {
        router.replace('/onboarding/height-weight');
      }
    } else {
      // Authenticated and onboarding complete — allow tabs and cart
      if (!inTabs && !inCart) {
        router.replace('/(tabs)');
      }
    }
  }, [isReady, user, onboardingComplete, segments]);

  if (!isReady || (onboardingComplete === null && user)) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return <Slot />;
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    DMSerifDisplay_400Regular,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <PrivyProvider
        appId={privyAppId}
        clientId={privyClientId}
        supportedChains={[tempoModerato]}
        config={{
          embedded: {
            ethereum: { createOnLogin: 'all-users' },
            solana: { createOnLogin: 'all-users' },
          },
        }}
      >
        <PrivyElements />
        <AppGate />
        <StatusBar style="dark" />
      </PrivyProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
});

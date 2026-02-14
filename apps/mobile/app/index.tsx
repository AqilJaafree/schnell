import { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { usePrivy } from '@privy-io/expo';
import { Colors, Fonts, FontSizes } from '../constants/theme';

export default function SplashScreen() {
  const router = useRouter();
  const { isReady, user } = usePrivy();

  useEffect(() => {
    if (!isReady) return;

    const timer = setTimeout(() => {
      if (user) {
        router.replace('/(tabs)');
      } else {
        router.replace('/login');
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [isReady, user]);

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

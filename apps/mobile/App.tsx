import { PrivyProvider } from '@privy-io/expo';
import { PrivyElements } from '@privy-io/expo/ui';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import HomeScreen from './screens/HomeScreen';

const privyAppId = process.env.EXPO_PUBLIC_PRIVY_APP_ID ?? '';
const privyClientId = process.env.EXPO_PUBLIC_PRIVY_CLIENT_ID ?? '';

export default function App() {
  return (
    <SafeAreaProvider>
      <PrivyProvider
        appId={privyAppId}
        clientId={privyClientId}
        config={{
          embedded: {
            ethereum: { createOnLogin: 'all-users' },
            solana: { createOnLogin: 'all-users' },
          },
        }}
      >
        <PrivyElements />
        <HomeScreen />
        <StatusBar style="auto" />
      </PrivyProvider>
    </SafeAreaProvider>
  );
}

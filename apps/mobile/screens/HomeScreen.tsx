import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { usePrivy, useEmbeddedEthereumWallet, useEmbeddedSolanaWallet } from '@privy-io/expo';
import LoginScreen from './LoginScreen';

function WalletCard({ label, address }: { label: string; address: string }) {
  const truncated = `${address.slice(0, 6)}...${address.slice(-4)}`;
  return (
    <View style={styles.walletCard}>
      <Text style={styles.walletLabel}>{label}</Text>
      <Text style={styles.walletAddress}>{truncated}</Text>
    </View>
  );
}

function DashboardScreen() {
  const { user, logout } = usePrivy();
  const ethWallet = useEmbeddedEthereumWallet();
  const solWallet = useEmbeddedSolanaWallet();

  const ethAddress = ethWallet.wallets?.[0]?.address;
  const solAddress =
    solWallet.status === 'connected' ? solWallet.wallets?.[0]?.address : undefined;

  return (
    <ScrollView contentContainerStyle={styles.dashboard}>
      <Text style={styles.title}>Dashboard</Text>
      <Text style={styles.userId}>User ID: {user?.id}</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Wallets</Text>

        {ethAddress ? (
          <WalletCard label="Ethereum" address={ethAddress} />
        ) : (
          <View style={styles.walletCard}>
            <Text style={styles.walletLabel}>Ethereum</Text>
            <Text style={styles.walletPending}>Creating wallet...</Text>
          </View>
        )}

        {solAddress ? (
          <WalletCard label="Solana" address={solAddress} />
        ) : (
          <View style={styles.walletCard}>
            <Text style={styles.walletLabel}>Solana</Text>
            <Text style={styles.walletPending}>Creating wallet...</Text>
          </View>
        )}
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

export default function HomeScreen() {
  const { isReady, user } = usePrivy();

  if (!isReady) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#111" />
      </View>
    );
  }

  return user ? <DashboardScreen /> : <LoginScreen />;
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  dashboard: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 80,
    paddingBottom: 40,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111',
    marginBottom: 4,
  },
  userId: {
    fontSize: 13,
    color: '#999',
    marginBottom: 24,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111',
    marginBottom: 12,
  },
  walletCard: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  walletLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  walletAddress: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111',
    fontFamily: 'monospace',
  },
  walletPending: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
  },
  logoutButton: {
    borderWidth: 1,
    borderColor: '#dc2626',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 'auto',
  },
  logoutText: {
    color: '#dc2626',
    fontSize: 16,
    fontWeight: '600',
  },
});

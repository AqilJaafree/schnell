import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useLoginWithEmail, useLoginWithOAuth } from '@privy-io/expo';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState<'initial' | 'otp'>('initial');

  const { sendCode, loginWithCode, state: emailState } = useLoginWithEmail();
  const { login: oauthLogin, state: oauthState } = useLoginWithOAuth();

  const isLoading =
    emailState.status === 'sending-code' ||
    emailState.status === 'submitting-code' ||
    oauthState.status === 'loading';

  const handleSendCode = async () => {
    if (!email.trim()) return;
    try {
      await sendCode({ email: email.trim() });
      setStep('otp');
    } catch (err) {
      console.error('Failed to send code:', err);
    }
  };

  const handleVerifyCode = async () => {
    if (!code.trim()) return;
    try {
      await loginWithCode({ code: code.trim(), email: email.trim() });
    } catch (err) {
      console.error('Failed to verify code:', err);
    }
  };

  const handleOAuth = (provider: 'google' | 'apple') => {
    oauthLogin({ provider });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Schnell</Text>
      <Text style={styles.subtitle}>Sign in to continue</Text>

      {step === 'initial' ? (
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            placeholderTextColor="#999"
            inputMode="email"
            autoCapitalize="none"
            autoCorrect={false}
            editable={!isLoading}
          />
          <TouchableOpacity
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={handleSendCode}
            disabled={isLoading}
          >
            {emailState.status === 'sending-code' ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Continue with Email</Text>
            )}
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity
            style={[styles.oauthButton, isLoading && styles.buttonDisabled]}
            onPress={() => handleOAuth('google')}
            disabled={isLoading}
          >
            <Text style={styles.oauthButtonText}>Continue with Google</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.oauthButton, isLoading && styles.buttonDisabled]}
            onPress={() => handleOAuth('apple')}
            disabled={isLoading}
          >
            <Text style={styles.oauthButtonText}>Continue with Apple</Text>
          </TouchableOpacity>

          {oauthState.status === 'error' && oauthState.error && (
            <Text style={styles.error}>{oauthState.error.message}</Text>
          )}
        </View>
      ) : (
        <View style={styles.form}>
          <Text style={styles.otpLabel}>
            Enter the code sent to {email}
          </Text>
          <TextInput
            style={styles.input}
            value={code}
            onChangeText={setCode}
            placeholder="Enter verification code"
            placeholderTextColor="#999"
            inputMode="numeric"
            editable={!isLoading}
          />
          <TouchableOpacity
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={handleVerifyCode}
            disabled={isLoading}
          >
            {emailState.status === 'submitting-code' ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Verify Code</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.linkButton}
            onPress={() => {
              setStep('initial');
              setCode('');
            }}
          >
            <Text style={styles.linkText}>Use a different email</Text>
          </TouchableOpacity>

          {emailState.status === 'error' && emailState.error && (
            <Text style={styles.error}>{emailState.error.message}</Text>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
    color: '#111',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
    color: '#666',
  },
  form: {
    gap: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#111',
    backgroundColor: '#f9f9f9',
  },
  button: {
    backgroundColor: '#111',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#ddd',
  },
  dividerText: {
    marginHorizontal: 12,
    color: '#999',
    fontSize: 14,
  },
  oauthButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  oauthButtonText: {
    color: '#111',
    fontSize: 16,
    fontWeight: '500',
  },
  otpLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  linkButton: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  linkText: {
    color: '#666',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  error: {
    color: '#dc2626',
    fontSize: 14,
    textAlign: 'center',
  },
});

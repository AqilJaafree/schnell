import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useLoginWithEmail, useLoginWithOAuth } from '@privy-io/expo';
import { Colors, Fonts, FontSizes, Spacing, BorderRadius } from '../constants/theme';

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
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.inner}>
        <Text style={styles.brand}>Schnell</Text>
        <Text style={styles.subtitle}>Sign in to continue</Text>

        {step === 'initial' ? (
          <View style={styles.form}>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              placeholderTextColor={Colors.mutedText}
              inputMode="email"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!isLoading}
            />
            <TouchableOpacity
              style={[styles.button, isLoading && styles.buttonDisabled]}
              onPress={handleSendCode}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              {emailState.status === 'sending-code' ? (
                <ActivityIndicator color={Colors.white} />
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
              activeOpacity={0.8}
            >
              <Text style={styles.oauthButtonText}>Continue with Google</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.oauthButton, isLoading && styles.buttonDisabled]}
              onPress={() => handleOAuth('apple')}
              disabled={isLoading}
              activeOpacity={0.8}
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
              placeholderTextColor={Colors.mutedText}
              inputMode="numeric"
              editable={!isLoading}
            />
            <TouchableOpacity
              style={[styles.button, isLoading && styles.buttonDisabled]}
              onPress={handleVerifyCode}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              {emailState.status === 'submitting-code' ? (
                <ActivityIndicator color={Colors.white} />
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
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  inner: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
  },
  brand: {
    fontFamily: Fonts.dmSerifDisplay,
    fontSize: FontSizes.title,
    textAlign: 'center',
    marginBottom: Spacing.sm,
    color: Colors.primaryText,
  },
  subtitle: {
    fontSize: FontSizes.md,
    textAlign: 'center',
    marginBottom: Spacing.xxl,
    color: Colors.secondaryText,
  },
  form: {
    gap: Spacing.md,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: 14,
    fontSize: FontSizes.md,
    color: Colors.primaryText,
    backgroundColor: Colors.surface,
  },
  button: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md,
    paddingVertical: 14,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: Colors.white,
    fontSize: FontSizes.md,
    fontWeight: '600',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.sm,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  dividerText: {
    marginHorizontal: Spacing.md,
    color: Colors.mutedText,
    fontSize: FontSizes.sm,
  },
  oauthButton: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: Colors.surface,
  },
  oauthButtonText: {
    color: Colors.primaryText,
    fontSize: FontSizes.md,
    fontWeight: '500',
  },
  otpLabel: {
    fontSize: FontSizes.sm,
    color: Colors.secondaryText,
    marginBottom: Spacing.xs,
  },
  linkButton: {
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  linkText: {
    color: Colors.secondaryText,
    fontSize: FontSizes.sm,
    textDecorationLine: 'underline',
  },
  error: {
    color: Colors.error,
    fontSize: FontSizes.sm,
    textAlign: 'center',
  },
});

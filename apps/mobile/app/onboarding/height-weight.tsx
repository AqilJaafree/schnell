import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Fonts, FontSizes, Spacing, BorderRadius } from '../../constants/theme';
import ProgressDots from '../../components/ProgressDots';

export default function HeightWeightScreen() {
  const router = useRouter();
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [errors, setErrors] = useState<{ height?: string; weight?: string }>({});

  const validate = (): boolean => {
    const newErrors: { height?: string; weight?: string } = {};

    const heightNum = parseFloat(height);
    if (!height.trim()) {
      newErrors.height = 'Height is required';
    } else if (isNaN(heightNum) || heightNum < 50 || heightNum > 300) {
      newErrors.height = 'Enter a valid height (50-300 cm)';
    }

    const weightNum = parseFloat(weight);
    if (!weight.trim()) {
      newErrors.weight = 'Weight is required';
    } else if (isNaN(weightNum) || weightNum < 20 || weightNum > 500) {
      newErrors.weight = 'Enter a valid weight (20-500 kg)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (validate()) {
      router.push('/onboarding/selfie');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <ProgressDots totalSteps={3} currentStep={0} />
            <Text style={styles.stepLabel}>Step 1 of 3</Text>
          </View>

          <View style={styles.content}>
            <Text style={styles.title}>Your Measurements</Text>
            <Text style={styles.description}>
              Help us personalize your experience by entering your height and weight.
            </Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Height (cm)</Text>
              <TextInput
                style={[styles.input, errors.height ? styles.inputError : null]}
                value={height}
                onChangeText={(text) => {
                  setHeight(text);
                  if (errors.height) setErrors((prev) => ({ ...prev, height: undefined }));
                }}
                placeholder="e.g. 170"
                placeholderTextColor={Colors.mutedText}
                inputMode="decimal"
                returnKeyType="next"
              />
              {errors.height && <Text style={styles.errorText}>{errors.height}</Text>}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Weight (kg)</Text>
              <TextInput
                style={[styles.input, errors.weight ? styles.inputError : null]}
                value={weight}
                onChangeText={(text) => {
                  setWeight(text);
                  if (errors.weight) setErrors((prev) => ({ ...prev, weight: undefined }));
                }}
                placeholder="e.g. 65"
                placeholderTextColor={Colors.mutedText}
                inputMode="decimal"
                returnKeyType="done"
              />
              {errors.weight && <Text style={styles.errorText}>{errors.weight}</Text>}
            </View>
          </View>

          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.continueButton}
              onPress={handleContinue}
              activeOpacity={0.8}
            >
              <Text style={styles.continueButtonText}>Continue</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
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
  inputGroup: {
    marginBottom: Spacing.xl,
  },
  label: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
    color: Colors.primaryText,
    marginBottom: Spacing.sm,
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
  inputError: {
    borderColor: Colors.error,
  },
  errorText: {
    fontSize: FontSizes.xs,
    color: Colors.error,
    marginTop: Spacing.xs,
  },
  footer: {
    marginTop: Spacing.xl,
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
});

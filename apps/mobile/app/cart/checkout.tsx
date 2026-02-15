import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Linking,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { type Address } from 'viem';
import { Colors, Fonts, FontSizes, Spacing, BorderRadius } from '../../constants/theme';
import Button from '../../components/Button';
import Card from '../../components/Card';
import { DUMMY_CART, type ShippingInfo } from '../../data/dummy';
import { useTempoPayment } from '../../hooks/useTempoPayment';

const MERCHANT_ADDRESS = (process.env.EXPO_PUBLIC_MERCHANT_ADDRESS ??
  '0xC16C9e5BA678B6B708B0FC7f3601188f40D832DA') as Address;

const INITIAL_SHIPPING: ShippingInfo = {
  fullName: '',
  phoneNumber: '',
  address: '',
  city: '',
  postalCode: '',
  country: '',
};

type FieldErrors = Partial<Record<keyof ShippingInfo, string>>;

function validateShipping(info: ShippingInfo): FieldErrors {
  const errors: FieldErrors = {};

  if (!info.fullName.trim()) {
    errors.fullName = 'Full name is required';
  }

  if (!info.phoneNumber.trim()) {
    errors.phoneNumber = 'Phone number is required';
  } else if (!/^\+?[\d\s\-()]{7,}$/.test(info.phoneNumber.trim())) {
    errors.phoneNumber = 'Enter a valid phone number';
  }

  if (!info.address.trim()) {
    errors.address = 'Address is required';
  }

  if (!info.city.trim()) {
    errors.city = 'City is required';
  }

  if (!info.postalCode.trim()) {
    errors.postalCode = 'Postal code is required';
  }

  if (!info.country.trim()) {
    errors.country = 'Country is required';
  }

  return errors;
}

export default function CheckoutScreen() {
  const router = useRouter();
  const [shipping, setShipping] = useState<ShippingInfo>(INITIAL_SHIPPING);
  const [errors, setErrors] = useState<FieldErrors>({});
  const { send, isSending, error: paymentError, txHash, reset } = useTempoPayment();

  const subtotal = DUMMY_CART.reduce(
    (sum, item) => sum + item.clothingItem.price * item.quantity,
    0,
  );

  const updateField = (field: keyof ShippingInfo, value: string) => {
    setShipping((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handlePayNow = async () => {
    const validationErrors = validateShipping(shipping);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    await send(MERCHANT_ADDRESS, subtotal.toFixed(2), 'Schnell order');
  };

  // Show success alert when txHash is set
  useEffect(() => {
    if (txHash) {
      const explorerUrl = `https://explore.tempo.xyz/tx/${txHash}`;
      Alert.alert(
        'Payment Successful!',
        `Transaction: ${txHash.slice(0, 10)}...${txHash.slice(-8)}`,
        [
          {
            text: 'View on Explorer',
            onPress: () => {
              Linking.openURL(explorerUrl);
              reset();
            },
          },
          {
            text: 'Done',
            onPress: () => {
              reset();
              router.replace('/(tabs)');
            },
          },
        ],
      );
    }
  }, [txHash]);

  // Show error alert
  useEffect(() => {
    if (paymentError) {
      Alert.alert('Payment Failed', paymentError, [
        { text: 'OK', onPress: reset },
      ]);
    }
  }, [paymentError]);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={8}>
          <Ionicons name="arrow-back" size={24} color={Colors.primaryText} />
        </TouchableOpacity>
        <Text style={styles.title}>Checkout</Text>
        <View style={styles.headerSpacer} />
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Order Summary */}
          <Text style={styles.sectionTitle}>Order Summary</Text>
          <Card style={styles.orderSummaryCard}>
            {DUMMY_CART.map((item) => (
              <View key={item.id} style={styles.orderItem}>
                <View style={styles.orderItemLeft}>
                  <Text style={styles.orderItemName} numberOfLines={1}>
                    {item.clothingItem.name}
                  </Text>
                  <Text style={styles.orderItemMeta}>
                    Size {item.size} &middot; Qty {item.quantity}
                  </Text>
                </View>
                <Text style={styles.orderItemPrice}>
                  ${(item.clothingItem.price * item.quantity).toFixed(2)}
                </Text>
              </View>
            ))}
          </Card>

          {/* Shipping Info */}
          <Text style={styles.sectionTitle}>Shipping Information</Text>
          <Card>
            <FormField
              label="Full Name"
              value={shipping.fullName}
              onChangeText={(v) => updateField('fullName', v)}
              error={errors.fullName}
              placeholder="John Doe"
              autoCapitalize="words"
            />
            <FormField
              label="Phone Number"
              value={shipping.phoneNumber}
              onChangeText={(v) => updateField('phoneNumber', v)}
              error={errors.phoneNumber}
              placeholder="+60 12-345 6789"
              inputMode="tel"
            />
            <FormField
              label="Address"
              value={shipping.address}
              onChangeText={(v) => updateField('address', v)}
              error={errors.address}
              placeholder="123 Main Street, Apt 4B"
            />
            <FormField
              label="City"
              value={shipping.city}
              onChangeText={(v) => updateField('city', v)}
              error={errors.city}
              placeholder="Kuala Lumpur"
            />
            <View style={styles.rowFields}>
              <View style={styles.halfField}>
                <FormField
                  label="Postal Code"
                  value={shipping.postalCode}
                  onChangeText={(v) => updateField('postalCode', v)}
                  error={errors.postalCode}
                  placeholder="50000"
                  inputMode="numeric"
                />
              </View>
              <View style={styles.halfField}>
                <FormField
                  label="Country"
                  value={shipping.country}
                  onChangeText={(v) => updateField('country', v)}
                  error={errors.country}
                  placeholder="Malaysia"
                />
              </View>
            </View>
          </Card>

          {/* Total */}
          <Card style={styles.totalCard}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Subtotal</Text>
              <Text style={styles.totalValue}>{subtotal.toFixed(2)} aUSD</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Shipping</Text>
              <Text style={styles.totalValueFree}>Free</Text>
            </View>
            <View style={styles.totalDivider} />
            <View style={styles.totalRow}>
              <Text style={styles.grandTotalLabel}>Total</Text>
              <Text style={styles.grandTotalValue}>{subtotal.toFixed(2)} aUSD</Text>
            </View>
          </Card>

          {/* Pay Button */}
          <Button
            title={isSending ? 'Processing...' : 'Pay Now'}
            onPress={handlePayNow}
            loading={isSending}
            disabled={isSending}
            style={styles.payButton}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

interface FormFieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  placeholder?: string;
  inputMode?: 'text' | 'tel' | 'numeric';
  autoCapitalize?: 'none' | 'sentences' | 'words';
}

function FormField({
  label,
  value,
  onChangeText,
  error,
  placeholder,
  inputMode = 'text',
  autoCapitalize = 'sentences',
}: FormFieldProps) {
  return (
    <View style={styles.fieldContainer}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        style={[styles.fieldInput, error ? styles.fieldInputError : null]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={Colors.mutedText}
        inputMode={inputMode}
        autoCapitalize={autoCapitalize}
        autoCorrect={false}
      />
      {error && <Text style={styles.fieldError}>{error}</Text>}
    </View>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  title: {
    fontFamily: Fonts.dmSerifDisplay,
    fontSize: FontSizes.xl,
    color: Colors.primaryText,
    flex: 1,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 24,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  sectionTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '600',
    color: Colors.primaryText,
    marginBottom: Spacing.md,
    marginTop: Spacing.lg,
  },
  orderSummaryCard: {
    padding: 0,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.background,
  },
  orderItemLeft: {
    flex: 1,
    marginRight: Spacing.md,
  },
  orderItemName: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
    color: Colors.primaryText,
  },
  orderItemMeta: {
    fontSize: FontSizes.xs,
    color: Colors.mutedText,
    marginTop: 2,
  },
  orderItemPrice: {
    fontSize: FontSizes.sm,
    fontWeight: '700',
    color: Colors.primaryText,
  },
  fieldContainer: {
    marginBottom: Spacing.md,
  },
  fieldLabel: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
    color: Colors.primaryText,
    marginBottom: Spacing.sm,
  },
  fieldInput: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: 14,
    fontSize: FontSizes.md,
    color: Colors.primaryText,
    backgroundColor: Colors.surface,
  },
  fieldInputError: {
    borderColor: Colors.error,
  },
  fieldError: {
    fontSize: FontSizes.xs,
    color: Colors.error,
    marginTop: Spacing.xs,
  },
  rowFields: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  halfField: {
    flex: 1,
  },
  totalCard: {
    marginTop: Spacing.lg,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  totalLabel: {
    fontSize: FontSizes.sm,
    color: Colors.secondaryText,
  },
  totalValue: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
    color: Colors.primaryText,
  },
  totalValueFree: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
    color: '#10B981',
  },
  totalDivider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: Spacing.sm,
  },
  grandTotalLabel: {
    fontSize: FontSizes.md,
    fontWeight: '700',
    color: Colors.primaryText,
  },
  grandTotalValue: {
    fontSize: FontSizes.md,
    fontWeight: '700',
    color: Colors.primaryText,
  },
  payButton: {
    marginTop: Spacing.xl,
  },
});

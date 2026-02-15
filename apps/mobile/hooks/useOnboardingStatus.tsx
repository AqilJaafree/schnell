import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';
import * as SecureStore from 'expo-secure-store';

function getOnboardingKey(userId: string) {
  return `schnell_onboarding_${userId.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
}

interface OnboardingContextValue {
  isComplete: boolean | null;
  markComplete: () => Promise<void>;
  resetOnboarding: () => Promise<void>;
}

const OnboardingContext = createContext<OnboardingContextValue | null>(null);

export function OnboardingProvider({ userId, children }: { userId: string | undefined; children: ReactNode }) {
  const [isComplete, setIsComplete] = useState<boolean | null>(null);

  useEffect(() => {
    if (!userId) {
      setIsComplete(null);
      return;
    }

    const key = getOnboardingKey(userId);
    SecureStore.getItemAsync(key)
      .then((value) => {
        setIsComplete(value === 'true');
      })
      .catch(() => {
        setIsComplete(false);
      });
  }, [userId]);

  const markComplete = useCallback(async () => {
    if (!userId) return;
    const key = getOnboardingKey(userId);
    await SecureStore.setItemAsync(key, 'true');
    setIsComplete(true);
  }, [userId]);

  const resetOnboarding = useCallback(async () => {
    if (!userId) return;
    const key = getOnboardingKey(userId);
    await SecureStore.deleteItemAsync(key);
    setIsComplete(false);
  }, [userId]);

  return (
    <OnboardingContext.Provider value={{ isComplete, markComplete, resetOnboarding }}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboardingStatus() {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboardingStatus must be used within OnboardingProvider');
  }
  return context;
}

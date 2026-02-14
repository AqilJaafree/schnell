import { useEffect, useState, useCallback } from 'react';
import * as SecureStore from 'expo-secure-store';

const ONBOARDING_KEY = 'schnell_onboarding_complete';

export function useOnboardingStatus() {
  const [isComplete, setIsComplete] = useState<boolean | null>(null);

  useEffect(() => {
    SecureStore.getItemAsync(ONBOARDING_KEY)
      .then((value) => {
        setIsComplete(value === 'true');
      })
      .catch(() => {
        setIsComplete(false);
      });
  }, []);

  const markComplete = useCallback(async () => {
    await SecureStore.setItemAsync(ONBOARDING_KEY, 'true');
    setIsComplete(true);
  }, []);

  return { isComplete, markComplete };
}

import { useState, useEffect, useCallback } from 'react';

const AVATAR_STORAGE_KEY_PREFIX = 'schnell_avatar_';

function getAvatarKey(userId: string) {
  return `${AVATAR_STORAGE_KEY_PREFIX}${userId.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
}

export function useAvatarStorage(userId: string | undefined) {
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    try {
      const key = getAvatarKey(userId);
      const stored = localStorage.getItem(key);
      if (stored) {
        setAvatarUri(stored);
      }
    } catch {
      // localStorage not available
    }
    setIsLoading(false);
  }, [userId]);

  const saveAvatar = useCallback(
    async (base64Data: string): Promise<string | null> => {
      if (!userId) return null;

      const dataUri = `data:image/png;base64,${base64Data}`;
      const key = getAvatarKey(userId);

      try {
        localStorage.setItem(key, dataUri);
      } catch {
        // localStorage quota exceeded or not available
      }

      setAvatarUri(dataUri);
      return dataUri;
    },
    [userId]
  );

  return { avatarUri, isLoading, saveAvatar };
}

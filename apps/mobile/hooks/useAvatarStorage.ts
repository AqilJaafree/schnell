import { useState, useEffect, useCallback } from 'react';
import * as SecureStore from 'expo-secure-store';
import { File, Directory, Paths } from 'expo-file-system';

const AVATAR_URI_KEY_PREFIX = 'schnell_avatar_uri_';

function getAvatarKey(userId: string) {
  return `${AVATAR_URI_KEY_PREFIX}${userId.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
}

export function useAvatarStorage(userId: string | undefined) {
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    const key = getAvatarKey(userId);
    SecureStore.getItemAsync(key)
      .then((uri) => {
        if (uri) {
          const file = new File(uri);
          if (file.exists) {
            setAvatarUri(uri);
          }
        }
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  }, [userId]);

  const saveAvatar = useCallback(
    async (base64Data: string): Promise<string | null> => {
      if (!userId) return null;

      const avatarDir = new Directory(Paths.document, 'avatars');
      if (!avatarDir.exists) {
        avatarDir.create();
      }

      const sanitizedId = userId.replace(/[^a-zA-Z0-9]/g, '_');
      const avatarFile = new File(avatarDir, `${sanitizedId}_avatar.png`);

      // Decode base64 and write as bytes
      const binaryString = atob(base64Data);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      avatarFile.write(bytes);

      const fileUri = avatarFile.uri;
      const key = getAvatarKey(userId);
      await SecureStore.setItemAsync(key, fileUri);
      setAvatarUri(fileUri);

      return fileUri;
    },
    [userId]
  );

  return { avatarUri, isLoading, saveAvatar };
}

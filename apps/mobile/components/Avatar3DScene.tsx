import React, { useRef, useState, useEffect, Suspense } from 'react';
import { View, StyleSheet, ActivityIndicator, ImageSourcePropType } from 'react-native';
import { Canvas, useFrame } from '@react-three/fiber/native';
import * as THREE from 'three';
import { loadAsync } from 'expo-three';
import { Asset } from 'expo-asset';
import { Colors } from '../constants/theme';

interface Avatar3DSceneProps {
  avatarUri: string | null;
  topImage: ImageSourcePropType | undefined;
  bottomImage: ImageSourcePropType | undefined;
  width: number;
  height: number;
}

function useTextureFromAsset(source: ImageSourcePropType | undefined): THREE.Texture | null {
  const [texture, setTexture] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    if (!source) {
      setTexture(null);
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        const tex = await loadAsync(source as number);
        if (!cancelled && tex) {
          tex.needsUpdate = true;
          setTexture(tex);
        }
      } catch {
        // Texture load failed silently
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [source]);

  return texture;
}

function useTextureFromUri(uri: string | null): THREE.Texture | null {
  const [texture, setTexture] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    if (!uri) {
      setTexture(null);
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        const asset = Asset.fromURI(uri);
        await asset.downloadAsync();
        const tex = await loadAsync(asset);
        if (!cancelled && tex) {
          tex.needsUpdate = true;
          setTexture(tex);
        }
      } catch {
        // Texture load failed silently
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [uri]);

  return texture;
}

function AvatarPlane({ avatarUri }: { avatarUri: string }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const texture = useTextureFromUri(avatarUri);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.06;
    }
  });

  if (!texture) return null;

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <planeGeometry args={[2.2, 3.6]} />
      <meshBasicMaterial map={texture} transparent />
    </mesh>
  );
}

function ClothingOverlay({
  source,
  position,
  size,
}: {
  source: ImageSourcePropType | undefined;
  position: [number, number, number];
  size: [number, number];
}) {
  const parentRef = useRef<THREE.Group>(null);
  const texture = useTextureFromAsset(source);

  useFrame((state) => {
    if (parentRef.current) {
      parentRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.06;
    }
  });

  if (!texture || !source) return null;

  return (
    <group ref={parentRef}>
      <mesh position={position}>
        <planeGeometry args={size} />
        <meshBasicMaterial map={texture} transparent opacity={0.85} />
      </mesh>
    </group>
  );
}

function Scene({
  avatarUri,
  topImage,
  bottomImage,
}: {
  avatarUri: string | null;
  topImage: ImageSourcePropType | undefined;
  bottomImage: ImageSourcePropType | undefined;
}) {
  return (
    <>
      <ambientLight intensity={1.2} />
      {avatarUri && <AvatarPlane avatarUri={avatarUri} />}
      <ClothingOverlay
        source={topImage}
        position={[0, 0.55, 0.02]}
        size={[1.8, 1.6]}
      />
      <ClothingOverlay
        source={bottomImage}
        position={[0, -0.95, 0.02]}
        size={[1.6, 1.8]}
      />
    </>
  );
}

export default function Avatar3DScene({
  avatarUri,
  topImage,
  bottomImage,
  width,
  height,
}: Avatar3DSceneProps) {
  return (
    <View style={[styles.container, { width, height }]}>
      <Canvas
        camera={{ position: [0, 0, 4], fov: 45 }}
        style={styles.canvas}
        gl={{ antialias: true }}
      >
        <Suspense fallback={null}>
          <Scene
            avatarUri={avatarUri}
            topImage={topImage}
            bottomImage={bottomImage}
          />
        </Suspense>
      </Canvas>
      {!avatarUri && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="small" color={Colors.mutedText} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    borderRadius: 16,
    backgroundColor: Colors.surface,
  },
  canvas: {
    flex: 1,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surface,
  },
});

import React, { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Colors } from '../constants/theme';

interface Avatar3DSceneProps {
  avatarUri: string | null;
  topImage: any;
  bottomImage: any;
  width: number;
  height: number;
}

function useTextureFromSource(source: any): THREE.Texture | null {
  const [texture, setTexture] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    if (!source) {
      setTexture(null);
      return;
    }

    let cancelled = false;
    const loader = new THREE.TextureLoader();

    // On web, require() for images resolves to a URL string
    const url = typeof source === 'string' ? source : source.default || source;
    if (!url || typeof url !== 'string') return;

    loader.load(
      url,
      (tex) => {
        if (!cancelled) {
          tex.needsUpdate = true;
          setTexture(tex);
        }
      },
      undefined,
      () => {
        // Texture load failed silently
      }
    );

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
    const loader = new THREE.TextureLoader();

    loader.load(
      uri,
      (tex) => {
        if (!cancelled) {
          tex.needsUpdate = true;
          setTexture(tex);
        }
      },
      undefined,
      () => {
        // Texture load failed silently
      }
    );

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
  source: any;
  position: [number, number, number];
  size: [number, number];
}) {
  const parentRef = useRef<THREE.Group>(null);
  const texture = useTextureFromSource(source);

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
  topImage: any;
  bottomImage: any;
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
    <div
      style={{
        width,
        height,
        overflow: 'hidden',
        borderRadius: 16,
        backgroundColor: Colors.surface,
        position: 'relative',
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 4], fov: 45 }}
        style={{ width: '100%', height: '100%' }}
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
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: Colors.surface,
          }}
        >
          <span style={{ color: Colors.mutedText }}>Loading...</span>
        </div>
      )}
    </div>
  );
}

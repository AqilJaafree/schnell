// Web shim for expo-application
// Privy SDK requires applicationId which expo-application returns as null on web.
// This provides the bundle ID from app.config.ts so Privy can initialize.
export const applicationId = 'com.schnell.mobile';
export const applicationName = 'Schnell';
export const nativeApplicationVersion = '1.0.0';
export const nativeBuildVersion = '1';

export function getInstallReferrerAsync() {
  return Promise.resolve(null);
}
export function getInstallationTimeAsync() {
  return Promise.resolve(null);
}

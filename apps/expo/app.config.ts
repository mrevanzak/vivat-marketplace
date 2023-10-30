import type { ExpoConfig } from "@expo/config";





const defineConfig = (): ExpoConfig => ({
  name: "Vivat Martketplace",
  slug: "vivat-marketplace",
  scheme: "vivat.marketplace.app",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  userInterfaceStyle: "light",
  splash: {
    image: "./assets/splashscreen.png",
    resizeMode: "contain",
  },
  updates: {
    fallbackToCacheTimeout: 0,
  },
  assetBundlePatterns: ["**/*"],
  ios: {
    bundleIdentifier: "vivat.marketplace.app",
    supportsTablet: true,
    config: {
      usesNonExemptEncryption: false,
    },
  },
  android: {
    package: "vivat.marketplace.app",
    adaptiveIcon: {
      foregroundImage: "./assets/icon.png",
      backgroundColor: "#1F104A",
    },
  },
  // extra: {
  //   eas: {
  //     projectId: "your-eas-project-id",
  //   },
  // },
  experiments: {
    tsconfigPaths: true,
    typedRoutes: true,
  },
  plugins: ["expo-router", "./expo-plugins/with-modify-gradle.js"],
  extra: {
    CLERK_PUBLISHABLE_KEY: process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY,
  },
});

export default defineConfig;
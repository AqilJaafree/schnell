const path = require("path");
const { getDefaultConfig } = require("expo/metro-config");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

const resolveRequestWithPackageExports = (context, moduleName, platform) => {
  // On web, shim expo-application so Privy gets a valid applicationId
  if (platform === "web" && moduleName === "expo-application") {
    return {
      type: "sourceFile",
      filePath: path.resolve(__dirname, "shims/expo-application.web.js"),
    };
  }

  if (moduleName === "jose") {
    const ctx = {
      ...context,
      unstable_conditionNames: ["browser"],
    };
    return ctx.resolveRequest(ctx, moduleName, platform);
  }

  return context.resolveRequest(context, moduleName, platform);
};

config.resolver.resolveRequest = resolveRequestWithPackageExports;

// Three.js modules may use .cjs extension
config.resolver.sourceExts = [...config.resolver.sourceExts, 'cjs'];

module.exports = config;

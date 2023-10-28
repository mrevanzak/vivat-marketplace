/** @type {import("@babel/core").ConfigFunction} */
module.exports = function (api) {
  api.cache.forever();

  return {
    presets: ["babel-preset-expo"],
    plugins: [require.resolve("expo-router/babel"), 'react-native-reanimated/plugin'],
  };
};

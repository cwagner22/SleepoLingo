module.exports = {
  presets: ["module:metro-react-native-babel-preset"],
  env: {
    production: {
      plugins: ["ignite-ignore-reactotron"]
    },
    test: {
      plugins: ["rewire"]
    }
  },
  plugins: [["@babel/plugin-proposal-decorators", { legacy: true }]]
};

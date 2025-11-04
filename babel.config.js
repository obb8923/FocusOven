module.exports = {
  presets: ['module:@react-native/babel-preset','nativewind/babel'],
  plugins: [
    'react-native-worklets/plugin'// 무조건 마지막에 추가
  ],
};

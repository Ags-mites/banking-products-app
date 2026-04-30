module.exports = {
  preset: 'jest-expo',
  setupFilesAfterEnv: ['@testing-library/react-native/extend-expect'],
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/(?!vector-icons)|@expo-google-fonts|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg)',
  ],
  moduleNameMapper: {
    '^react-native-svg$': '<rootDir>/__mocks__/react-native-svg.js',
  },
  collectCoverageFrom: [
    'shared/lib/**/*.ts',
    'shared/ui/**/*.tsx',
    'features/**/*.ts',
    '!shared/ui/icons/**',
    '!**/__tests__/**',
    '!**/node_modules/**',
  ],
};

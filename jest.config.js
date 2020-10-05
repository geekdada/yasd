const esModules = ['lodash-es'].join('|')

module.exports = {
  roots: ['<rootDir>/src'],
  preset: 'ts-jest',
  globals: {
    'ts-jest': {
      diagnostics: true,
    },
  },
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/serviceWorker.ts',
    '!src/setupTests.ts',
    '!src/index.tsx',
  ],
  setupFiles: ['./src/setupTests.ts'],
  coveragePathIgnorePatterns: ['./src/types.ts'],
  coverageReporters: ['json', 'lcov', 'text-summary', 'clover'],
  // coverageThreshold: {
  //   global: {
  //     statements: 95,
  //     branches: 95,
  //     lines: 95,
  //     functions: 95,
  //   },
  // },
  transformIgnorePatterns: [`<rootDir>/node_modules/(?!${esModules})`],
  snapshotSerializers: ['enzyme-to-json/serializer'],
  testMatch: ['<rootDir>/src/**/*.test.{js,jsx,ts,tsx}'],
  automock: false,
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
}

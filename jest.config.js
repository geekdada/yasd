import { pathsToModuleNameMapper } from 'ts-jest'

import tsConfig from './tsconfig.json' assert { type: 'json' }

/** @type {import('ts-jest').JestConfigWithTsJest} */
const config = {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'jsdom',
  testMatch: ['<rootDir>/src/**/*.spec.{ts,tsx}'],
  roots: ['<rootDir>'],
  modulePaths: [tsConfig.compilerOptions.baseUrl],
  moduleNameMapper: pathsToModuleNameMapper(tsConfig.compilerOptions.paths, {
    useESM: true,
    prefix: '<rootDir>/',
  }),
  transform: {
    '^.+\\.[tj]sx?$': [
      'ts-jest',
      {
        useESM: true,
      },
    ],
  },
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
}

export default config

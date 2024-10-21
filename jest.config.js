import { pathsToModuleNameMapper } from 'ts-jest';
import tsconfig from './tsconfig.json' assert { type: 'json' };

// Ensure that the paths exist in the tsconfig
if (!tsconfig.compilerOptions || !tsconfig.compilerOptions.paths) {
  throw new Error("tsconfig.json is missing 'compilerOptions.paths'.");
}

export default {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  moduleNameMapper: pathsToModuleNameMapper(tsconfig.compilerOptions.paths, { prefix: '<rootDir>/' }),
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'], // Optional: for any setup code
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
};

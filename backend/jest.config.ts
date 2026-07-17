// jest.config.ts
import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],                  // ← raiz para encontrar testes
  testMatch: ['**/tests/**/*.test.ts'],      // ← busca arquivos .test.ts dentro de tests/
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  verbose: true,
  collectCoverageFrom: [
    'src/modules/**/*.ts',                   // cobertura apenas do código fonte
    '!src/**/*.d.ts',
    '!src/server.ts',
    '!src/data-source.ts',
    '!src/migrations/**',
    '!src/tests/**',                         // ← exclui testes da cobertura
  ],
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: {
        ignoreDeprecations: '6.0',
        esModuleInterop: true,
      },
    }],
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  setupFilesAfterEnv: ['<rootDir>/src/tests/setup.ts'],
};

export default config;
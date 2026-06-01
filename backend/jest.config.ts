import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/src/**/?(*.)+(spec|test).[tj]s?(x)'],
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  verbose: true,
  globals: {
    'ts-jest': {
      tsconfig: {
        ignoreDeprecations: '6.0'
      }
    }
  }
};

export default config;

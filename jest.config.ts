import { Config } from 'jest';
import { pathsToModuleNameMapper } from 'ts-jest';
import { compilerOptions } from './tsconfig.json';

const config: Config = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  clearMocks: true,
  collectCoverageFrom: ['**/*.ts'],
  coverageDirectory: './coverage',
  testEnvironment: 'node',
  testRegex: '.*\\.(e2e|spec)\\.ts$',
  testTimeout: 30000,
  coveragePathIgnorePatterns: [
    './jest.config.ts',
    './jest.unit.config.ts',
    './jest.e2e.config.ts',
    './functions/app/repositories/condominiumMemberRepo.abstract.ts',
    './functions/app/repositories/keyRepo.abstract.ts',
    './functions/app/repositories/routeRepo.abstract.ts',
    './functions/app/adapters/jwt.abstract.ts',
    './functions/app/adapters/reports.abstract.ts',
    './functions/app/adapters/logger.abstract.ts',
    './functions/authGatewayFnc/app/adapters/errorReporting'
  ],
  coverageThreshold: {
    global: {
      functions: 75,
      lines: 80,
      branches: 75,
      statements: 80
    }
  },
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: '<rootDir>/',
  }),
};

export default config;

module.exports = {
  silent: true, // disable console logs
  preset: 'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: ['node_modules', '.d.ts', '.js'],
  verbose: true,
  collectCoverageFrom: ['src/**/*.ts', '!**/node_modules/**'],
  coverageReporters: ['html', 'text', 'text-summary', 'cobertura'],
  testTimeout: 20000,
  globals: {
    'ts-jest': {
      isolatedModules: true,
      babelConfig: true,
    },
  },
  testRegex: 'test.ts',
  collectCoverage: true,
  coveragePathIgnorePatterns: [
    '/tests/',
    '/templates/',
    'src/configurations/',
    'src/server.ts',
  ],
  coverageDirectory: 'coverage/apps',
  coverageThreshold: {
    global: {
      branches: 10,
      functions: 10,
      lines: 10,
      statements: 10,
    },
  },
};

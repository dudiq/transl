module.exports = {
  roots: ['<rootDir>/src'],
  rootDir: '.',
  resetMocks: true,
  testEnvironment: 'node',
  testMatch: ['**/?(*.)+(spec|test).[jt]s?(x)'],
  transform: {
    '^.+\\.ts$': 'esbuild-jest',
  },
  moduleFileExtensions: ['js', 'ts'],
}

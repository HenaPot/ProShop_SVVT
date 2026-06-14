import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Backend unit + integration tests run in a Node environment.
    environment: 'node',
    include: ['backend/__tests__/**/*.test.js'],
    // Integration tests boot an in-memory MongoDB; give them room.
    testTimeout: 30000,
    hookTimeout: 30000,
    // Run test files sequentially to avoid two suites sharing one mongoose
    // default connection at the same time.
    fileParallelism: false,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      reportsDirectory: './coverage',
      include: ['backend/**/*.js'],
      exclude: [
        'backend/__tests__/**',
        'backend/data/**',
        'backend/seeder.js',
        'backend/server.js',
      ],
    },
  },
});

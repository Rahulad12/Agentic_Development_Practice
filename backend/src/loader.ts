// This file registers path aliases for runtime module resolution
// It gets compiled to dist/loader.js and required before dist/server.js
import path from 'path';
import Module from 'module';

const register = require('tsconfig-paths').register;

// Register with dist directory as baseUrl for runtime
register({
  baseUrl: path.join(__dirname, '.'),
  paths: {
    '@/*': ['*']
  }
});

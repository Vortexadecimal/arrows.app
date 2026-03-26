import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    outDir: '../../dist/apps/arrows-app',
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true,
    },
  },
  // Alias the problematic neo4j-driver browser bundle (a pre-built webpack UMD
  // that contains require() calls Rollup can't transform) to a harmless shim.
  // The arrows-app visual editor doesn't need the Neo4j storage feature.
  resolve: {
    alias: {
      'neo4j-driver/lib/browser/neo4j-web.min.js': path.resolve(
        __dirname,
        'src/shims/neo4j-driver-shim.js'
      ),
    },
  },
  // Polyfill process.env.* used by CRA-era code (registerServiceWorker etc.)
  define: {
    'process.env.NODE_ENV': '"production"',
    'process.env.PUBLIC_URL': '""',
  },
  optimizeDeps: {
    include: ['recompose', 'redux-undo', 'js-base64'],
  },
  server: {
    port: 4200,
    open: true,
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: 'src/setupTests.js',
    css: true,
  },
  plugins: [react()],
});


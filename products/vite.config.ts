import { federation } from '@module-federation/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

const reactVersion = '^19.2.4'
const routerVersion = '^7.13.2'

export default defineConfig({
  base: 'http://localhost:5171/',
  plugins: [
    react(),
    federation({
      name: 'products',
      dts: false,
      filename: 'remoteEntry.js',
      exposes: {
        './ProductsApp': './src/ProductsApp.tsx',
      },
      shared: {
        react: { singleton: true, requiredVersion: reactVersion },
        'react-dom': { singleton: true, requiredVersion: reactVersion },
        'react-router-dom': {
          singleton: true,
          requiredVersion: routerVersion,
        },
      },
    }),
  ],
  server: {
    port: 5171,
    strictPort: true,
    origin: 'http://localhost:5171',
  },
  build: {
    target: 'chrome89',
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts',
  },
})

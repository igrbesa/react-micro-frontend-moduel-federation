import { federation } from '@module-federation/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

const reactVersion = '^19.2.4'

export default defineConfig({
  base: 'http://localhost:5172/',
  plugins: [
    react(),
    federation({
      name: 'cart',
      dts: false,
      filename: 'remoteEntry.js',
      exposes: {
        './CartApp': './src/CartApp.tsx',
      },
      shared: {
        react: { singleton: true, requiredVersion: reactVersion },
        'react-dom': { singleton: true, requiredVersion: reactVersion },
      },
    }),
  ],
  server: {
    port: 5172,
    strictPort: true,
    origin: 'http://localhost:5172',
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

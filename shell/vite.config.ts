import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { federation } from '@module-federation/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

const reactVersion = '^19.2.4'
const routerVersion = '^7.13.2'

const projectRoot = path.dirname(fileURLToPath(import.meta.url))

const vitestRemoteAliases: Record<string, string> =
  process.env.VITEST === 'true'
    ? {
        'cart/CartApp': path.resolve(projectRoot, 'src/test/mocks/cartRemoteStub.tsx'),
        'products/ProductsApp': path.resolve(projectRoot, 'src/test/mocks/productsRemoteStub.tsx'),
      }
    : {}

export default defineConfig({
  resolve: {
    alias: vitestRemoteAliases,
  },
  base: 'http://localhost:5173/',
  plugins: [
    react(),
    federation({
      name: 'shell',
      remotes: {
        products: {
          type: 'module',
          name: 'products',
          entry: 'http://localhost:5171/remoteEntry.js',
        },
        cart: {
          type: 'module',
          name: 'cart',
          entry: 'http://localhost:5172/remoteEntry.js',
        },
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
    port: 5173,
    strictPort: true,
    origin: 'http://localhost:5173',
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

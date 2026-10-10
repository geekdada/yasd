import { fileURLToPath, URL } from 'node:url'

import tailwindcss from '@tailwindcss/postcss'
import react from '@vitejs/plugin-react'
import { loadEnv, defineConfig } from 'vite-plus'
import { VitePWA } from 'vite-plugin-pwa'

import packageJson from './package.json' with { type: 'json' }

const ignoredPaths = [
  '.agents/**',
  '**/*.md',
  'build/**',
  'coverage/**',
  'node_modules/**',
  'public/**',
  // Arc files must match the registry exactly. Otherwise `shadcn add` asks to overwrite them on every install.
  'src/components/arc/**',
  'src/utils/shadcn.ts',
]

const mode =
  process.env.VITEST === 'true'
    ? 'test'
    : process.env.NODE_ENV === 'production'
      ? 'production'
      : 'development'
const env = loadEnv(mode, process.cwd(), '')
const urlPathPrefix =
  process.env.VITE_URL_PATH_PREFIX ?? env.VITE_URL_PATH_PREFIX ?? ''
const runInSurge =
  (process.env.VITE_RUN_IN_SURGE ?? env.VITE_RUN_IN_SURGE) === 'true'
const isTest = process.env.VITEST === 'true'

const getBasePath = (urlPathPrefix = '') => {
  if (!urlPathPrefix) {
    return '/'
  }

  return urlPathPrefix.endsWith('/') ? urlPathPrefix : `${urlPathPrefix}/`
}

const config = defineConfig({
  fmt: {
    semi: false,
    useTabs: false,
    tabWidth: 2,
    singleQuote: true,
    trailingComma: 'all',
    bracketSpacing: true,
    printWidth: 80,
    ignorePatterns: ignoredPaths,
  },
  lint: {
    ignorePatterns: ignoredPaths,
    options: {
      typeAware: true,
      typeCheck: true,
    },
    rules: {
      'no-debugger': 'warn',
    },
  },
  staged: {
    '*.{js,jsx,ts,tsx}': 'vp check --fix',
  },
  base: getBasePath(urlPathPrefix),
  css: {
    postcss: {
      plugins: [tailwindcss()],
    },
  },
  plugins: [
    ...react(),
    ...(isTest
      ? []
      : [
          VitePWA({
            strategies: 'injectManifest',
            srcDir: 'src',
            filename: 'service-worker.ts',
            injectRegister: false,
            manifest: false,
            injectManifest: {
              globPatterns: ['**/*.{js,css,html,ico,png,svg,json}'],
              maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
            },
          }),
        ]),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      'react-virtualized': fileURLToPath(
        new URL(
          './node_modules/react-virtualized/dist/commonjs/index.js',
          import.meta.url,
        ),
      ),
    },
  },
  optimizeDeps: {
    include: ['react-virtualized'],
  },
  define: {
    'import.meta.env.VITE_VERSION': JSON.stringify(packageJson.version),
  },
  build: {
    outDir: 'build',
    sourcemap: !runInSurge,
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.ts'],
    include: ['src/**/*.spec.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
    },
  },
})

export default config

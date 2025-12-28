import { defineConfig } from 'wxt';
import react from '@vitejs/plugin-react';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  // Disable auto-imports (per user preference)
  imports: false,

  // Directory structure
  srcDir: 'src',
  outDir: '.output',

  // React module
  modules: ['@wxt-dev/module-react', '@wxt-dev/auto-icons'],

  // Manifest configuration (migrated from src/manifest.json)
  manifest: {
    name: 'MoneyForward Web Tools',
    description: 'Web tools for MoneyForward',
    version: '1.1.0',
    permissions: ['storage', 'activeTab'],
    host_permissions: ['https://*.moneyforward.com/*'],
  },

  // Path alias (@/* → src/*)
  alias: {
    '@': resolve(__dirname, './src'),
  },

  // Vite passthrough for React plugin
  vite: () => ({
    plugins: [react()],
  }),
});

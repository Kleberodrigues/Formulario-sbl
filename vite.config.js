/**
 * Vite Configuration
 * Configuração do bundler para SBL Onboarding Form
 */

import { defineConfig } from 'vite'

export default defineConfig({
  // Diretório raiz do projeto
  root: './',

  // Diretório de saída para build
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: true,

    // Otimizações
    minify: 'terser',
    target: 'es2015',

    rollupOptions: {
      output: {
        // Organizar arquivos na build
        assetFileNames: 'assets/[name].[hash][extname]',
        chunkFileNames: 'js/[name].[hash].js',
        entryFileNames: 'js/[name].[hash].js'
      }
    }
  },

  // Servidor de desenvolvimento
  server: {
    port: 3000,
    open: true,
    cors: true
  },

  // Preview (após build)
  preview: {
    port: 4000,
    open: true
  },

  // Aliases para imports
  resolve: {
    alias: {
      '@': '/src',
      '@config': '/src/config',
      '@components': '/src/components',
      '@pages': '/src/pages',
      '@services': '/src/services',
      '@utils': '/src/utils',
      '@styles': '/src/styles'
    }
  }
})

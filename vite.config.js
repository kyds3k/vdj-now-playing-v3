// vite.config.js
import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  rollupOptions: {
    input: {
      main: resolve(__dirname, 'index.html'),
      nested: resolve(__dirname, 'funfacts/index.html'),
    },
    output: {
      entryFileNames () {
        return 'scripts/[name].js'
      }
    },    
  }
})

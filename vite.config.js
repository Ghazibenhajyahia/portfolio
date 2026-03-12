import { resolve } from 'path'
import { fileURLToPath } from 'url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

export default {
  base: './',
  build: {
    rollupOptions: {
      input: {
        main:      resolve(__dirname, 'index.html'),
        blackhole: resolve(__dirname, 'blackhole.html'),
        enigma:    resolve(__dirname, 'enigma.html'),
        farm:      resolve(__dirname, 'farm.html'),
        credits:   resolve(__dirname, 'credits.html'),
      }
    }
  }
}

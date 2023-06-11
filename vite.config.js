import { join } from 'node:path'
import { readdir, rm } from 'node:fs/promises'
import { defineConfig } from 'vite'
import { ViteMinifyPlugin } from 'vite-plugin-minify'

export default defineConfig({
  base: '',
  root: 'src',
  build: {
    outDir: '../dist',
    emptyOutDir: false
  },
  publicDir: 'assets',
  server: {
    port: 8890,
    host: true
  },
  plugins: [
    {
      name: 'Cleaning dist folder',
      async buildStart () {
        let filePaths = []
        try {
          filePaths = await readdir(join(__dirname, 'dist'))
        } catch (err) {
          if (err.code !== 'ENOENT') {
            throw err
          }
        }
        for (const filePath of filePaths) {
          if (filePath.startsWith('.git')) {
            continue
          }
          const fullFilePath = join(__dirname, 'dist', filePath)
          await rm(fullFilePath, { recursive: true })
        }
      }
    },
    ViteMinifyPlugin({})
  ]
})

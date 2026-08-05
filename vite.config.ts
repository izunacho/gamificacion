import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react(), tailwindcss()],
  // GitHub Pages serves this repo under /gamificacion/, so production builds
  // (build + preview, both mode "production") need that base path. `vite
  // preview` reuses command "serve" just like dev, so branching on `command`
  // instead of `mode` would incorrectly serve preview from root too.
  base: mode === 'production' ? '/gamificacion/' : '/',
}))

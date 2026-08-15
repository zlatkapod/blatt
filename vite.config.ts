// vitest/config re-exports Vite's defineConfig and adds the `test` key.
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    // Exported files embed base64 images; keep the app's own assets as files.
    assetsInlineLimit: 0,
  },
  test: {
    environment: 'jsdom',
    include: ['src/**/*.test.{ts,tsx}'],
    // Vitest skips CSS processing by default, which would make the
    // `sheet.css?inline` import resolve to an empty string and quietly
    // hide a broken export. Process it, so the test sees what ships.
    css: true,
  },
})

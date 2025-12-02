import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/3tarot/', // GitHub Pages 저장소 이름에 맞게 설정
})

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  base: '/next-calculadoraproporcional/',
  plugins: [react()],
})
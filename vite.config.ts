import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  base: "/", //base para run dev, e também para deploy na vercel
  //base: '/calculadora-salario-proporcional/', // Base URL para github pages, ajustar conforme necessário
  plugins: [react()],
})
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // O SEGREDO ESTÁ AQUI: O nome tem que ser EXATAMENTE igual ao link do GitHub
  base: '/Cart-oaniversario/', 
})
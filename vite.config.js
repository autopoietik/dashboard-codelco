import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/dashboard-codelco/", // <--- AGREGA ESTA LÍNEA (con el nombre de tu repo)
})

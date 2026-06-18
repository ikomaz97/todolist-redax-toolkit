import path from "path"
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react-swc"

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Для GitHub Pages используем basePath, для Vercel — root
  const base = mode === 'gh-pages' ? '/todolist-redax-toolkit/' : '/'
  
  return {
    plugins: [react()],
    base,
    resolve: {
      alias: {
        "@/": `${path.resolve(__dirname, "src")}/`,
      },
    },
  }
})

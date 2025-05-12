import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
const url = import.meta.env.BACKEND_BASE_URL || "http://localhost:5001"

export default defineConfig({
  plugins: [react(), tailwindcss()],
  theme: {
    extend: {},
  },
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: url,
        changeOrigin: true,
        secure: false,
        withCredentials: true,
      },
    },
  },
});

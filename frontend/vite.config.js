import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  theme: {
    extend: {},
  },
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "https://my-chatty-back.vercel.app/",
        changeOrigin: true,
        secure: false,
        withCredentials: true,
      },
    },
  },
});

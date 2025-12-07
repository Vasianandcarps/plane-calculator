import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: '/plane-calculator/',
  plugins: [react()],
  resolve: {
    alias: {
      "@": "/src",
    },
  },
  assetsInclude: ["**/*.xlsx"], // <- добавляем поддержку Excel
});

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./tests/setup.js",
  },
  server: {
    host: "0.0.0.0",
    port: 8080,
    proxy: {
      // Proxy requests matching /hello to the backend
      "/hello": "http://localhost:3000",
    },
  },
});

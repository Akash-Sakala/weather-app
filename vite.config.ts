// import path from "path";
// import react from "@vitejs/plugin-react";
// import { defineConfig } from "vite";

// export default defineConfig({
//   plugins: [react()],
//   resolve: {
//     alias: {
//       "@": path.resolve(__dirname, "./src"),
//     },
//   },
// });
import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  // 🔥 Required for Render
  build: {
    outDir: "dist",
    sourcemap: false,
    chunkSizeWarningLimit: 800, // prevents warnings on heavy bundles
  },

  // ⚠️ Required so routing works on Render
  server: {
    host: true,
    port: 5173,
  }
});

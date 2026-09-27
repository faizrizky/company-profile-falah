import { fileURLToPath } from "node:url";

import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL(".", import.meta.url)),
      // Next's guard against importing server code in the browser; tests run on the server.
      "server-only": fileURLToPath(new URL("./node_modules/server-only/empty.js", import.meta.url)),
    },
  },
  esbuild: { jsx: "automatic" },
  test: {
    include: ["lib/**/*.test.ts", "components/**/*.test.ts"],
  },
});

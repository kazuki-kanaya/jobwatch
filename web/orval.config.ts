import { defineConfig } from "orval";

export default defineConfig({
  obsern: {
    input: "./openapi.json",
    output: {
      target: "./src/generated/api.ts",
      client: "react-query",
      httpClient: "axios",
      override: {
        mutator: {
          path: "./src/lib/api.ts",
          name: "axiosInstance",
        },
      },
    },
  },
});

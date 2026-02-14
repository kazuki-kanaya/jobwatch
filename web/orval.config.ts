import { defineConfig } from "orval";

export default defineConfig({
  jobwatch: {
    input: "./openapi.json",
    output: {
      target: "./src/generated/api.ts",
      client: "react-query",
      schemas: {
        path: "./src/generated/models",
        type: "zod",
      },
    },
  },
});

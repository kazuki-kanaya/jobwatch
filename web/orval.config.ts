import { defineConfig } from "orval";

export default defineConfig({
  jobwatch: {
    input: "./openapi.json",
    output: {
      target: "./src/generated/clients.ts",
      client: "react-query",
      httpClient: "fetch",
      schemas: {
        path: "./src/generated/schemas",
        type: "zod",
      },
    },
  },
});

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "fs";

const options = {
  key: fs.readFileSync("../localhost-key.pem"),
  cert: fs.readFileSync("../localhost.pem"),
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    https: options,
  },
});

import { defineConfig } from "oxlint";
import preset from "../../src/index.ts";

export default defineConfig({
  extends: [preset],
});

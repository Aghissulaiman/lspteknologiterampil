import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const { loadEnvConfig } = require("@next/env") as typeof import("@next/env");

const backendDirectory = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
export const backendRoot = backendDirectory;

loadEnvConfig(backendRoot);

// frontend/src/services/__tests__/register-loader.mjs
import { register } from "node:module";

register("./vite-env-loader.mjs", import.meta.url);
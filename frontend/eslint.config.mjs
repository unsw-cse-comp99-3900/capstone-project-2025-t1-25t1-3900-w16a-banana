import { defineConfig } from "eslint/config";
import globals from "globals";
import js from "@eslint/js";
import pluginReact from "eslint-plugin-react";

export default defineConfig([
  { files: ["**/*.{js,mjs,cjs,jsx}"] },
  { files: ["**/*.{js,mjs,cjs,jsx}"], languageOptions: { globals: globals.browser } },
  { 
    files: ["**/*.{js,mjs,cjs,jsx}"], 
    plugins: { js }, 
    extends: ["js/recommended"],
    rules: {
      "quotes": ["error", "double"],
      "semi": ["error", "always"]
    }
  },
  {
    ...pluginReact.configs.flat.recommended,
    settings: {
      react: { version: "detect" }
    },
    rules: {
      ...pluginReact.configs.flat.recommended.rules,
      "react/prop-types": "off"  // Turn off missing props validation
    }
  }
]);
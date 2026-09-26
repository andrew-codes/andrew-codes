import js from "@eslint/js"
import reactPlugin from "eslint-plugin-react"
import reactHooksPlugin from "eslint-plugin-react-hooks"
import globals from "globals"
import tseslint from "typescript-eslint"
import prettierConfig from "eslint-config-prettier"

export default tseslint.config(
  {
    ignores: [
      "build/**",
      "public/build/**",
      "server-build/**",
      "dist/**",
      ".react-router/**",
      "deployment/dist/**",
      "app/public/files/**",
      ".yarn/**",
      // Auto-generated Yarn PnP runtime, not project source.
      ".pnp.cjs",
      ".pnp.loader.mjs",
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  reactPlugin.configs.flat.recommended,
  reactPlugin.configs.flat["jsx-runtime"],
  {
    plugins: {
      "react-hooks": reactHooksPlugin,
    },
    rules: reactHooksPlugin.configs.recommended.rules,
  },
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/no-explicit-any": "off",
      "no-unused-vars": "off",
      // TypeScript already validates prop types statically; this rule is
      // redundant and produces false positives on generic component props.
      "react/prop-types": "off",
    },
  },
  prettierConfig,
)

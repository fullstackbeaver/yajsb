// eslint.config.js
import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";

export default [
  {
    files: ["**/*.ts", "**/*.tsx"], // Apply config to TypeScript files
    languageOptions: {
      parser: tsParser,
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        Atomics: "readonly",
        SharedArrayBuffer: "readonly",
        process: "readonly",  // For Node.js environment
        __dirname: "readonly",
        module: "readonly",
        require: "readonly",
        console: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly"
      }
    },
    plugins: {
      "@typescript-eslint": tsPlugin
    },
    rules: {
      "react/prop-types": "off",
      indent: [
        "warn",
        2,
        {
          SwitchCase: 1
        }
      ],
      quotes: [
        "warn",
        "double"
      ],
      "no-unused-vars": "error",
      semi: [
        "error",
        "always"
      ],
      "no-case-declarations": "off",
      "no-constructor-return": [
        "warn"
      ],
      "no-else-return": [
        "warn",
        {
          allowElseIf: true
        }
      ],
      "no-extra-bind": [
        "warn"
      ],
      "no-implicit-coercion": [
        "warn"
      ],
      "generator-star-spacing": [
        "warn"
      ],
      "no-useless-constructor": [
        "warn"
      ],
      "prefer-const": [
        "error",
        {
          destructuring: "any",
          ignoreReadBeforeAssign: false
        }
      ],
      "no-delete-var": "off",
      "linebreak-style": [
        "warn",
        "unix"
      ],
      complexity: [
        "error",
        11
      ],
      "prefer-spread": [
        "warn"
      ],
      camelcase: [
        "warn"
      ],
      eqeqeq: [
        "error",
        "always",
        {
          null: "ignore"
        }
      ],
      "no-eval": "error",
      "key-spacing": [
        "warn",
        {
          align: "colon"
        }
      ],
      "keyword-spacing": [
        "warn",
        {
          before: true,
          after: true,
          overrides: {}
        }
      ],
      "arrow-spacing": [
        "warn"
      ],
      "sort-imports": [
        "error"
      ],
      "sort-keys": [
        "warn"
      ],
      "no-trailing-spaces": [
        "warn"
      ],
      "no-multiple-empty-lines": [
        "error",
        {
          max: 1,
          maxEOF: 0
        }
      ],
      "new-cap": [
        "warn",
        {
          newIsCap: false
        }
      ],
      "max-lines-per-function": [
        "error",
        70
      ],
      "multiline-ternary": [
        "warn",
        "always-multiline"
      ],
      "no-useless-catch": [
        "error"
      ],
      "accessor-pairs": [
        "warn",
        {
          enforceForClassMembers: true
        }
      ],
      "block-scoped-var": [
        "warn"
      ],
      "@typescript-eslint/no-var-requires": "off",
      "object-curly-spacing": [
        "error",
        "always"
      ]
    }
  }
];
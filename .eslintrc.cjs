module.exports = {
  root: true,
  env: {
    browser: true,
    es2022: true,
  },
  extends: ["eslint:recommended"],
  ignorePatterns: ["dist", "node_modules"],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: ["react", "react-hooks", "react-refresh"],
  rules: {
    "no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
    "react/jsx-uses-vars": "error",
    "react-hooks/rules-of-hooks": "error",
    "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
  },
  overrides: [
    {
      files: ["server/**/*.js"],
      env: {
        browser: false,
        node: true,
      },
      parserOptions: {
        sourceType: "script",
      },
    },
  ],
};

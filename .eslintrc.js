module.exports = {
  env: {
    commonjs: true,
    es2022: true,
    node: true,
  },
  extends: "eslint:recommended",
  parserOptions: {
    ecmaVersion: 12,
  },
  ignorePatterns: ["03-files-in-folder/secret-folder/script.js"],
  rules: {
    indent: ["error", 2],
    quotes: ["error", "single"],
    semi: ["error", "always"],
  },
};

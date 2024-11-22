// eslint.config.js
export default [
  {
    files: ["**/*.js", "**/*.jsx"],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "module",
    },
    env: {
      browser: true,
      es2021: true,
    },
    plugins: {
      react: require("eslint-plugin-react"),
      "react-hooks": require("eslint-plugin-react-hooks"),
      cypress: require("eslint-plugin-cypress"),
    },
    rules: {
      "no-unused-vars": "off",
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    linterOptions: {
      extend: [
        "react-app",
        "eslint:recommended",
        "plugin:react/recommended",
        "plugin:react-hooks/recommended",
        "plugin:cypress/recommended",
      ],
    },
  },
];

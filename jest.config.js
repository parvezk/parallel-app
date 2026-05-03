const { pathsToModuleNameMapper } = require("ts-jest");
const { compilerOptions } = require("./tsconfig");

module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  moduleFileExtensions: ["js", "jsx", "ts", "tsx"],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: "<rootDir>/",
  }),

  transform: {
    "^.+\\.(ts|tsx)$": [
      "babel-jest",
      {
        presets: [
          "@babel/preset-env",
          "@babel/preset-react",
          "@babel/preset-typescript",
        ],
      },
    ],
    "^.+\\.(js|jsx)$": [
      "babel-jest",
      { presets: ["@babel/preset-env", "@babel/preset-react"] },
    ],
  },
  globals: {
    "ts-jest": {
      useESM: true, // Enable ESM support in ts-jest
    },
  },
  transformIgnorePatterns: ["/node_modules/(?!(@babel/runtime|lucide-react)/)"],
  collectCoverage: true,
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/**/*.d.ts",
    "!src/lib/**",
    "!src/gql/**",
    "!src/db/**",
    "!src/utils/**",
  ],
  coverageReporters: ["text", "lcov"],
  testPathIgnorePatterns: [
    "/node_modules/",
    "/src/lib/",
    "/src/gql/",
    "/src/db/",
    // TopBar.test conflicts with --experimental-vm-modules (Jest torn-down error)
    "TopBar.test",
  ],
  watchPlugins: [
    "jest-watch-typeahead/filename",
    "jest-watch-typeahead/testname",
    "jest-watch-select-projects",
  ],
};

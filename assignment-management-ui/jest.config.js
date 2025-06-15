module.exports = {
  transform: {
    "^.+\\.(ts|tsx|js|jsx)$": "babel-jest",
  },
  testEnvironment: "jsdom",
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy", // Mock CSS imports
  },
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"], // Jest setup file
  transformIgnorePatterns: ["/node_modules/(?!axios).+\\.js$"], // Transform axios for ESM compatibility
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  coveragePathIgnorePatterns: [
    "/node_modules/", // Ignore coverage for node_modules
    ".*\\.d\\.ts", // Ignore TypeScript definition files
  ],
};

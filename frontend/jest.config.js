module.exports = {
    preset: "jest-expo",
    moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/$1",
    },
    testPathIgnorePatterns: ["/node_modules/", "/android/", "/ios/"],
    testMatch: ["**/__tests__/**/*.test.(ts|tsx)"],
    setupFiles: ["./src/__tests__/setup.ts"],
};

module.exports = {
    collectCoverageFrom: [
        '**/*.ts',
        '**/*.js',
    ],
    coverageThreshold: {
        global: {
            branches: 100,
            functions: 100,
            lines: 100,
            statements: 100,
        },
    },
    coveragePathIgnorePatterns: [
        '<rootDir>/node_modules/',
        '<rootDir>/lib/',
        '<rootDir>/coverage/',
        '<rootDir>/jest.config.js',
        '<rootDir>/src/index.ts',
    ],
    setupFilesAfterEnv: ['./__mocks__/support.js'],
    testEnvironment: 'node',
};

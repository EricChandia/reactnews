module.exports = {
    testPathIgnorePatterns: ['/node_modules', '/.next'],
    setupFilesAfterEnv: [
        '<rootDir>/tests/setupTests.ts'
    ],
    transform: {
        '^.+\\.(js|jsx|ts|tsx)$': "<rootDir>/node_modules/babel-jest"
    },
    moduleNameMapper: {
        '\\.(scss|css|sass)$': "identity-obj-proxy",
        "\\.(jpg|ico|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "<rootDir>/tests/__mocks__/fileMock.js",
    },
    testEnvironment: 'jsdom'
};
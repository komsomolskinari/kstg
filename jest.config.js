module.exports = {
    testEnvironment: 'node',
    roots: ['<rootDir>'],
    testRegex: [/test[0-9a-zA-Z\/_-]+\.ts$/],
    collectCoverage: true,
    forceCoverageMatch: ['**/*.ts']
};

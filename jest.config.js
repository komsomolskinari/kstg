module.exports = {
    preset: 'ts-jest/presets/js-with-ts',
    testEnvironment: 'node',
    roots: ['<rootDir>/test'],
    testRegex: '\\.ts$',
    collectCoverageFrom: ['src/*.ts']
};

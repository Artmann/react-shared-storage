/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  testPathIgnorePatterns: [
    '/coverage/',
    '/demo/',
    '/dist/',
    '/node_modules/'
  ]
}

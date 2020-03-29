// Taken from jest:
// https://github.com/facebook/jest/blob/v19.0.2/packages/jest-cli/src/constants.js#L15
const isWindows = process.platform === 'win32'
const CLEAR = isWindows ? '\u001Bc' : '\u001B[2J\u001B[3J\u001B[H'

process.stdout.write(CLEAR)

import commonjs from '@rollup/plugin-commonjs'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import babel from '@rollup/plugin-babel'
import json from '@rollup/plugin-json'

const extensions = ['.js', '.jsx', '.ts', '.tsx']

export default {
  input: './src/cli/cli.ts',

  // Specify here external modules which you don't want to include in your bundle (for instance: 'lodash', 'moment' etc.)
  // https://rollupjs.org/guide/en/#external
  // eslint-diable-next-line @typescript-eslint/no-unsafe-member-access
  external: [(id) => id.includes('@babel/runtime')],

  plugins: [
    json(),

    // Allows node_modules resolution
    nodeResolve({ extensions }),

    // Allow bundling cjs modules. Rollup doesn't understand cjs
    commonjs(),

    // Compile TypeScript/JavaScript files
    babel({
      extensions,
      babelHelpers: 'runtime',
      exclude: 'node_modules/**',
      // include: ['src/**/*'],
    }),
  ],
  output: [
    {
      file: 'covid19_scenarios.mjs',
      format: 'esm',
    },
    {
      file: 'covid19_scenarios.js',
      format: 'cjs',
    },
  ],
}

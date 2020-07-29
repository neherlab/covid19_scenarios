/* eslint-disable no-restricted-globals */
/* Necessary because 'self' should be accepted as a global in webworkers. */

import 'regenerator-runtime'

import { run, RunParams } from '../../algorithms/run'

self.addEventListener('message', (event: MessageEvent) => {
  const args = event.data as RunParams

  run(args)
    .then((result) => self.postMessage({ result }))
    .catch((error) => self.postMessage({ error: errorToString(error) }))
})

/* Firefox cannot do structured cloning of Error types,
 * therefore we convert the error into a string.
 * Track https://bugzilla.mozilla.org/show_bug.cgi?id=1556604
 */
function errorToString(error: Error): string {
  return `Algorithm error:${error.name}:${error.message}`
}

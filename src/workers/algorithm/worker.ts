/* eslint-disable no-restricted-globals */
/* Necessary because 'self' should be accepted as a global in webworkers. */

import 'regenerator-runtime'
import { run } from '../../algorithms/run'

self.addEventListener('message', (event) => {
  const args = event.data

  run(...args)
    .then((result) => self.postMessage({ result }))
    .catch((error) => self.postMessage({ error }))
})

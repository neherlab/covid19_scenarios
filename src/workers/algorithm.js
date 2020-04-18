import 'regenerator-runtime'
import { run } from '../algorithms/run'

addEventListener('message', (event) => {
  const [args] = event.data

  run(...args)
    .then((result) => postMessage({ result }))
    .catch((error) => postMessage({ error }))
})

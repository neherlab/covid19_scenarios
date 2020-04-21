import { polyfill, polyfillWithWindow } from './helpers/polyfill'

export default polyfill()
  .then(polyfillWithWindow)
  .then(() => require('./index'))
  .catch((error) => console.error(error))

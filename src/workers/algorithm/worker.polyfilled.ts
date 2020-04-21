import { polyfill } from '../../helpers/polyfill'

export default polyfill()
  .then(() => require('./worker'))
  .catch((error) => console.error(error))

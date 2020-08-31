import { actionCreatorFactory } from 'src/state/util/fsaActions'

const action = actionCreatorFactory('App')

export const init = action('init')

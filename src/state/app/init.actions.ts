import actionCreatorFactory from 'typescript-fsa'

const action = actionCreatorFactory('App')

export const init = action('init')

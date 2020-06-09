import { State } from '../reducer'

export const selectLocation = (state: State) => state.router.location

export const selectPathname = (state: State) => state.router.location.pathname

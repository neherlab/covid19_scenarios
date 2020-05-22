import { State } from '../reducer'

export const selectIsAutorunEnabled = (state: State): boolean => state.settings.isAutorunEnabled

export const selectIsLogScale = (state: State): boolean => state.settings.isLogScale

export const selectShouldFormatNumbers = (state: State): boolean => state.settings.shouldFormatNumbers

export const selectAreResultsMaximized = (state: State): boolean => state.settings.areResultsMaximized

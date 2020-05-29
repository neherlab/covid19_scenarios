import actionCreatorFactory from 'typescript-fsa'

import { Locale } from '../../i18n/i18n'

const action = actionCreatorFactory('UI')

export const printPreviewOpenTrigger = action('PRINT_PREVIEW_OPEN')

export const newTabOpenTrigger = action('NEW_TAB_OPEN')

export const setLocale = action<Locale>('SET_LOCALE')

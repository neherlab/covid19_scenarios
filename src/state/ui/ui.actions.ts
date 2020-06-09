import actionCreatorFactory from 'typescript-fsa'

const action = actionCreatorFactory('UI')

export const printPreviewOpenTrigger = action('PRINT_PREVIEW_OPEN')

export const newTabOpenTrigger = action('NEW_TAB_OPEN')

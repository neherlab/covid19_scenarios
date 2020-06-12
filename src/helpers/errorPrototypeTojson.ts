/* eslint-disable no-inner-declarations,cflint/no-this-assignment,@typescript-eslint/ban-ts-comment,no-extend-native */
// @ts-ignore
import { appendDash } from './appendDash'

// @ts-ignore
if (!Error.prototype.toJSON) {
  function toJSON(this: Error) {
    const { message, name, stack } = this
    const stackPretty = stack?.split('\n').map(appendDash)
    return { message, name, stack: stackPretty }
  }
  if (Object.defineProperty) {
    Object.defineProperty(Error.prototype, 'toJSON', {
      value: toJSON,
      configurable: true,
      writable: true,
    })
  } else {
    // @ts-ignore
    Error.prototype.toJSON = toJSON
  }
}

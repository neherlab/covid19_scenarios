import { numeral } from '../i18n'

export function numberFormatter(humanize: boolean, round: boolean) {
  return (value: number) => numeral(value).format(`0${!round ? '.[000]' : ''}${humanize ? 'a' : ''}`)
}

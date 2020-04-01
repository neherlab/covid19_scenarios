import { numbro } from '../i18n'

export function numberFormatter(humanize: boolean, round: boolean) {
  return (value: number) =>
    numbro(value).format({
      average: humanize || undefined,
      trimMantissa: true,
      mantissa: round ? 0 : 3,
    })
}

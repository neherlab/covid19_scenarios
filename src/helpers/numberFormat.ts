import { numbro } from '../i18n/i18n'

export function numberFormatter(humanize: boolean, round: boolean) {
  return (value: number) =>
    numbro(value).format({
      thousandSeparated: true,
      average: humanize,
      trimMantissa: true,
      mantissa: round ? 0 : 2,
    })
}

export function percentageFormatter(value: number, mantissa = 2) {
  return numbro(value).format({
    output: 'percent',
    trimMantissa: true,
    mantissa,
  })
}

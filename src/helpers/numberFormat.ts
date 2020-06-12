import { numbro } from '../i18n/i18n'

export interface NumberFormatter {
  shouldFormatNumbers?: boolean
  round?: boolean
}

export function getNumberFormatter({ shouldFormatNumbers = true, round = false }: NumberFormatter) {
  return (value: number) =>
    numbro(value).format({
      thousandSeparated: true,
      average: shouldFormatNumbers,
      trimMantissa: true,
      mantissa: round ? 0 : 2,
    })
}

export function getNumberFormatters({ shouldFormatNumbers = true }: NumberFormatter) {
  const formatNumber = getNumberFormatter({ shouldFormatNumbers, round: false })
  const formatNumberRounded = getNumberFormatter({ shouldFormatNumbers, round: true })
  return { formatNumber, formatNumberRounded }
}

export function numberFormatter(language: string | undefined, humanize: boolean, round: boolean) {
  return new Intl.NumberFormat(language, {
    ...(humanize ? { notation: 'compact', compactDisplay: 'short' } : {}),
    ...(round ? { maximumFractionDigits: 0 } : {}),
  }).format
}

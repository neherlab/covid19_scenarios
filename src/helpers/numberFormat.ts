export function numberFormatter(language: string | undefined, compact: boolean, round: boolean) {
  return new Intl.NumberFormat(language, {
    ...(compact ? { notation: 'compact', compactDisplay: 'short', maximumFractionDigits: 2 } : {}),
    ...(round ? { maximumFractionDigits: 0 } : {}),
  }).format
}

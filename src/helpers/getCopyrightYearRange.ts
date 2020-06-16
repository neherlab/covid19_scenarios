import { COPYRIGHT_YEAR_START } from 'src/constants'

export function getCopyrightYearRange() {
  const currentYear = new Date().getFullYear()

  if (COPYRIGHT_YEAR_START < currentYear) {
    return `${COPYRIGHT_YEAR_START}-${currentYear}`
  }

  return COPYRIGHT_YEAR_START.toString()
}

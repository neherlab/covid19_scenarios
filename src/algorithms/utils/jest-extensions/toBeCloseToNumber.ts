import { absUlpDiff } from './comparators'

export default function toBeCloseToNumber(got: number, want: number) {
  const diff = absUlpDiff(want, got)
  const maxUlp = 4n
  const pass = diff <= maxUlp

  if (pass) {
    return {
      message: () => `received (${got}) and expected (${want}) differ by ${diff} ULP`,
      pass: true,
    }
  }
  return {
    message: () => `received (${got}) and expected (${want}) differ by ${diff} ULP`,
    pass: false,
  }
}

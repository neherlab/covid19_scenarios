import { MutableRefObject } from 'react'
import { Coordinate } from 'recharts'

const SINGLE_COLUMN_THRESHOLD = 992
const IS_GREATER_THRESHOLD = SINGLE_COLUMN_THRESHOLD > window.innerWidth

export const calculatePosition = (height: number): Coordinate =>
  ({
    x: IS_GREATER_THRESHOLD ? 0 : null,
    y: IS_GREATER_THRESHOLD ? height - 20 : null,
  } as Coordinate)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function scrollToRef(ref: MutableRefObject<any>) {
  if (IS_GREATER_THRESHOLD) {
    ref.current.scrollIntoView({
      behavior: 'smooth',
    })
  }
}

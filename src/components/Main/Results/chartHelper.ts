import { MutableRefObject } from 'react'

import { Coordinate } from 'recharts'

const singleColumnThreshold = 992

export function calculatePosition(height: number): Coordinate | undefined {
  if (window.innerWidth < singleColumnThreshold) {
    return { x: 0, y: height - 20 }
  }
  return undefined
}

export function scrollToRef(ref: MutableRefObject<HTMLElement | null>) {
  if (window.innerWidth < singleColumnThreshold) {
    ref.current?.scrollIntoView({
      behavior: 'smooth',
    })
  }
}

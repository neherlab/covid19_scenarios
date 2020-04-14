import { MutableRefObject } from 'react'
import { Coordinate } from 'recharts'

const singleColumnThreshold = 992

export function calculatePosition(height: number) {
  const yPosition = window.innerWidth < singleColumnThreshold ? height - 20 : null
  const position = { y: yPosition } as Coordinate

  if (window.innerWidth < singleColumnThreshold) position.x = 0
  return position
}

export function scrollToRef(ref: MutableRefObject<HTMLElement | null>) {
  if (window.innerWidth < singleColumnThreshold) {
    ref.current?.scrollIntoView({
      behavior: 'smooth',
    })
  }
}

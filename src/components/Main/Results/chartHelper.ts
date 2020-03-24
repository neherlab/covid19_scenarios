import { MutableRefObject } from 'react'

const singleColumnThreshold = 992

export function calculateYPosition(height: number) {
  const yPosition = window.innerWidth < singleColumnThreshold ? height - 20 : 0
  return yPosition
}

export function scrollToRef(ref: MutableRefObject<any>) {
  if (window.innerWidth < singleColumnThreshold) {
    ref.current.scrollIntoView({
      behavior: 'smooth'
    })
  }
}
import { MutableRefObject } from 'react'

const singleColumnThreshold = 992

export function calculatePosition(height: number) {
  const yPosition = window.innerWidth < singleColumnThreshold ? height - 20 : null

  if (window.innerWidth < singleColumnThreshold) return { x: 0, y: yPosition }
  return { y: yPosition }
}

export function scrollToRef(ref: MutableRefObject<any>) {
  if (window.innerWidth < singleColumnThreshold) {
    ref.current.scrollIntoView({
      behavior: 'smooth',
    })
  }
}

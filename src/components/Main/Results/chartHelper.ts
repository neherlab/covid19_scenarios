import { MutableRefObject } from 'react'

const singleColumnThreshold = 992

<<<<<<< HEAD
export function calculatePosition(height: number) {
  const yPosition = window.innerWidth < singleColumnThreshold ? height - 20 : null

  if (window.innerWidth < singleColumnThreshold) return { x: 0, y: yPosition }
  else return { y: yPosition }
=======
export function calculateYPosition(height: number) {
  const yPosition = window.innerWidth < singleColumnThreshold ? height - 20 : 0
  return yPosition
>>>>>>> Improvement: Scroll to top of chart when clicking it on mobile.
}

export function scrollToRef(ref: MutableRefObject<any>) {
  if (window.innerWidth < singleColumnThreshold) {
    ref.current.scrollIntoView({
      behavior: 'smooth'
    })
  }
}
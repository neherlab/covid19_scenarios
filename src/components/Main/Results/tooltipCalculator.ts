export function calculateYPosition(width: number, height: number) {
  const yPosition = width < 800 ? height - (height * 0.15) : 0
  return yPosition
}
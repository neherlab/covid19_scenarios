export function calculateYPosition(height: number) {
  const yPosition = window.innerWidth < 992 ? height - 20 : 0
  return yPosition
}

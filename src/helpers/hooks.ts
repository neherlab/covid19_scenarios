import { useEffect, useRef, MutableRefObject } from 'react'

/** @see {@tutorial https://stackoverflow.com/questions/53446020/how-to-compare-oldvalues-and-newvalues-on-react-hooks-useeffect} */
export const usePrevious = <T>(value: T) => {
  const ref = useRef<T>()
  useEffect(() => {
    ref.current = value
  })
  return ref.current
}

export const useScrollIntoView = <T extends HTMLElement = any>(trigger: any) => {
  const refOfElementToScrollIntoView = useRef<T>(null)

  /**
   * when the trigger transitions from "off" to "on" (e.g. the data was initialized)
   * scroll the designated element (refOfElementToScrollIntoView) into view
   */
  const previousTrigger = usePrevious(trigger)

  useEffect(() => {
    trigger &&
      !previousTrigger &&
      setTimeout(() => {
        /**
         * scroll the viewport down to the point where the top of this element is at the top of the viewport
         * @see {@tutorial https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView}
         */
        refOfElementToScrollIntoView.current?.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' })
      })
  }, [trigger])

  return refOfElementToScrollIntoView
}

type ClickEvent = GlobalEventHandlers['onclick']

/**
 * @see {@tutorial https://stackoverflow.com/a/54292872/3942699}
 * Custom outside click Hook
 */
export const useOuterClickNotifier = <T extends HTMLElement | undefined | null>(
  onOuterClick: (e: ClickEvent) => any,
  innerRef: MutableRefObject<T>,
) => {
  useEffect(
    () => {
      if (innerRef.current) {
        // add listener only, if element exists
        const handleClick: ClickEvent = (e) =>
          innerRef.current && !innerRef.current?.contains?.(e.target as HTMLElement) && onOuterClick(e)

        document.addEventListener('click', handleClick)
        // unmount previous listener first
        return () => document.removeEventListener('click', handleClick)
      }
    },
    [onOuterClick, innerRef], // invoke again, if deps have changed
  )
}

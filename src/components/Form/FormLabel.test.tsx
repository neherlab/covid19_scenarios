import React from 'react'
import { render } from '@testing-library/react'
import FormLabel from './FormLabel'

const findLabelInTree = (el: HTMLElement | null): HTMLElement | null => {
  if (!el) {
    return null
  }
  if ('htmlFor' in el) {
    return el
  }
  return findLabelInTree(el.parentElement)
}

describe('FormLabel', () => {
  it('creates a label for an identified form field', () => {
    // A somewhat hacky test - there should be a <label> somewhere in the
    // element tree that shows the label text. And that <label> should be for
    // the identifier.

    const { getByText } = render(<FormLabel identifier="abc" label="def" />)

    const labelElement = findLabelInTree(getByText('def')) as HTMLLabelElement

    expect(labelElement).not.toBeNull()
    if (labelElement) {
      expect(labelElement.htmlFor).toBe('abc')
    }
  })
})

import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import FormHelpButton from './FormHelpButton'

// mock popper.js (reactstrap dependency via react-popper)
// see: https://github.com/popperjs/popper-core/issues/478#issuecomment-341494703

jest.mock('popper.js', () => {
  const PopperJS = jest.requireActual('popper.js')

  return class {
    static placements = PopperJS.placements

    constructor() {
      return {
        destroy: () => null,
        scheduleUpdate: () => null,
      }
    }
  }
})

describe('FormHelpButton', () => {
  it('renders', () => {
    const { getByLabelText } = render(<FormHelpButton identifier="abc" label="def" />)

    expect(getByLabelText('help')).not.toBeNull()
  })

  it('initially hides help', () => {
    const { queryByText } = render(<FormHelpButton identifier="abc" label="def" />)

    expect(queryByText('def')).toBeNull()
  })

  it('opens', () => {
    const { getByLabelText, queryByText } = render(<FormHelpButton identifier="abc" label="def" />)

    fireEvent.focus(getByLabelText('help'))

    expect(queryByText('def')).not.toBeNull()
  })

  it('displays help', () => {
    const { getByLabelText, getByText } = render(<FormHelpButton identifier="abc" label="def" help="some help" />)

    fireEvent.focus(getByLabelText('help'))

    expect(getByText('some help')).toBeTruthy()
  })

  it('closes', () => {
    const { getByLabelText, queryByText } = render(<FormHelpButton identifier="abc" label="def" />)

    fireEvent.focus(getByLabelText('help'))
    fireEvent.blur(getByLabelText('help'))

    expect(queryByText('def')).toBeNull()
  })
})

import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import FormHelpButton from './FormHelpButton'

describe('FormHelpButton', () => {
  it('renders', () => {
    const { getByLabelText } = render(<FormHelpButton help="this is help" />)
    expect(getByLabelText('help')).not.toBeNull()
  })

  it('initially hides help', () => {
    const { queryByText } = render(<FormHelpButton help="this is help" />)
    expect(queryByText('def')).toBeNull()
  })

  it('displays help on click', async () => {
    const { getByLabelText, findByText, queryByText } = render(<FormHelpButton help="this is help" />)
    fireEvent.click(getByLabelText('help'))
    await findByText('this is help')
    expect(queryByText('this is help')).not.toBeNull()
  })

  it('dissmisses help on second click', async () => {
    const { getByLabelText, queryByText } = render(
      <>
        <div>
          <span aria-label="outside" />
        </div>
        <div>
          <FormHelpButton help="this is help" />
        </div>
      </>,
    )

    fireEvent.click(getByLabelText('help'))
    expect(queryByText('this is help')).not.toBeNull()

    fireEvent.click(getByLabelText('help'))
    expect(queryByText('this is help')).toBeNull()
  })
})

import React from 'react'
import { render, fireEvent, waitForElementToBeRemoved } from '@testing-library/react'
import FormHelpButton from './FormHelpButton'

describe('FormHelpButton', () => {
  it('renders', () => {
    const { getByLabelText } = render(<FormHelpButton label="def" />)

    expect(getByLabelText('help')).not.toBeNull()
  })

  it('initially hides help', () => {
    const { queryByText } = render(<FormHelpButton label="def" />)

    expect(queryByText('def')).toBeNull()
  })

  it('opens', async () => {
    const { getByLabelText, findByText, queryByText } = render(<FormHelpButton label="def" />)

    fireEvent.click(getByLabelText('help'))

    await findByText('def')
    expect(queryByText('def')).not.toBeNull()
  })

  it('displays help', async () => {
    const { getByLabelText, findByText, queryByText } = render(<FormHelpButton label="def" help="some help" />)

    fireEvent.click(getByLabelText('help'))

    await findByText('some help')
    expect(queryByText('some help')).toBeTruthy()
  })

  it('closes inside', async () => {
    const { getByLabelText, findByText, queryByText } = render(<FormHelpButton label="def" />)
    fireEvent.click(getByLabelText('help'))
    await findByText('def')
    expect(queryByText('def')).not.toBeNull()

    fireEvent.click(getByLabelText('help'))

    expect(queryByText('def')).toBeNull()
  })

  // eslint-disable-next-line jest/no-disabled-tests
  it.skip('closes outside', async () => {
    const { getByLabelText, findByText, getByText, queryByText } = render(
      <div>
        <span>click outside</span>
        <FormHelpButton label="def" />
      </div>,
    )
    fireEvent.click(getByLabelText('help'))
    await findByText('def')
    expect(queryByText('def')).not.toBeNull()

    fireEvent.click(getByText('click outside'))

    await waitForElementToBeRemoved(() => queryByText('def'))
    expect(queryByText('def')).toBeNull()
  })
})

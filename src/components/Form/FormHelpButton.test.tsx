import React from 'react'
import { render, fireEvent, waitForElementToBeRemoved } from '@testing-library/react'
import FormHelpButton, { help } from './FormHelpButton'

describe('FormHelpButton', () => {
  it('renders', () => {
    const { getByLabelText } = render(<FormHelpButton identifier="abc" help={help('def')} />)

    expect(getByLabelText('help')).not.toBeNull()
  })

  it('initially hides help', () => {
    const { queryByText } = render(<FormHelpButton identifier="abc" help={help('def')} />)

    expect(queryByText('def')).toBeNull()
  })

  it('opens', async () => {
    const { getByLabelText, findByText, queryByText } = render(<FormHelpButton identifier="abc" help={help('def')} />)

    fireEvent.click(getByLabelText('help'))

    await findByText('def')
    expect(queryByText('def')).not.toBeNull()
  })

  it('displays help', async () => {
    const { getByLabelText, findByText, queryByText } = render(
      <FormHelpButton identifier="abc" help={help('def', 'some help')} />,
    )

    fireEvent.click(getByLabelText('help'))

    await findByText('some help')
    expect(queryByText('some help')).toBeTruthy()
  })

  it('closes inside', async () => {
    const { getByLabelText, findByText, queryByText } = render(<FormHelpButton identifier="abc" help={help('def')} />)
    fireEvent.click(getByLabelText('help'))
    await findByText('def')
    expect(queryByText('def')).not.toBeNull()

    fireEvent.click(getByLabelText('help'))

    await waitForElementToBeRemoved(() => queryByText('def'))
    expect(queryByText('def')).toBeNull()
  })

  it('closes outside', async () => {
    const { getByLabelText, findByText, getByText, queryByText } = render(
      <div>
        <FormHelpButton identifier="abc" help={help('def')} />
        <span>click outside</span>
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

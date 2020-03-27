import React from 'react'
import { render, fireEvent, waitForElementToBeRemoved } from '@testing-library/react'
import FormHelpButton from './FormHelpButton'

describe('FormHelpButton', () => {
  beforeAll(() => {
    (global as any).MutationObserver = class {
      constructor(callback: Function) {}
      disconnect() {}
      observe(element: HTMLElement, initObject: {}) {}
    };

    (global as any).document.createRange = () => ({
      setStart: () => {},
      setEnd: () => {},
      commonAncestorContainer: {
        nodeName: 'BODY',
        ownerDocument: document,
      },
    })
  })

  it('renders', () => {
    const { getByLabelText } = render(<FormHelpButton identifier="abc" label="def" />)

    expect(getByLabelText('help')).not.toBeNull()
  })

  it('initially hides help', () => {
    const { queryByText } = render(<FormHelpButton identifier="abc" label="def" />)

    expect(queryByText('def')).toBeNull()
  })

  it('opens', async () => {
    const { getByLabelText, findByText, queryByText } = render(<FormHelpButton identifier="abc" label="def" />)

    fireEvent.click(getByLabelText('help'))

    await findByText('def')
    expect(queryByText('def')).not.toBeNull()
  })

  it('displays help', async () => {
    const { getByLabelText, findByText, queryByText } = render(
      <FormHelpButton identifier="abc" label="def" help="some help" />,
    )

    fireEvent.click(getByLabelText('help'))

    await findByText('some help')
    expect(queryByText('some help')).toBeTruthy()
  })

  it('closes inside', async () => {
    const { getByLabelText, findByText, queryByText } = render(<FormHelpButton identifier="abc" label="def" />)
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
        <FormHelpButton identifier="abc" label="def" />
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

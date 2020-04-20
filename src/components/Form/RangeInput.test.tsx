/* eslint-disable jest/expect-expect */
import React from 'react'
import { render, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import RangeInput, { RangeInputValue } from './RangeInput'

describe('RangeInput', () => {
  it('renders a placeholder', () => {
    const { getByPlaceholderText } = render(<RangeInput />)

    expect(getByPlaceholderText('Enter a number or range of numbers...')).not.toBeNull()
  })

  it('can override placeholder', () => {
    const { getByPlaceholderText } = render(<RangeInput placeholder="Test" />)

    expect(getByPlaceholderText('Test')).not.toBeNull()
  })

  it('renders a title', () => {
    const { getByTitle } = render(<RangeInput />)

    expect(getByTitle('Enter a number or range of numbers. e.g. 29 or 29-31')).not.toBeNull()
  })

  it('can override title', () => {
    const { getByTitle } = render(<RangeInput title="Test" />)

    expect(getByTitle('Test')).not.toBeNull()
  })

  const displayTest = (value: RangeInputValue, display: string) => {
    const { getByDisplayValue } = render(<RangeInput value={value} />)

    expect(getByDisplayValue(display)).not.toBeNull()
  }

  it('displays [a, b] as "a to b"', () => {
    displayTest([1, 2], '1 to 2')
  })

  it('displays [a, a] as "a"', () => {
    displayTest([1, 1], '1')
  })

  it('displays ["garbage", undefined] as "garbage"', () => {
    displayTest(['garbage', undefined], 'garbage')
  })

  const interactTest = async (toType: string, expectedValue: RangeInputValue) => {
    const onChange = jest.fn()
    const { getByPlaceholderText } = render(<RangeInput placeholder="Test" onChange={onChange} />)

    await userEvent.type(getByPlaceholderText('Test'), toType)

    expect(onChange).toHaveBeenCalledWith(expectedValue)
  }

  const positiveTests: [string, RangeInputValue][] = [
    ['1', [1, 1]],
    ['1.2', [1.2, 1.2]],
    ['1.2 ', [1.2, 1.2]],
    [' 1.2', [1.2, 1.2]],
    ['1 2', [1, 2]],
    ['1.1 2.2', [1.1, 2.2]],
    ['1.1 - 2.2', [1.1, 2.2]],
    ['1.1 to 2.2', [1.1, 2.2]],
  ]

  positiveTests.forEach(([toType, expectedValue]) => {
    it(`typed values propagate - ${toType} - ${expectedValue}`, async () => {
      interactTest(toType, expectedValue)
    })
  })

  const negativeTests: [string, RangeInputValue][] = [
    ['garbage', ['garbage', undefined]],
    ['more garbage', ['more garbage', undefined]],
  ]

  // eslint-disable-next-line @typescript-eslint/tslint/config
  negativeTests.forEach(([toType, expectedValue]) => {
    it(`typed values propagate - ${toType} - ${expectedValue}`, async () => {
      interactTest(toType, expectedValue)
    })
  })

  it('hints at ranginess after typing', async () => {
    const { getByPlaceholderText, getByDisplayValue } = render(<RangeInput placeholder="Test" />)

    await userEvent.type(getByPlaceholderText('Test'), '1')

    expect(getByDisplayValue('1 to ...')).not.toBeNull()
  })

  it('hints with focus', () => {
    const { getByPlaceholderText, getByDisplayValue } = render(<RangeInput placeholder="Test" value={[1, 1]} />)

    userEvent.click(getByPlaceholderText('Test'))

    expect(getByDisplayValue('1 to ...')).not.toBeNull()
  })

  it('does not hint without focus', () => {
    const { queryByDisplayValue } = render(<RangeInput value={[1, 1]} />)

    expect(queryByDisplayValue('1 to ...')).toBeNull()
  })

  it('stops hinting with focus lost', () => {
    const { getByPlaceholderText, getByText, queryByDisplayValue } = render(
      <div>
        <span>OUTSIDE</span>
        <RangeInput placeholder="Test" value={[1, 1]} />
      </div>,
    )

    userEvent.click(getByPlaceholderText('Test'))
    userEvent.click(getByText('OUTSIDE'))

    expect(queryByDisplayValue('1 to ...')).toBeNull()
  })

  it('right arrow takes the hint', async () => {
    const { getByPlaceholderText, getByDisplayValue, queryByDisplayValue } = render(<RangeInput placeholder="Test" />)

    const input = getByPlaceholderText('Test')
    await userEvent.type(input, '1')
    fireEvent.keyDown(input, { key: 'ArrowRight', code: 'ArrowRight' })

    waitFor(() => expect(getByDisplayValue('1 to ')).not.toBeNull())
    expect(queryByDisplayValue('1 to ...')).toBeNull()
  })

  it('outside control does not happen when focused', () => {
    const { rerender, getByPlaceholderText, queryByDisplayValue } = render(
      <RangeInput placeholder="Test" value={[1, 1]} />,
    )

    userEvent.click(getByPlaceholderText('Test'))

    rerender(<RangeInput value={[11, 11]} />)

    expect(queryByDisplayValue('11')).toBeNull()
  })

  it('outside control happens when unfocused', () => {
    const { rerender, getByDisplayValue } = render(<RangeInput placeholder="Test" value={[1, 1]} />)

    rerender(<RangeInput value={[11, 11]} />)

    waitFor(() => expect(getByDisplayValue('11')).not.toBeNull())
  })
})

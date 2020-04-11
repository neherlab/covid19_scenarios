import React from 'react'
import { cleanup, fireEvent, render, RenderResult } from '@testing-library/react'
import PresetLoader from './PresetLoader'

const DATA = [
  {
    label: 'First row',
    value: '1',
  },
  {
    label: 'Second row',
    value: '2',
  },
  {
    label: 'Third row',
    value: '3',
  },
]

describe('PresetLoader', () => {
  let onSelect: (id: string) => void
  let wrapper: RenderResult

  beforeEach(() => {
    onSelect = jest.fn()
    wrapper = render(<PresetLoader data={DATA} onSelect={onSelect} />)
  })

  afterEach(cleanup)

  it('matches snapshot', () => {
    expect(wrapper.asFragment()).toMatchSnapshot()
  })

  it('renders button', () => {
    expect(wrapper.getByTestId('PresetLoaderButton')).not.toBeNull()
    expect(wrapper.getByText('Change scenario')).not.toBeNull()
  })

  it('does not render dialog initially', () => {
    expect(wrapper.queryByTestId('PresetLoaderDialog')).toBeNull()
  })

  it('renders dialog on button click', () => {
    const button = wrapper.getByTestId('PresetLoaderButton')
    fireEvent.click(button)

    expect(wrapper.getByTestId('PresetLoaderDialog')).not.toBeNull()
  })

  it('triggers onSelect on row button click', () => {
    const button = wrapper.getByTestId('PresetLoaderButton')
    fireEvent.click(button)

    const loadButtons = wrapper.getAllByTestId('PresetLoaderDialogRowButton')

    expect(loadButtons).toHaveLength(3)

    fireEvent.click(loadButtons[0]) // click the 1st Load button

    expect(onSelect).toHaveBeenCalledWith('1')
  })
})

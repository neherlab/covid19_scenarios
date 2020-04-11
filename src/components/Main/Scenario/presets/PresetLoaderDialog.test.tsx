import React from 'react'
import { cleanup, fireEvent, render, RenderResult, wait } from '@testing-library/react'
import { noop } from 'lodash'
import PresetLoaderDialog from './PresetLoaderDialog'

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
  {
    label: 'ABC',
    value: '4',
  },
]

describe('PresetLoaderDialog', () => {
  let onLoadButtonClick: (id: string) => void
  let onClose: () => void
  let wrapper: RenderResult

  beforeEach(() => {
    console.warn = noop
    console.error = noop

    onLoadButtonClick = jest.fn()
    onClose = jest.fn()
    wrapper = render(<PresetLoaderDialog data={DATA} onLoadButtonClick={onLoadButtonClick} onClose={onClose} visible />)
  })

  afterEach(cleanup)

  it('matches snapshot', () => {
    expect(wrapper.asFragment()).toMatchSnapshot()
  })

  it('renders title', () => {
    expect(wrapper.getByText('Change scenario')).not.toBeNull()
  })

  it('displays scenarios', () => {
    const loadButtons = wrapper.getAllByTestId('PresetLoaderDialogRowButton')

    expect(wrapper.getByText('Showing 4 of 4 entries')).not.toBeNull()
    expect(loadButtons).toHaveLength(4)
  })

  it('filters scenarios', async () => {
    const input = wrapper.getByTestId('PresetLoaderDialogInput')
    let loadButtons

    fireEvent.change(input, { target: { value: 'ABC' } })
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' })

    await wait(() => wrapper.getByText('Showing 1 of 4 entries'))

    loadButtons = wrapper.getAllByTestId('PresetLoaderDialogRowButton')
    expect(loadButtons).toHaveLength(1)

    const clearButton = wrapper.getByTestId('PresetLoaderDialogClearButton')
    fireEvent.click(clearButton)

    await wait(() => wrapper.getByText('Showing 4 of 4 entries'))

    loadButtons = wrapper.getAllByTestId('PresetLoaderDialogRowButton')

    expect(loadButtons).toHaveLength(4)
  })

  describe('row button click triggers onLoadButtonClick handler', () => {
    it('when results not filtered', () => {
      const loadButton = wrapper.getAllByTestId('PresetLoaderDialogRowButton')

      fireEvent.click(loadButton[0])

      expect(onLoadButtonClick).toHaveBeenCalledWith('1')

      fireEvent.click(loadButton[1])

      expect(onLoadButtonClick).toHaveBeenCalledWith('2')
    })

    it('when results filtered', async () => {
      const input = wrapper.getByTestId('PresetLoaderDialogInput')

      fireEvent.change(input, { target: { value: 'ABC' } })
      fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' })

      await wait(() => wrapper.getByText('Showing 1 of 4 entries'))

      const loadButtons = wrapper.getAllByTestId('PresetLoaderDialogRowButton')
      fireEvent.click(loadButtons[0])

      expect(onLoadButtonClick).toHaveBeenCalledWith('4')
    })
  })

  describe('row link click triggers onLoadButtonClick handler', () => {
    it('when results not filtered', () => {
      const loadButton = wrapper.getAllByTestId('PresetLoaderDialogRowLink')

      fireEvent.click(loadButton[0])

      expect(onLoadButtonClick).toHaveBeenCalledWith('1')

      fireEvent.click(loadButton[1])

      expect(onLoadButtonClick).toHaveBeenCalledWith('2')
    })

    it('when results filtered', async () => {
      const input = wrapper.getByTestId('PresetLoaderDialogInput')

      fireEvent.change(input, { target: { value: 'ABC' } })
      fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' })

      await wait(() => wrapper.getByText('Showing 1 of 4 entries'))

      const loadButtons = wrapper.getAllByTestId('PresetLoaderDialogRowLink')
      fireEvent.click(loadButtons[0])

      expect(onLoadButtonClick).toHaveBeenCalledWith('4')
    })
  })

  it('close button triggers the onClose handler', () => {
    const closeButton = wrapper.getByTestId('PresetLoaderDialogCloseButton')
    fireEvent.click(closeButton)

    expect(onClose).toHaveBeenCalled()
  })
})

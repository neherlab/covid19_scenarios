import React from 'react'
import { noop } from 'lodash'
import { cleanup, fireEvent, render, RenderResult } from '@testing-library/react'
import PresetLoaderDialogRow from './PresetLoaderDialogRow'

const DATA = {
  label: 'Some label',
  value: '123',
}

describe('PresetLoaderDialogRow', () => {
  let onLoadButtonClick: (id: string) => void
  let wrapper: RenderResult

  beforeEach(() => {
    console.warn = noop
    console.error = noop

    onLoadButtonClick = jest.fn()
    wrapper = render(<PresetLoaderDialogRow data={DATA} onLoadButtonClick={onLoadButtonClick} />)
  })

  afterEach(cleanup)

  it('matches snapshot', () => {
    expect(wrapper.asFragment()).toMatchSnapshot()
  })

  it('renders label and button', () => {
    expect(wrapper.getByText('Some label')).not.toBeNull()
    expect(wrapper.getByTestId('PresetLoaderDialogRowLink')).not.toBeNull()
    expect(wrapper.getByTestId('PresetLoaderDialogRowButton')).not.toBeNull()
  })

  it('link click triggers onLoadButtonClick handler', () => {
    const loadButton = wrapper.getByTestId('PresetLoaderDialogRowLink')
    fireEvent.click(loadButton)

    expect(onLoadButtonClick).toHaveBeenCalledWith('123')
  })

  it('button click triggers onLoadButtonClick handler', () => {
    const loadButton = wrapper.getByTestId('PresetLoaderDialogRowButton')
    fireEvent.click(loadButton)

    expect(onLoadButtonClick).toHaveBeenCalledWith('123')
  })
})

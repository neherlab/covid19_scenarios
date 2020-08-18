import React from 'react'

import { cleanup, fireEvent, RenderResult } from '@testing-library/react'

import { render } from 'src/helpers/testReactRedux'

import { ScenarioLoader } from '../ScenarioLoader'

describe('ScenarioLoader', () => {
  let scenarioLoader: RenderResult
  let onClose: () => void

  let useDebounceMock: typeof jest

  beforeAll(() => {
    useDebounceMock = jest.mock('use-debounce', () => ({
      useDebouncedCallback: (f: () => unknown) => f,
    }))
  })

  afterAll(async () => {
    useDebounceMock.clearAllMocks()
    await cleanup()
  })

  beforeEach(() => {
    onClose = jest.fn()
    scenarioLoader = render(<ScenarioLoader />)
  })

  it('renders a header', () => {
    expect(scenarioLoader.getByText('Change scenario')).not.toBeNull()
  })

  it('closes', () => {
    const closeButton = scenarioLoader.getByLabelText('Close')
    fireEvent.click(closeButton)
    expect(onClose).toHaveBeenCalled()
  })
})

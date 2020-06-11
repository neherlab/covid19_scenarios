import React from 'react'

import { cleanup, fireEvent, render, RenderResult } from '@testing-library/react'

import { AnyAction } from 'typescript-fsa'

import type { SeverityDistributionDatum } from '../../../../algorithms/types/Param.types'

import { ScenarioLoader } from '../ScenarioLoader'

describe('ScenarioLoader', () => {
  let onScenarioSelect: (id: string) => void
  let onClose: () => void
  let scenarioLoader: RenderResult

  let setSeverity: (severity: SeverityDistributionDatum[]) => void
  let scenarioDispatch: (action: AnyAction) => void

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
    onScenarioSelect = jest.fn()
    onClose = jest.fn()
    setSeverity = jest.fn()
    scenarioDispatch = jest.fn()

    scenarioLoader = render(
      <ScenarioLoader
        scenarioOptions={[]}
        onScenarioSelect={onScenarioSelect}
        close={onClose}
        visible
        setSeverity={setSeverity}
        scenarioDispatch={scenarioDispatch}
      />,
    )
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

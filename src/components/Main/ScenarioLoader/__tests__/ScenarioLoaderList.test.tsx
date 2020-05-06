import React from 'react'

import { noop } from 'lodash'
import { cleanup, fireEvent, render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { Optional } from 'utility-types'

import type { ScenarioOption } from '../ScenarioOption'

import { ScenarioLoaderList, ScenarioLoaderListProps } from '../ScenarioLoaderList'

const scenarioOptions: ScenarioOption[] = [
  {
    label: 'United States of America',
    value: '0',
  },
  {
    label: 'Italy',
    value: '1',
  },
  {
    label: 'ITA-Lombardia',
    value: '2',
  },
  {
    label: 'Germany',
    value: '3',
  },
]

function renderScenarioList({
  items = scenarioOptions,
  onScenarioSelect = noop,
}: Optional<ScenarioLoaderListProps> = {}) {
  return render(<ScenarioLoaderList items={items} onScenarioSelect={onScenarioSelect} />)
}

describe('ScenarioLoaderList', () => {
  afterAll(cleanup)

  it('displays search query', async () => {
    const { getByPlaceholderText } = renderScenarioList()
    const input = getByPlaceholderText('Search')
    await userEvent.type(input, 'foo')
    expect(input).toHaveAttribute('value', 'foo')
  })

  it('filters scenarios', async () => {
    const { getByRole, queryByText } = renderScenarioList()
    const input = getByRole('textbox')
    await userEvent.type(input, 'ita')
    expect(queryByText(scenarioOptions[0].label)).not.toBeInTheDocument()
    expect(queryByText(scenarioOptions[3].label)).not.toBeInTheDocument()
  })

  describe('selects clicked scenario', () => {
    it('when list is not filtered', () => {
      const onScenarioSelect = jest.fn<void, [string]>()
      const { getByText } = renderScenarioList({ onScenarioSelect })
      fireEvent.click(getByText(scenarioOptions[2].label))
      expect(onScenarioSelect).toHaveBeenCalledWith('2')
    })

    it('when list is filtered', async () => {
      const onScenarioSelect = jest.fn<void, [string]>()
      const { getByPlaceholderText, getByText } = renderScenarioList({ onScenarioSelect })
      const input = getByPlaceholderText('Search')
      await userEvent.type(input, 'ita')
      fireEvent.click(getByText('Italy'))
      expect(onScenarioSelect).toHaveBeenCalledWith('1')
    })
  })
})

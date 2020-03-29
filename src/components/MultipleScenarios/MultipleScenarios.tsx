import React, { useState } from 'react'
import createPersistedState from 'use-persisted-state'
import { v4 as uuidv4 } from 'uuid'
import { Nav, NavItem, NavLink } from 'reactstrap'
import classnames from 'classnames'

import Main from '../Main/Main'
import { DEFAULT_SCENARIO_ID } from '../Main/state/state'

import './MultipleScenarios.scss'

const useSavedScenariosState = createPersistedState('savedScenarios')
const useUserState = createPersistedState('user')

export default function MultipleScenarios() {
  const [user] = useUserState({ version: 1, id: uuidv4() })
  const [savedScenarios, setSavedScenarios] = useSavedScenariosState({ version: 1, scenarios: [] })
  const [activeTab, setActiveTab] = useState(DEFAULT_SCENARIO_ID)

  function onScenarioSave(name: string, serializedScenario: string) {
    setSavedScenarios({
      version: 1,
      scenarios: [...savedScenarios.scenarios, { id: uuidv4(), userid: user.id, name, serializedScenario } as never],
    })
  }

  const toggleTab = (tab: string) => {
    if (activeTab !== tab) setActiveTab(tab)
  }

  const allScenarios = [
    { id: DEFAULT_SCENARIO_ID, userid: user.id, name: 'Customize', serializedScenario: null },
    ...savedScenarios.scenarios,
  ]

  const activeScenario =
    activeTab === DEFAULT_SCENARIO_ID
      ? allScenarios[0]
      : allScenarios.find((saved) => activeTab === saved.id) || allScenarios[0]

  return (
    <div className="multiple-scenarios">
      {savedScenarios.scenarios.length > 0 && (
        <Nav tabs>
          {allScenarios.map((scenario) => (
            <NavItem key={scenario.id}>
              <NavLink
                className={classnames({ active: activeTab === scenario.id })}
                onClick={() => {
                  toggleTab(scenario.id)
                }}
              >
                <h5>{scenario.name}</h5>
              </NavLink>
            </NavItem>
          ))}
        </Nav>
      )}
      <Main activeScenario={activeScenario} onScenarioSave={onScenarioSave} />
    </div>
  )
}

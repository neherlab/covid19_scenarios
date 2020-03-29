import React, { useState } from 'react'
import createPersistedState from 'use-persisted-state'
import { v4 as uuidv4 } from 'uuid'
import { Nav, NavItem, NavLink } from 'reactstrap'
import classnames from 'classnames'

import Main from '../Main/Main'

const useSavedScenariosState = createPersistedState('savedScenarios')
const useUserState = createPersistedState('user')

export default function MultipleScenarios() {
  const [user] = useUserState({ version: 1, id: uuidv4() })
  const [savedScenarios, setSavedScenarios] = useSavedScenariosState({ version: 1, scenarios: [] })
  const [activeTab, setActiveTab] = useState('customize')

  function onScenarioSave(name: string, serializedScenario: string) {
    setSavedScenarios({
      version: 1,
      scenarios: [...savedScenarios.scenarios, { id: uuidv4(), userid: user.id, name, serializedScenario } as never],
    })
  }

  const toggleTab = (tab: string) => {
    if (activeTab !== tab) setActiveTab(tab)
  }

  if (savedScenarios.scenarios.length > 0) {
    const allScenarios = [
      { id: 'customize', userid: user.id, name: 'Customize', serializedScenario: null },
      ...savedScenarios.scenarios,
    ]
    return (
      <>
        <Nav tabs>
          {allScenarios.map((scenario) => (
            <NavItem key={scenario.id}>
              <NavLink
                className={classnames({ active: activeTab === scenario.id })}
                onClick={() => {
                  toggleTab(scenario.id)
                }}
              >
                {scenario.name}
              </NavLink>
            </NavItem>
          ))}
        </Nav>
        <Main onScenarioSave={onScenarioSave} />
      </>
    )
  }

  return <Main onScenarioSave={onScenarioSave} />
}

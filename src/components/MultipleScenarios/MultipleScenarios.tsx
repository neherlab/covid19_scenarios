import React from 'react'
import createPersistedState from 'use-persisted-state'
import { v4 as uuidv4 } from 'uuid'

import Main from '../Main/Main'

const useSavedScenariosState = createPersistedState('savedScenarios')
const useUserState = createPersistedState('user')

export default function MultipleScenarios() {
  const [user] = useUserState({ version: 1, id: uuidv4() })
  const [savedScenarios, setSavedScenarios] = useSavedScenariosState({ version: 1, scenarios: [] })

  function onScenarioSave(name: string, serializedScenario: string) {
    setSavedScenarios({
      version: 1,
      scenarios: [...savedScenarios.scenarios, { id: uuidv4(), userid: user.id, name, serializedScenario } as never],
    })
  }

  return <Main onScenarioSave={onScenarioSave} />
}

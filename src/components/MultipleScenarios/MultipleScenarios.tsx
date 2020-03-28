import React from 'react'

import Main from '../Main/Main'

function onScenarioSave(name: string, serializeScenario: string) {
  console.log(name, serializeScenario)
}

export default function MultipleScenarios() {
  return <Main onScenarioSave={onScenarioSave} />
}

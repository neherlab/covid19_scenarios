import React from 'react'

import { FormikErrors, FormikTouched } from 'formik'

import { Col, Row } from 'reactstrap'
import { AnyAction } from 'typescript-fsa'

import { CardWithDropdown } from '../../Form/CardWithDropdown'
import { stringsToOptions } from '../../Form/FormDropdownOption'

import { setOverallScenario } from '../state/actions'
import { State } from '../state/state'

import { ScenarioCardContainment } from './ScenarioCardContainment'
import { ScenarioCardEpidemiological } from './ScenarioCardEpidemiological'
import { ScenarioCardPopulation } from './ScenarioCardPopulation'
import { SeverityCard } from './SeverityCard'
import { SeverityTableRow } from './SeverityTable'

export interface ScenarioCardProps {
  severity: SeverityTableRow[]
  scenarioState: State
  errors?: FormikErrors<any>
  touched?: FormikTouched<any>
  setSeverity(severity: SeverityTableRow[]): void
  scenarioDispatch(action: AnyAction): void
}

function ScenarioCard({ severity, scenarioState, errors, touched, setSeverity, scenarioDispatch }: ScenarioCardProps) {
  const overallScenarioOptions = stringsToOptions(scenarioState.overall.scenarios)

  function handleChangeOverallScenario(newOverallScenario: string) {
    scenarioDispatch(setOverallScenario({ scenarioName: newOverallScenario }))
  }

  return (
    <CardWithDropdown
      identifier="overallScenario"
      label={<h3 className="p-0 m-0 d-inline text-truncate">Scenario</h3>}
      help="Combination of population, epidemiology, and mitigation scenarios"
      options={overallScenarioOptions}
      value={overallScenarioOptions.find(s => s.label === scenarioState.overall.current)}
      onValueChange={handleChangeOverallScenario}
    >
      <>
        <Row noGutters>
          <Col xl={6} className="py-1 px-1">
            <ScenarioCardPopulation
              scenarioState={scenarioState}
              errors={errors}
              touched={touched}
              scenarioDispatch={scenarioDispatch}
            />
          </Col>

          <Col xl={6} className="py-1 px-1">
            <ScenarioCardEpidemiological
              scenarioState={scenarioState}
              errors={errors}
              touched={touched}
              scenarioDispatch={scenarioDispatch}
            />
          </Col>
        </Row>

        <Row noGutters>
          <Col className="py-1 px-1">
            <ScenarioCardContainment
              scenarioState={scenarioState}
              errors={errors}
              touched={touched}
              scenarioDispatch={scenarioDispatch}
            />
          </Col>
        </Row>

        <Row noGutters>
          <Col className="py-1 px-1">
            <SeverityCard severity={severity} setSeverity={setSeverity} />
          </Col>
        </Row>
      </>
    </CardWithDropdown>
  )
}

export { ScenarioCard }

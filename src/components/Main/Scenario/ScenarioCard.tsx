import React from 'react'

import { FormikErrors, FormikTouched } from 'formik'

import { Col, Row } from 'reactstrap'
import { AnyAction } from 'typescript-fsa'

import { useTranslation } from 'react-i18next'

import { CardWithDropdown } from '../../Form/CardWithDropdown'
import { stringsToOptions } from '../../Form/FormDropdownOption'

import { setScenario } from '../state/actions'
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
  const { t } = useTranslation()
  const scenarioOptions = stringsToOptions(scenarioState.scenarios)

  function handleChangeScenario(newScenario: string) {
    scenarioDispatch(setScenario({ name: newScenario }))
  }

  return (
    <CardWithDropdown
      identifier="scenarioName"
      label={<h2 className="p-0 m-0 d-inline text-truncate">{t('Scenario')}</h2>}
      help={t('Combination of population, epidemiology, and mitigation scenarios')}
      options={scenarioOptions}
      value={scenarioOptions.find((s) => s.label === scenarioState.current)}
      onValueChange={handleChangeScenario}
      className="card--main"
    >
      <>
        <Row>
          <Col xl={6} className="my-2">
            <ScenarioCardPopulation
              scenarioState={scenarioState}
              errors={errors}
              touched={touched}
              scenarioDispatch={scenarioDispatch}
            />
          </Col>

          <Col xl={6} className="my-2">
            <ScenarioCardEpidemiological
              scenarioState={scenarioState}
              errors={errors}
              touched={touched}
              scenarioDispatch={scenarioDispatch}
            />
          </Col>
        </Row>

        <Row noGutters>
          <Col className="my-2">
            <ScenarioCardContainment
              scenarioState={scenarioState}
              errors={errors}
              touched={touched}
              scenarioDispatch={scenarioDispatch}
            />
          </Col>
        </Row>

        <Row noGutters>
          <Col className="my-2">
            <SeverityCard
              severity={severity}
              setSeverity={setSeverity}
              scenarioState={scenarioState}
              scenarioDispatch={scenarioDispatch}
            />
          </Col>
        </Row>
      </>
    </CardWithDropdown>
  )
}

export { ScenarioCard }

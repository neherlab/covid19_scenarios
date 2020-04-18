import React from 'react'

import { FormikErrors, FormikTouched, FormikValues } from 'formik'

import { Row, Col } from 'reactstrap'
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
import { AllParams, Severity } from '../../../algorithms/types/Param.types'
import { ColCustom } from '../../Layout/ColCustom'

export function getColumnSizes(areResultsMaximized: boolean) {
  if (areResultsMaximized) {
    return { colPopulation: { xxl: 6 }, colEpidemiological: { xxl: 6 } }
  }

  return { colPopulation: { xl: 6 }, colEpidemiological: { xl: 6 } }
}

export interface ScenarioCardProps {
  values: AllParams
  severity: Severity[]
  scenarioState: State
  errors?: FormikErrors<FormikValues>
  touched?: FormikTouched<FormikValues>
  setSeverity(severity: Severity[]): void
  scenarioDispatch(action: AnyAction): void
  areResultsMaximized: boolean
}

function ScenarioCard({
  values,
  severity,
  scenarioState,
  errors,
  touched,
  setSeverity,
  scenarioDispatch,
  areResultsMaximized,
}: ScenarioCardProps) {
  const { t } = useTranslation()
  const scenarioOptions = stringsToOptions(scenarioState.scenarios)
  const { colPopulation, colEpidemiological } = getColumnSizes(areResultsMaximized)

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
          <ColCustom {...colPopulation} className="my-2">
            <ScenarioCardPopulation errors={errors} touched={touched} />
          </ColCustom>

          <ColCustom {...colEpidemiological} className="my-2">
            <ScenarioCardEpidemiological errors={errors} touched={touched} />
          </ColCustom>
        </Row>

        <Row noGutters>
          <Col className="my-2">
            <ScenarioCardContainment values={values} errors={errors} touched={touched} />
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

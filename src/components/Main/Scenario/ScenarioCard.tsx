import React, { useMemo } from 'react'

import { FormikErrors, FormikTouched, FormikValues } from 'formik'

import { Col, Row } from 'reactstrap'
import { AnyAction } from 'typescript-fsa'

import { useTranslation } from 'react-i18next'

import { setScenario } from '../state/actions'
import { State } from '../state/state'

import { ScenarioCardContainment } from './ScenarioCardContainment'
import { ScenarioCardEpidemiological } from './ScenarioCardEpidemiological'
import { ScenarioCardPopulation } from './ScenarioCardPopulation'
import { SeverityCard } from './SeverityCard'
import { SeverityTableRow } from './ScenarioTypes'
import { AllParams } from '../../../algorithms/types/Param.types'
import { CardWithControls } from '../../Form/CardWithControls'
import PresetLoader from './presets/PresetLoader'

export interface ScenarioCardProps {
  values: AllParams
  severity: SeverityTableRow[]
  scenarioState: State
  errors?: FormikErrors<FormikValues>
  touched?: FormikTouched<FormikValues>
  setSeverity(severity: SeverityTableRow[]): void
  scenarioDispatch(action: AnyAction): void
}

function ScenarioCard({
  values,
  severity,
  scenarioState,
  errors,
  touched,
  setSeverity,
  scenarioDispatch,
}: ScenarioCardProps) {
  const { t } = useTranslation()
  const data = scenarioState.scenarios.map((item) => ({
    label: item,
    value: item,
  }))
  const title: string = scenarioState.current

  function handleChangeScenario(newScenario: string) {
    scenarioDispatch(setScenario({ name: newScenario }))
  }

  const presetLoader = useMemo(() => <PresetLoader data={data} onSelect={handleChangeScenario} />, [data])

  return (
    <CardWithControls
      identifier="scenarioName"
      label={<h2 className="p-0 m-0 d-inline text-truncate">{t('Scenario')}</h2>}
      help={t('Combination of population, epidemiology, and mitigation scenarios')}
      className="card--main"
      controls={presetLoader}
    >
      <>
        <Row>
          <Col xl={12} className="my-2">
            <h1>{title}</h1>
          </Col>
        </Row>
        <Row>
          <Col xl={6} className="my-2">
            <ScenarioCardPopulation errors={errors} touched={touched} />
          </Col>

          <Col xl={6} className="my-2">
            <ScenarioCardEpidemiological errors={errors} touched={touched} />
          </Col>
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
    </CardWithControls>
  )
}

export { ScenarioCard }

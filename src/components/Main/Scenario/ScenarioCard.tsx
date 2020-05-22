import React, { useMemo } from 'react'

import { FormikErrors, FormikTouched, FormikValues } from 'formik'
import { connect } from 'react-redux'

import { Row, Col } from 'reactstrap'
import { AnyAction } from 'typescript-fsa'

import { useTranslation } from 'react-i18next'
import { selectIsRunning } from '../../../state/algorithm/algorithm.selectors'

import { setScenario, renameCurrentScenario, SetScenarioParams } from '../../../state/scenario/scenario.actions'
import { State } from '../../../state/reducer'

import { CaseCountsDatum, ScenarioDatum, SeverityDistributionDatum } from '../../../algorithms/types/Param.types'
import {
  selectAgeDistributionData,
  selectScenarioData,
  selectScenarioNames,
  selectSeverityDistributionData,
  selectCurrentScenarioName,
} from '../../../state/scenario/scenario.selectors'
import {
  selectAreResultsMaximized,
  selectIsAutorunEnabled,
  selectIsLogScale,
  selectShouldFormatNumbers,
} from '../../../state/settings/settings.selectors'

import { ColCustom } from '../../Layout/ColCustom'
import { CardWithControls } from '../../Form/CardWithControls'
import { stringsToOptions } from '../../Form/FormDropdownOption'
import { Main } from '../Main'

import { ScenarioLoaderModalButton } from '../ScenarioLoader/ScenarioLoaderModalButton'

import { ScenarioCardContainment } from './ScenarioCardContainment'
import { ScenarioCardEpidemiological } from './ScenarioCardEpidemiological'
import { ScenarioCardPopulation } from './ScenarioCardPopulation'
import { SeverityCard } from './SeverityCard'
import { ScenarioTitle } from './ScenarioTitle'

import './ScenarioTitle.scss'

export function getColumnSizes(areResultsMaximized: boolean) {
  if (areResultsMaximized) {
    return { colPopulation: { xxl: 6 }, colEpidemiological: { xxl: 6 } }
  }

  return { colPopulation: { xl: 6 }, colEpidemiological: { xl: 6 } }
}

export interface ScenarioCardProps {
  scenarioNames: string[]
  currentScenarioName: string
  areResultsMaximized: boolean
  renameCurrentScenario(params: SetScenarioParams): void
  errors?: FormikErrors<FormikValues>
  touched?: FormikTouched<FormikValues>
}

function ScenarioCard({
  scenarioNames,
  currentScenarioName,
  renameCurrentScenario,
  areResultsMaximized,
  errors,
  touched,
}: ScenarioCardProps) {
  const { t } = useTranslation()
  const scenarioOptions = stringsToOptions(scenarioNames)
  const { colPopulation, colEpidemiological } = getColumnSizes(areResultsMaximized)

  function handleScenarioRename(newScenario: string) {
    renameCurrentScenario({ name: newScenario })
  }

  return (
    <CardWithControls
      identifier="scenarioName"
      className="card-scenario"
      labelComponent={<h2 className="p-0 m-0 text-truncate d-flex align-items-center">{t('Scenario')}</h2>}
      help={t(
        `This section allows to setup a scenario. A "scenario" is a set of parameters that describes a combination of population and epidemiological factors as well as a set of mitigation measures and severity assumptions to be used by the simulator.`,
      )}
      controlsComponent={<ScenarioLoaderModalButton />}
    >
      <>
        <Row noGutters className="row-scenario-title">
          <Col xl={12} className="col-scenario-title">
            <ScenarioTitle title={currentScenarioName} onRename={handleScenarioRename} />
          </Col>
        </Row>

        <Row noGutters className="row-scenario-population-epidemiological">
          <ColCustom {...colPopulation} className="col-scenario-population">
            <ScenarioCardPopulation errors={errors} touched={touched} setCaseCounts={setCaseCounts} />
          </ColCustom>

          <ColCustom {...colEpidemiological} className="col-scenario-epidemiological">
            <ScenarioCardEpidemiological errors={errors} touched={touched} />
          </ColCustom>
        </Row>

        <Row noGutters className="row-scenario-mitigation">
          <Col className="col-scenario-mitigation">
            <ScenarioCardContainment scenario={scenario} errors={errors} touched={touched} />
          </Col>
        </Row>

        <Row noGutters className="row-scenario-severity">
          <Col className="col-scenario-severity">
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

const mapStateToProps = (state: State) => ({
  scenarioNames: selectScenarioNames(state),
  currentScenarioName: selectCurrentScenarioName(state),
  scenarioData: selectScenarioData(state),
  ageDistributionData: selectAgeDistributionData(state),
  severityDistributionData: selectSeverityDistributionData(state),
  areResultsMaximized: selectAreResultsMaximized(state),
})

const mapDispatchToProps = {
  renameCurrentScenario,
}

const ScenarioCardConnected = connect(mapStateToProps, mapDispatchToProps)(ScenarioCard)

export { ScenarioCardConnected as ScenarioCard }

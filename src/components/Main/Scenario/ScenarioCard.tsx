import React, { useCallback } from 'react'

import { FormikErrors, FormikTouched, FormikValues } from 'formik'
import { connect } from 'react-redux'

import { Row, Col } from 'reactstrap'

import { useTranslation } from 'react-i18next'

import { renameCurrentScenario, SetScenarioParams } from '../../../state/scenario/scenario.actions'
import { State } from '../../../state/reducer'

import {
  selectAgeDistributionData,
  selectScenarioData,
  selectScenarioNames,
  selectSeverityDistributionData,
  selectCurrentScenarioName,
} from '../../../state/scenario/scenario.selectors'
import { selectAreResultsMaximized } from '../../../state/settings/settings.selectors'

import { ColCustom } from '../../Layout/ColCustom'
import { CardWithControls } from '../../Form/CardWithControls'

import { ScenarioLoader } from '../ScenarioLoader/ScenarioLoader'

import { ScenarioCardContainment } from './ScenarioCardContainment'
import { ScenarioCardEpidemiological } from './ScenarioCardEpidemiological'
import { ScenarioCardPopulation } from './ScenarioCardPopulation'
import { SeverityCard } from './SeverityCard'
import { ScenarioTitle } from './ScenarioTitle'

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

export function ScenarioCardDisconnected({
  currentScenarioName,
  renameCurrentScenario,
  areResultsMaximized,
  errors,
  touched,
}: ScenarioCardProps) {
  const { t } = useTranslation()

  const { colPopulation, colEpidemiological } = getColumnSizes(areResultsMaximized)

  // prettier-ignore
  const handleScenarioRename = useCallback(
    (newScenario: string) => renameCurrentScenario({ name: newScenario }),
    [renameCurrentScenario],
  )

  return (
    <CardWithControls
      identifier="scenarioName"
      className="card-scenario"
      labelComponent={<h2 className="p-0 m-0 text-truncate d-flex align-items-center">{t('Scenario')}</h2>}
      help={t(
        `This section allows to setup a scenario. A "scenario" is a set of parameters that describes a combination of population and epidemiological factors as well as a set of mitigation measures and severity assumptions to be used by the simulator.`,
      )}
      controlsComponent={<ScenarioLoader />}
    >
      <>
        <Row noGutters className="row-scenario-title">
          <Col xl={12} className="col-scenario-title">
            <ScenarioTitle title={currentScenarioName} onRename={handleScenarioRename} />
          </Col>
        </Row>

        <Row noGutters className="row-scenario-population-epidemiological">
          <ColCustom {...colPopulation} className="col-scenario-population">
            <ScenarioCardPopulation errors={errors} touched={touched} />
          </ColCustom>

          <ColCustom {...colEpidemiological} className="col-scenario-epidemiological">
            <ScenarioCardEpidemiological errors={errors} touched={touched} />
          </ColCustom>
        </Row>

        <Row noGutters className="row-scenario-mitigation">
          <Col className="col-scenario-mitigation">
            <ScenarioCardContainment errors={errors} touched={touched} />
          </Col>
        </Row>

        <Row noGutters className="row-scenario-severity">
          <Col className="col-scenario-severity">
            <SeverityCard />
          </Col>
        </Row>
      </>
    </CardWithControls>
  )
}

const ScenarioCard = connect(mapStateToProps, mapDispatchToProps)(ScenarioCardDisconnected)

export { ScenarioCard }

import React from 'react'

import _ from 'lodash'

import { Form, Formik } from 'formik'
import { connect } from 'react-redux'
import { Col, Row } from 'reactstrap'
import { ActionCreator } from 'typescript-fsa'

import { AllParams, SeverityTableData } from '../../algorithms/Param.types'

import { schema } from './validation/schema'

import { State } from '../../state/reducer'
import {
  setEpidemiologicalData,
  SetEpidemiologicalDataParams,
  setPopulationData,
  SetPopulationDataParams,
  setSeverityData,
  SetSimulationDataParams,
  setSimulationData,
} from '../../state/scenario/scenario.actions'
import { selectAllScenarioData } from '../../state/scenario/scenario.selectors'

import ResultsCard from './Results/ResultsCard'
import ScenarioCard from './Scenario/ScenarioCard'

import './Main.scss'

export function severityTableIsValid(severity: SeverityTableData) {
  return !severity.some(row => _.values(row?.errors).some(x => x !== undefined))
}

export function severityErrors(severity: SeverityTableData) {
  return severity.map(row => row?.errors)
}

export interface MainProps {
  scenarioData: AllParams
  setPopulationData: ActionCreator<SetPopulationDataParams>
  setEpidemiologicalData: ActionCreator<SetEpidemiologicalDataParams>
  setSimulationData: ActionCreator<SetSimulationDataParams>
}

function Main({ scenarioData, setPopulationData, setEpidemiologicalData, setSimulationData }: MainProps) {
  const { severityTable } = scenarioData.severity

  function setScenarioToCustom(newParams: AllParams) {
    // NOTE: deep object comparison!
    if (!_.isEqual(scenarioData.population, newParams.population)) {
      setPopulationData({ data: newParams.population })
    }
    // NOTE: deep object comparison!
    if (!_.isEqual(scenarioData.epidemiological, newParams.epidemiological)) {
      setEpidemiologicalData({ data: newParams.epidemiological })
    }
    // NOTE: deep object comparison!
    if (!_.isEqual(scenarioData.simulation, newParams.simulation)) {
      setSimulationData({ data: newParams.simulation })
    }
  }

  return (
    <Row noGutters>
      <Col md={12}>
        <Formik
          enableReinitialize
          initialValues={scenarioData}
          validationSchema={schema}
          validate={setScenarioToCustom}
        >
          {({ errors, touched, isValid }) => {
            const canRun = isValid && severityTableIsValid(severityTable)

            return (
              <Form className="form">
                <Row noGutters>
                  <Col lg={4} xl={6} className="py-1 px-1">
                    <ScenarioCard errors={errors} touched={touched} />
                  </Col>

                  <Col lg={8} xl={6} className="py-1 px-1">
                    <ResultsCard canRun={canRun} />
                    <ResultsCard canRun={canRun} />
                  </Col>
                </Row>
              </Form>
            )
          }}
        </Formik>
      </Col>
    </Row>
  )
}

const mapStateToProps = (state: State) => ({
  scenarioData: selectAllScenarioData(state),
})

const mapDispatchToProps = {
  setPopulationData,
  setEpidemiologicalData,
  setSeverityData,
  setSimulationData,
}

export default connect(mapStateToProps, mapDispatchToProps)(Main)

import React, { useReducer, useState } from 'react'

import _ from 'lodash'

import { Form, Formik, FormikHelpers } from 'formik'

import { Col, Row } from 'reactstrap'

import { SeverityTableRow } from './Scenario/SeverityTable'

import { AllParams } from '../../algorithms/Param.types'
import { AlgorithmResult } from '../../algorithms/Result.types'
import run from '../../algorithms/run'
import { makeTimeSeries } from '../../algorithms/TimeSeries'

import { EmpiricalData } from '../../algorithms/Param.types'

import countryAgeDistribution from '../../assets/data/country_age_distribution.json'
import severityData from '../../assets/data/severityData.json'

import countryCaseCounts from '../../assets/data/case_counts.json'

import { schema } from './validation/schema'

import { setEpidemiologicalData, setPopulationData, setSimulationData } from './state/actions'
import { scenarioReducer } from './state/reducer'
import { defaultScenarioState } from './state/state'

import { ResultsCard } from './Results/ResultsCard'
import { ScenarioCard } from './Scenario/ScenarioCard'
import { updateSeverityTable } from './Scenario/severityTableUpdate'

import './Main.scss'

export function severityTableIsValid(severity: SeverityTableRow[]) {
  return !severity.some(row => _.values(row?.errors).some(x => x !== undefined))
}

export function severityErrors(severity: SeverityTableRow[]) {
  return severity.map(row => row?.errors)
}

const severityDefaults: SeverityTableRow[] = updateSeverityTable(severityData)

function Main() {
  const [result, setResult] = useState<AlgorithmResult | undefined>()
  const [scenarioState, scenarioDispatch] = useReducer(scenarioReducer, defaultScenarioState /* , initDefaultState */)

  // TODO: Can this complex state be handled by formik too?
  const [severity, setSeverity] = useState<SeverityTableRow[]>(severityDefaults)

  const [empiricalCases, setEmpiricalCases] = useState<EmpiricalData | undefined>()

  const allParams = {
    population: scenarioState.population.data,
    epidemiological: scenarioState.epidemiological.data,
    simulation: scenarioState.simulation.data,
  }

  function setScenarioToCustom(newParams: AllParams) {
    // NOTE: deep object comparison!
    if (!_.isEqual(allParams.population, newParams.population)) {
      scenarioDispatch(setPopulationData({ data: newParams.population }))
    }
    // NOTE: deep object comparison!
    if (!_.isEqual(allParams.epidemiological, newParams.epidemiological)) {
      scenarioDispatch(setEpidemiologicalData({ data: newParams.epidemiological }))
    }
    // NOTE: deep object comparison!
    if (!_.isEqual(allParams.simulation, newParams.simulation)) {
      scenarioDispatch(setSimulationData({ data: newParams.simulation }))
    }
  }

  async function handleSubmit(params: AllParams, { setSubmitting }: FormikHelpers<AllParams>) {
    const paramsFlat = {
      ...params.population,
      ...params.epidemiological,
      ...params.simulation,
    }
    // TODO: check the presence of the current counry
    // TODO: type cast the json into something
    const ageDistribution = countryAgeDistribution[params.population.country]
    const caseCounts      = countryCaseCounts[scenarioState.population.data.cases] || []
    const containmentData = scenarioState.containment.data.reduction

    const newResult = await run(paramsFlat, severity, ageDistribution, containmentData)

    setResult(newResult)
    setEmpiricalCases(caseCounts)
    setSubmitting(false)
  }

  return (
    <Row noGutters>
      <Col md={12}>
        <Formik
          enableReinitialize
          initialValues={allParams}
          validationSchema={schema}
          onSubmit={handleSubmit}
          validate={setScenarioToCustom}
        >
          {({ errors, touched, isValid }) => {
            const canRun = isValid && severityTableIsValid(severity)

            return (
              <Form className="form">
                <Row noGutters>
                  <Col lg={4} xl={6} className="py-1 px-1">
                    <ScenarioCard
                      severity={severity}
                      setSeverity={setSeverity}
                      scenarioState={scenarioState}
                      scenarioDispatch={scenarioDispatch}
                      errors={errors}
                      touched={touched}
                    />
                  </Col>

                  <Col lg={8} xl={6} className="py-1 px-1">
                    <ResultsCard canRun={canRun} severity={severity} result={result} caseCounts={empiricalCases}/>
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

export default Main

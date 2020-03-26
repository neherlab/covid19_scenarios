import React, { useReducer, useState, useEffect } from 'react'
import { useDebouncedCallback } from 'use-debounce'

import _ from 'lodash'

import { Form, Formik, FormikHelpers } from 'formik'

import { Col, Row } from 'reactstrap'

import { SeverityTableRow } from './Scenario/SeverityTable'

import { AllParams, EmpiricalData } from '../../algorithms/types/Param.types'
import { toEmpiricalData } from '../../algorithms/types/JsonToTypes'

import { AlgorithmResult } from '../../algorithms/types/Result.types'
import run from '../../algorithms/run'

import countryAgeDistributionData from '../../assets/data/country_age_distribution.json'
import severityData from '../../assets/data/severityData.json'

import countryCaseCountData from '../../assets/data/case_counts.json'

import { schema } from './validation/schema'

import { setEpidemiologicalData, setPopulationData, setSimulationData, setContainmentData } from './state/actions'
import { scenarioReducer } from './state/reducer'
import { defaultScenarioState, State } from './state/state'
import { serializeScenarioToURL, deserializeScenarioFromURL } from './state/URLSerializer'

import { ResultsCard } from './Results/ResultsCard'
import { ScenarioCard } from './Scenario/ScenarioCard'
import { updateSeverityTable } from './Scenario/severityTableUpdate'

import './Main.scss'

export function severityTableIsValid(severity: SeverityTableRow[]) {
  return !severity.some((row) => _.values(row?.errors).some((x) => x !== undefined))
}

export function severityErrors(severity: SeverityTableRow[]) {
  return severity.map((row) => row?.errors)
}

async function runSimulation(
  scenarioState: State,
  params: AllParams,
  severity: SeverityTableRow[],
  setResult: React.Dispatch<React.SetStateAction<AlgorithmResult | undefined>>,
  setEmpiricalCases: React.Dispatch<React.SetStateAction<EmpiricalData | undefined>>,
) {
  const paramsFlat = {
    ...params.population,
    ...params.epidemiological,
    ...params.simulation,
  }

  if (!isCountry(params.population.country)) {
    console.error(`The given country is invalid: ${params.population.country}`)
    return
  }

  if (!isRegion(params.population.cases)) {
    console.error(`The given confirmed cases region is invalid: ${params.population.cases}`)
    return
  }

  const ageDistribution = countryAgeDistributionData[params.population.country]
  const caseCounts: EmpiricalData = toEmpiricalData(countryCaseCountData[params.population.cases] || [])
  const containmentData = params.containment.reduction

  serializeScenarioToURL(scenarioState, params)

  const newResult = await run(paramsFlat, severity, ageDistribution, containmentData)
  setResult(newResult)
  caseCounts.sort((a, b) => (a.time > b.time ? 1 : -1))
  setEmpiricalCases(caseCounts)
}

const severityDefaults: SeverityTableRow[] = updateSeverityTable(severityData)

const isCountry = (country: string): country is keyof typeof countryAgeDistributionData => {
  return countryAgeDistributionData.hasOwnProperty(country)
}

const isRegion = (region: string): region is keyof typeof countryCaseCountData => {
  return countryCaseCountData.hasOwnProperty(region)
}

function Main() {
  const [result, setResult] = useState<AlgorithmResult | undefined>()
  const [autorunSimulation, setAutorunSimulation] = useState(false)
  const [scenarioState, scenarioDispatch] = useReducer(
    scenarioReducer,
    defaultScenarioState,
    deserializeScenarioFromURL,
  )

  // TODO: Can this complex state be handled by formik too?
  const [severity, setSeverity] = useState<SeverityTableRow[]>(severityDefaults)

  const [empiricalCases, setEmpiricalCases] = useState<EmpiricalData | undefined>()

  const toggleAutorun = () => setAutorunSimulation(!autorunSimulation)

  const allParams: AllParams = {
    population: scenarioState.population.data,
    epidemiological: scenarioState.epidemiological.data,
    simulation: scenarioState.simulation.data,
    containment: scenarioState.containment.data,
  }

  const [debouncedRun] = useDebouncedCallback(
    (params: AllParams, severity: SeverityTableRow[]) =>
      runSimulation(scenarioState, params, severity, setResult, setEmpiricalCases),
    500,
  )

  useEffect(() => {
    if (autorunSimulation) {
      debouncedRun(
        {
          population: scenarioState.population.data,
          epidemiological: scenarioState.epidemiological.data,
          simulation: scenarioState.simulation.data,
          containment: scenarioState.containment.data,
        },
        severity,
      )
    }
  }, [autorunSimulation, debouncedRun, scenarioState, severity])

  const [setScenarioToCustom] = useDebouncedCallback((newParams: AllParams) => {
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
    // NOTE: deep object comparison!
    if (!_.isEqual(allParams.containment, newParams.containment)) {
      scenarioDispatch(setContainmentData({ data: newParams.containment }))
    }
  }, 1000)

  function handleSubmit(params: AllParams, { setSubmitting }: FormikHelpers<AllParams>) {
    runSimulation(scenarioState, params, severity, setResult, setEmpiricalCases)
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
          {({ errors, touched, isValid, isSubmitting }) => {
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
                    <ResultsCard
                      canRun={canRun}
                      autorunSimulation={autorunSimulation}
                      toggleAutorun={toggleAutorun}
                      severity={severity}
                      result={result}
                      caseCounts={empiricalCases}
                    />
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

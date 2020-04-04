import React, { useReducer, useState, useEffect } from 'react'
import { useDebouncedCallback } from 'use-debounce'

import _ from 'lodash'

import { Form, Formik, FormikHelpers } from 'formik'

import { Col, Row } from 'reactstrap'

import { SeverityTableRow } from './Scenario/SeverityTable'

import { AllParams, EmpiricalData } from '../../algorithms/types/Param.types'
import { AlgorithmResult } from '../../algorithms/types/Result.types'
import { run, intervalsToTimeSeries } from '../../algorithms/run'

import LocalStorage, { LOCAL_STORAGE_KEYS } from '../../helpers/localStorage'

import { CountryAgeDistribution } from '../../assets/data/CountryAgeDistribution.types'
import countryAgeDistributionData from '../../assets/data/country_age_distribution.json'
import severityData from '../../assets/data/severityData.json'

import countryCaseCountData from '../../assets/data/case_counts.json'

import { schema } from './validation/schema'

import { setContainmentData, setPopulationData, setEpidemiologicalData, setSimulationData } from './state/actions'
import { scenarioReducer } from './state/reducer'

import { defaultScenarioState } from './state/state'
import { deserializeScenarioFromURL } from './state/serialization/URLSerializer'
import { serialize } from './state/serialization/StateSerializer'

import { ResultsCard } from './Results/ResultsCard'
import { ScenarioCard } from './Scenario/ScenarioCard'
import { updateSeverityTable } from './Scenario/severityTableUpdate'

import './Main.scss'
import { TimeSeries } from '../../algorithms/types/TimeSeries.types'

export function severityTableIsValid(severity: SeverityTableRow[]) {
  return !severity.some((row) => _.values(row?.errors).some((x) => x !== undefined))
}

export function severityErrors(severity: SeverityTableRow[]) {
  return severity.map((row) => row?.errors)
}

async function runSimulation(
  params: AllParams,
  severity: SeverityTableRow[],
  setResult: React.Dispatch<React.SetStateAction<AlgorithmResult | undefined>>,
  setEmpiricalCases: React.Dispatch<React.SetStateAction<EmpiricalData | undefined>>,
) {
  const paramsFlat = {
    ...params.population,
    ...params.epidemiological,
    ...params.simulation,
    ...params.containment,
  }

  if (!isCountry(params.population.country)) {
    console.error(`The given country is invalid: ${params.population.country}`)
    return
  }

  if (params.population.cases !== 'none' && !isRegion(params.population.cases)) {
    console.error(`The given confirmed cases region is invalid: ${params.population.cases}`)
    return
  }

  const ageDistribution = (countryAgeDistributionData as CountryAgeDistribution)[params.population.country]
  const caseCounts: EmpiricalData = countryCaseCountData[params.population.cases] || []
  const containment: TimeSeries = intervalsToTimeSeries(params.containment.mitigationIntervals)

  intervalsToTimeSeries(params.containment.mitigationIntervals)
  const newResult = await run(paramsFlat, severity, ageDistribution, containment)

  setResult(newResult)
  caseCounts.sort((a, b) => (a.time > b.time ? 1 : -1))
  setEmpiricalCases(caseCounts)
}

const severityDefaults: SeverityTableRow[] = updateSeverityTable(severityData)

const isCountry = (country: string): country is keyof CountryAgeDistribution => {
  return Object.prototype.hasOwnProperty.call(countryAgeDistributionData, country)
}

const isRegion = (region: string): region is keyof typeof countryCaseCountData => {
  return Object.prototype.hasOwnProperty.call(countryCaseCountData, region)
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
  const [scenarioQueryString, setScenarioQueryString] = useState<string>('')
  const scenarioUrl = `${window.location.origin}?${scenarioQueryString}`

  const [empiricalCases, setEmpiricalCases] = useState<EmpiricalData | undefined>()

  const togglePersistAutorun = () => {
    LocalStorage.set(LOCAL_STORAGE_KEYS.AUTORUN_SIMULATION, !autorunSimulation)
    setAutorunSimulation(!autorunSimulation)
  }

  const updateBrowserUrl = () => {
    window.history.pushState('', '', `?${scenarioQueryString}`)
  }

  const allParams: AllParams = {
    population: scenarioState.data.population,
    epidemiological: scenarioState.data.epidemiological,
    simulation: scenarioState.data.simulation,
    containment: scenarioState.data.containment,
  }

  useEffect(() => {
    // runs only once, when the component is mounted
    const autorun = LocalStorage.get<boolean>(LOCAL_STORAGE_KEYS.AUTORUN_SIMULATION)
    setAutorunSimulation(autorun ?? false)

    // if the link contains query, we're executing the scenario (and displaying graphs)
    // this is because the page was either shared via link, or opened in new tab
    if (window.location.search) {
      debouncedRun(allParams, severity)
    }
  }, [])

  const [debouncedRun] = useDebouncedCallback(
    (params: AllParams, severity: SeverityTableRow[]) => runSimulation(params, severity, setResult, setEmpiricalCases),
    500,
  )

  useEffect(() => {
    // 1. upon each parameter change, we rebuild the query string
    const queryString = serialize(scenarioState)

    if (queryString !== scenarioQueryString) {
      // whenever the generated query string changes, we're updating:
      // 1. browser URL
      // 2. scenarioQueryString state variable (scenarioUrl is used by children)
      setScenarioQueryString(queryString)
    }

    if (autorunSimulation) {
      updateBrowserUrl()
      debouncedRun(allParams, severity)
    }
  }, [autorunSimulation, debouncedRun, scenarioState, scenarioQueryString, severity])

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
      const mitigationIntervals = _.map(newParams.containment.mitigationIntervals, _.cloneDeep)
      scenarioDispatch(setContainmentData({ data: { mitigationIntervals } }))
    }
  }, 1000)

  function handleSubmit(params: AllParams, { setSubmitting }: FormikHelpers<AllParams>) {
    updateBrowserUrl()
    runSimulation(params, severity, setResult, setEmpiricalCases)
    setSubmitting(false)
  }

  return (
    <Row>
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
                <Row>
                  <Col lg={4} xl={6} className="py-1">
                    <ScenarioCard
                      severity={severity}
                      setSeverity={setSeverity}
                      scenarioState={scenarioState}
                      scenarioDispatch={scenarioDispatch}
                      errors={errors}
                      touched={touched}
                    />
                  </Col>

                  <Col lg={8} xl={6} className="py-1">
                    <ResultsCard
                      canRun={canRun}
                      autorunSimulation={autorunSimulation}
                      toggleAutorun={togglePersistAutorun}
                      severity={severity}
                      params={allParams}
                      mitigation={allParams.containment}
                      result={result}
                      caseCounts={empiricalCases}
                      scenarioUrl={scenarioUrl}
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

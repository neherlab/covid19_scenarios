import React, { useReducer, useState, useEffect } from 'react'
import { useDebouncedCallback } from 'use-debounce'

import _ from 'lodash'

import { Form, Formik, FormikHelpers, FormikErrors, FormikValues } from 'formik'

import { Col, Row } from 'reactstrap'

import { SeverityTableRow } from './Scenario/ScenarioTypes'

import { AllParams, EmpiricalData } from '../../algorithms/types/Param.types'
import { AlgorithmResult } from '../../algorithms/types/Result.types'
import { run, intervalsToTimeSeries } from '../../algorithms/run'

import LocalStorage, { LOCAL_STORAGE_KEYS } from '../../helpers/localStorage'

import severityData from '../../assets/data/severityData.json'
import { getCaseCountsData } from './state/caseCountsData'

import { schema } from './validation/schema'

import { setContainmentData, setPopulationData, setEpidemiologicalData, setSimulationData } from './state/actions'
import { scenarioReducer } from './state/reducer'

import { defaultScenarioState, State } from './state/state'
import { deserializeScenarioFromURL, updateBrowserURL, buildLocationSearch } from './state/serialization/URLSerializer'

import { ResultsCard } from './Results/ResultsCard'
import { ScenarioCard } from './Scenario/ScenarioCard'
import { updateSeverityTable } from './Scenario/severityTableUpdate'
import { TimeSeries } from '../../algorithms/types/TimeSeries.types'
import PrintPage from './PrintPage/PrintPage'

import './Main.scss'

interface FormikValidationErrors extends Error {
  errors: FormikErrors<FormikValues>
}

export function severityTableIsValid(severity: SeverityTableRow[]) {
  return !severity.some((row) => _.values(row?.errors).some((x) => x !== undefined))
}

export function severityErrors(severity: SeverityTableRow[]) {
  return severity.map((row) => row?.errors)
}

async function runSimulation(
  params: AllParams,
  scenarioState: State,
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

  const caseCounts = getCaseCountsData(params.population.cases)
  const containment: TimeSeries = intervalsToTimeSeries(params.containment.mitigationIntervals)

  intervalsToTimeSeries(params.containment.mitigationIntervals)
  const newResult = await run(paramsFlat, severity, scenarioState.ageDistribution, containment)
  setResult(newResult)
  caseCounts.sort((a, b) => (a.time > b.time ? 1 : -1))
  setEmpiricalCases(caseCounts)
}

const severityDefaults: SeverityTableRow[] = updateSeverityTable(severityData)

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
  const [printable, setPrintable] = useState(false)
  const openPrintPreview = () => setPrintable(true)

  const [empiricalCases, setEmpiricalCases] = useState<EmpiricalData | undefined>()

  const togglePersistAutorun = () => {
    LocalStorage.set(LOCAL_STORAGE_KEYS.AUTORUN_SIMULATION, !autorunSimulation)
    setAutorunSimulation(!autorunSimulation)
  }

  const allParams: AllParams = {
    population: scenarioState.data.population,
    epidemiological: scenarioState.data.epidemiological,
    simulation: scenarioState.data.simulation,
    containment: scenarioState.data.containment,
  }

  const [debouncedRun] = useDebouncedCallback(
    (params: AllParams, scenarioState: State, severity: SeverityTableRow[]) =>
      runSimulation(params, scenarioState, severity, setResult, setEmpiricalCases),
    500,
  )

  useEffect(() => {
    // runs only once, when the component is mounted
    const autorun = LocalStorage.get<boolean>(LOCAL_STORAGE_KEYS.AUTORUN_SIMULATION)
    setAutorunSimulation(autorun ?? false)

    // if the link contains query, we're executing the scenario (and displaying graphs)
    // this is because the page was either shared via link, or opened in new tab
    if (window.location.search) {
      debouncedRun(allParams, scenarioState, severity)

      // At this point the scenario params have been captured, and we can clean up the URL.
      updateBrowserURL('/')
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (autorunSimulation) {
      debouncedRun(allParams, scenarioState, severity)
    }
  }, [autorunSimulation, debouncedRun, scenarioState, severity]) // eslint-disable-line react-hooks/exhaustive-deps

  const [validateFormAndUpdateState] = useDebouncedCallback((newParams: AllParams) => {
    return schema
      .validate(newParams)
      .then((validParams) => {
        // NOTE: deep object comparison!
        if (!_.isEqual(allParams.population, validParams.population)) {
          scenarioDispatch(setPopulationData({ data: validParams.population }))
        }
        // NOTE: deep object comparison!
        if (!_.isEqual(allParams.epidemiological, validParams.epidemiological)) {
          scenarioDispatch(setEpidemiologicalData({ data: validParams.epidemiological }))
        }
        // NOTE: deep object comparison!
        if (!_.isEqual(allParams.simulation, validParams.simulation)) {
          scenarioDispatch(setSimulationData({ data: validParams.simulation }))
        }
        // NOTE: deep object comparison!
        if (!_.isEqual(allParams.containment, validParams.containment)) {
          const mitigationIntervals = _.map(validParams.containment.mitigationIntervals, _.cloneDeep)
          scenarioDispatch(setContainmentData({ data: { mitigationIntervals } }))
        }

        return validParams
      })
      .catch((error: FormikValidationErrors) => error.errors)
  }, 1000)

  function handleSubmit(params: AllParams, { setSubmitting }: FormikHelpers<AllParams>) {
    runSimulation(params, scenarioState, severity, setResult, setEmpiricalCases)
    setSubmitting(false)
  }

  if (printable) {
    return (
      <PrintPage
        params={allParams}
        scenarioUsed={scenarioState.current}
        severity={severity}
        result={result}
        caseCounts={empiricalCases}
        onClose={() => {
          setPrintable(false)
        }}
      />
    )
  }

  return (
    <Row>
      <Col md={12}>
        <Formik
          enableReinitialize
          initialValues={allParams}
          onSubmit={handleSubmit}
          validate={validateFormAndUpdateState}
          validationSchema={schema}
        >
          {({ values, errors, touched, isValid, isSubmitting }) => {
            const canRun = isValid && severityTableIsValid(severity)

            return (
              <Form className="form">
                <Row>
                  <Col lg={4} xl={6} className="py-1">
                    <ScenarioCard
                      values={values}
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
                      scenarioUrl={buildLocationSearch(scenarioState)}
                      openPrintPreview={openPrintPreview}
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

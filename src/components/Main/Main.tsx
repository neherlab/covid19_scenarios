import React, { useReducer, useState, useEffect } from 'react'

import { cloneDeep, map, isEqual } from 'lodash'

import { useDebouncedCallback } from 'use-debounce'
import { Form, Formik, FormikHelpers, FormikErrors, FormikValues } from 'formik'
import { Col, Row } from 'reactstrap'

import type { AlgorithmResult } from '../../algorithms/types/Result.types'
import type { ScenarioDatum, SeverityDistributionDatum, CaseCountsDatum } from '../../algorithms/types/Param.types'

import { run } from '../../workers/algorithm'
import LocalStorage, { LOCAL_STORAGE_KEYS } from '../../helpers/localStorage'

import { schema } from './validation/schema'
import { getCaseCountsData } from './state/getCaseCounts'
import { setContainmentData, setPopulationData, setEpidemiologicalData, setSimulationData } from './state/actions'
import { scenarioReducer } from './state/reducer'
import { State } from './state/state'

import { InitialStateComponentProps } from './HandleInitialState'
import { ResultsCard } from './Results/ResultsCard'
import { ScenarioCard } from './Scenario/ScenarioCard'
import PrintPage from './PrintPage/PrintPage'

import './Main.scss'
import { areAgeGroupParametersValid } from './Scenario/AgeGroupParameters'

interface FormikValidationErrors extends Error {
  errors: FormikErrors<FormikValues>
}

async function runSimulation(
  params: ScenarioDatum,
  scenarioState: State,
  severity: SeverityDistributionDatum[],
  setResult: React.Dispatch<React.SetStateAction<AlgorithmResult | undefined>>,
  setEmpiricalCases: React.Dispatch<React.SetStateAction<CaseCountsDatum[] | undefined>>,
  setIsRunning: React.Dispatch<React.SetStateAction<boolean>>,
) {
  setIsRunning(true)
  try {
    const paramsFlat = {
      ...params.population,
      ...params.epidemiological,
      ...params.simulation,
      ...params.mitigation,
    }

    const caseCounts = getCaseCountsData(params.population.caseCountsName)
    const newResult = await run({ params: paramsFlat, severity, ageDistribution: scenarioState.ageDistribution })
    setResult(newResult)
    caseCounts.sort((a, b) => (a.time > b.time ? 1 : -1))
    setEmpiricalCases(caseCounts)
  } catch (error) {
    // Rejected promises are thrown by await functions.
    // Catch and log the error message to console.
    console.error(error)
  }
  setIsRunning(false)
}

function getColumnSizes(areResultsMaximized: boolean) {
  if (areResultsMaximized) {
    return { colScenario: { xl: 4 }, colResults: { xl: 8 } }
  }

  return { colScenario: { xl: 6 }, colResults: { xl: 6 } }
}

function Main({ initialState }: InitialStateComponentProps) {
  const [result, setResult] = useState<AlgorithmResult | undefined>()
  const [autorunSimulation, setAutorunSimulation] = useState(
    LocalStorage.get<boolean>(LOCAL_STORAGE_KEYS.AUTORUN_SIMULATION) ?? false,
  )
  const [areResultsMaximized, setAreResultsMaximized] = useState(false)
  const [scenarioState, scenarioDispatch] = useReducer(scenarioReducer, initialState.scenarioState)

  // TODO: Can this complex state be handled by formik too?
  const [severity, setSeverity] = useState<SeverityDistributionDatum[]>(initialState.severityTable)
  const [printable, setPrintable] = useState(false)
  const openPrintPreview = () => setPrintable(true)

  const [empiricalCases, setEmpiricalCases] = useState<CaseCountsDatum[] | undefined>()

  const togglePersistAutorun = () => {
    LocalStorage.set(LOCAL_STORAGE_KEYS.AUTORUN_SIMULATION, !autorunSimulation)
    setAutorunSimulation(!autorunSimulation)
  }

  const [isRunning, setIsRunning] = useState(false)

  const [debouncedRun] = useDebouncedCallback(
    (params: ScenarioDatum, scenarioState: State, severity: SeverityDistributionDatum[]) =>
      runSimulation(params, scenarioState, severity, setResult, setEmpiricalCases, setIsRunning),
    500,
  )

  useEffect(() => {
    // runs only once, when the component is mounted
    if (!initialState.isDefault) {
      debouncedRun(scenarioState.data, scenarioState, severity)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (autorunSimulation && areAgeGroupParametersValid(severity, scenarioState.ageDistribution)) {
      debouncedRun(scenarioState.data, scenarioState, severity)
    }
  }, [autorunSimulation, debouncedRun, scenarioState, severity])

  const [validateFormAndUpdateState] = useDebouncedCallback((newParams: ScenarioDatum) => {
    return schema
      .validate(newParams)
      .then((validParams) => {
        // NOTE: deep object comparison!
        if (!isEqual(scenarioState.data.population, validParams.population)) {
          scenarioDispatch(setPopulationData({ data: validParams.population }))
        }
        // NOTE: deep object comparison!
        if (!isEqual(scenarioState.data.epidemiological, validParams.epidemiological)) {
          scenarioDispatch(setEpidemiologicalData({ data: validParams.epidemiological }))
        }
        // NOTE: deep object comparison!
        if (!isEqual(scenarioState.data.simulation, validParams.simulation)) {
          scenarioDispatch(setSimulationData({ data: validParams.simulation }))
        }
        // NOTE: deep object comparison!
        if (!isEqual(scenarioState.data.mitigation, validParams.mitigation)) {
          const mitigationIntervals = map(validParams.mitigation.mitigationIntervals, cloneDeep)
          scenarioDispatch(setContainmentData({ data: { mitigationIntervals } }))
        }

        return validParams
      })
      .catch((error: FormikValidationErrors) => error.errors)
  }, 1000)

  function handleSubmit(params: ScenarioDatum, { setSubmitting }: FormikHelpers<ScenarioDatum>) {
    runSimulation(params, scenarioState, severity, setResult, setEmpiricalCases, setIsRunning)
    setSubmitting(false)
  }

  function toggleResultsMaximized() {
    setAreResultsMaximized(!areResultsMaximized)
  }

  const { colScenario, colResults } = getColumnSizes(areResultsMaximized)

  if (printable) {
    return (
      <PrintPage
        params={scenarioState.data}
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
          initialValues={scenarioState.data}
          onSubmit={handleSubmit}
          validate={validateFormAndUpdateState}
          validationSchema={schema}
        >
          {({ values, errors, touched, isValid, isSubmitting }) => {
            const canRun = isValid && areAgeGroupParametersValid(severity, scenarioState.ageDistribution)
            return (
              <Form noValidate className="form">
                <Row>
                  <Col lg={4} {...colScenario} className="py-1 animate-flex-width">
                    <ScenarioCard
                      scenario={values}
                      severity={severity}
                      setSeverity={setSeverity}
                      scenarioState={scenarioState}
                      scenarioDispatch={scenarioDispatch}
                      errors={errors}
                      touched={touched}
                      areResultsMaximized={areResultsMaximized}
                    />
                  </Col>

                  <Col lg={8} {...colResults} className="py-1 animate-flex-width">
                    <ResultsCard
                      canRun={canRun}
                      isRunning={isRunning}
                      autorunSimulation={autorunSimulation}
                      toggleAutorun={togglePersistAutorun}
                      severity={severity}
                      scenarioData={scenarioState.data}
                      ageDistribution={scenarioState.ageDistribution}
                      result={result}
                      caseCounts={empiricalCases}
                      openPrintPreview={openPrintPreview}
                      areResultsMaximized={areResultsMaximized}
                      toggleResultsMaximized={toggleResultsMaximized}
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

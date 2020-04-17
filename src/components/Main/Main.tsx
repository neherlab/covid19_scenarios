import React, { useReducer, useState, useEffect } from 'react'
import { useDebouncedCallback } from 'use-debounce'

import _ from 'lodash'

import { Form, Formik, FormikHelpers, FormikErrors, FormikValues } from 'formik'

import { Col, Row } from 'reactstrap'

import { AllParams, EmpiricalData, Severity } from '../../algorithms/types/Param.types'
import { AlgorithmResult } from '../../algorithms/types/Result.types'
import { run } from '../../algorithms/run'

import LocalStorage, { LOCAL_STORAGE_KEYS } from '../../helpers/localStorage'

import { getCaseCountsData } from './state/caseCountsData'

import { schema } from './validation/schema'

import { setContainmentData, setPopulationData, setEpidemiologicalData, setSimulationData } from './state/actions'
import { scenarioReducer } from './state/reducer'

import { State } from './state/state'
import { buildLocationSearch } from './state/serialization/URLSerializer'

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
  params: AllParams,
  scenarioState: State,
  severity: Severity[],
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
  const newResult = await run(paramsFlat, severity, scenarioState.ageDistribution)
  setResult(newResult)
  caseCounts.sort((a, b) => (a.time > b.time ? 1 : -1))
  setEmpiricalCases(caseCounts)
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
  const [severity, setSeverity] = useState<Severity[]>(initialState.severityTable)
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
    (params: AllParams, scenarioState: State, severity: Severity[]) =>
      runSimulation(params, scenarioState, severity, setResult, setEmpiricalCases),
    500,
  )

  useEffect(() => {
    // runs only once, when the component is mounted
    if (!initialState.isDefault) {
      debouncedRun(allParams, scenarioState, severity)
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

  function toggleResultsMaximized() {
    setAreResultsMaximized(!areResultsMaximized)
  }

  const { colScenario, colResults } = getColumnSizes(areResultsMaximized)

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
            const canRun = isValid && areAgeGroupParametersValid(severity, scenarioState.ageDistribution)
            return (
              <Form noValidate className="form">
                <Row>
                  <Col lg={4} {...colScenario} className="py-1 animate-flex-width">
                    <ScenarioCard
                      values={values}
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
                      autorunSimulation={autorunSimulation}
                      toggleAutorun={togglePersistAutorun}
                      severity={severity}
                      params={allParams}
                      ageDistribution={scenarioState.ageDistribution}
                      mitigation={allParams.containment}
                      result={result}
                      caseCounts={empiricalCases}
                      scenarioUrl={buildLocationSearch(scenarioState)}
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

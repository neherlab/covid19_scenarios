import React, { useReducer, useState, useEffect } from 'react'
import { useDebouncedCallback } from 'use-debounce'
import isEqual from 'is-equal'

import _ from 'lodash'

import { Form, Formik, FormikHelpers } from 'formik'

import { Col, Row } from 'reactstrap'

import { SeverityTableRow } from './Scenario/SeverityTable'

import { AllParams, EmpiricalData } from '../../algorithms/types/Param.types'
import { AlgorithmResult } from '../../algorithms/types/Result.types'
import run from '../../algorithms/run'

import LocalStorage, { LOCAL_STORAGE_KEYS } from '../../helpers/localStorage'

import { CountryAgeDistribution } from '../../assets/data/CountryAgeDistribution.types'
import countryAgeDistributionData from '../../assets/data/country_age_distribution.json'
import severityData from '../../assets/data/severityData.json'

import countryCaseCountData from '../../assets/data/case_counts.json'

import { schema } from './validation/schema'

import {
  setContainmentData,
  setPopulationData,
  setEpidemiologicalData,
  setSimulationData,
  setScenarioData,
  setScenario,
} from './state/actions'
import { scenarioReducer } from './state/reducer'
import { CUSTOM_SCENARIO_NAME, defaultScenarioState } from './state/state'

import { ResultsCard } from './Results/ResultsCard'
import { ScenarioCard } from './Scenario/ScenarioCard'
import { updateSeverityTable } from './Scenario/severityTableUpdate'

import './Main.scss'
import { ScenarioParams } from '../MultipleScenarios'

export function severityTableIsValid(severity: SeverityTableRow[]) {
  return !severity.some((row) => _.values(row?.errors).some((x) => x !== undefined))
}

export function severityErrors(severity: SeverityTableRow[]) {
  return severity.map((row) => row?.errors)
}

async function runSimulation(
  params: AllParams,
  severity: SeverityTableRow[],
  setResult: (result: AlgorithmResult) => void,
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

  if (params.population.cases !== "none" && !isRegion(params.population.cases)) {
    console.error(`The given confirmed cases region is invalid: ${params.population.cases}`)
    return
  }

  const ageDistribution = (countryAgeDistributionData as CountryAgeDistribution)[params.population.country]
  const caseCounts: EmpiricalData = countryCaseCountData[params.population.cases] || []

  const containmentData = params.containment.reduction

  const newResult = await run(paramsFlat, severity, ageDistribution, containmentData)
  setResult(newResult)
  caseCounts.sort((a, b) => (a.time > b.time ? 1 : -1))
  setEmpiricalCases(caseCounts)
}

export const severityDefaults: SeverityTableRow[] = updateSeverityTable(severityData)

const isCountry = (country: string): country is keyof CountryAgeDistribution => {
  return Object.prototype.hasOwnProperty.call(countryAgeDistributionData, country)
}

const isRegion = (region: string): region is keyof typeof countryCaseCountData => {
  return Object.prototype.hasOwnProperty.call(countryCaseCountData, region)
}

interface MainProps {
  incomingParams: ScenarioParams | null
  onParamChange: (params: ScenarioParams) => void
  incomingResult: AlgorithmResult | null
  onResultChange: (Result: AlgorithmResult) => void
  onScenarioClone: () => void
  onScenarioSave?: () => void
  onScenarioShare: () => void
  onScenarioDelete?: () => void
}

function Main({
  incomingParams,
  onParamChange,
  incomingResult,
  onResultChange,
  onScenarioClone,
  onScenarioSave,
  onScenarioShare,
  onScenarioDelete,
}: MainProps) {
  const [result, setResult] = useState<AlgorithmResult | undefined>()
  const [autorunSimulation, setAutorunSimulation] = useState(false)
  const [scenarioState, scenarioDispatch] = useReducer(scenarioReducer, defaultScenarioState)

  // TODO: Can this complex state be handled by formik too?
  const [severity, setSeverity] = useState<SeverityTableRow[]>(severityDefaults)

  const [empiricalCases, setEmpiricalCases] = useState<EmpiricalData | undefined>()

  const togglePersistAutorun = () => {
    LocalStorage.set(LOCAL_STORAGE_KEYS.AUTORUN_SIMULATION, !autorunSimulation)
    setAutorunSimulation(!autorunSimulation)
  }

  useEffect(() => {
    const autorun = LocalStorage.get<boolean>(LOCAL_STORAGE_KEYS.AUTORUN_SIMULATION)
    setAutorunSimulation(autorun ?? false)
  }, [])

  const allParams: AllParams = {
    population: scenarioState.data.population,
    epidemiological: scenarioState.data.epidemiological,
    simulation: scenarioState.data.simulation,
    containment: scenarioState.data.containment,
  }

  const setAllResults = (result: AlgorithmResult) => {
    setResult(result)
    onResultChange(result)
  }

  const [debouncedRun, cancelDebouncedRun] = useDebouncedCallback(
    (params: AllParams, severity: SeverityTableRow[]) =>
      runSimulation(params, severity, setAllResults, setEmpiricalCases),
    500,
  )

  useEffect(() => {
    if (autorunSimulation) {
      debouncedRun(
        {
          population: scenarioState.data.population,
          epidemiological: scenarioState.data.epidemiological,
          simulation: scenarioState.data.simulation,
          containment: scenarioState.data.containment,
        },
        severity,
      )
    }
  }, [autorunSimulation, debouncedRun, scenarioState, severity])

  const [setScenarioToCustom, cancelSetScenarioToCustom] = useDebouncedCallback((newParams: AllParams) => {
    // NOTE: deep object comparison!
    // Note: isEqual handles Date() objects while lodash.isEqual does not.
    if (!isEqual(allParams.population, newParams.population)) {
      scenarioDispatch(setPopulationData({ data: newParams.population }))
    }
    if (!isEqual(allParams.epidemiological, newParams.epidemiological)) {
      scenarioDispatch(setEpidemiologicalData({ data: newParams.epidemiological }))
    }
    if (!isEqual(allParams.simulation, newParams.simulation)) {
      scenarioDispatch(setSimulationData({ data: newParams.simulation }))
    }
    if (!isEqual(allParams.containment, newParams.containment)) {
      scenarioDispatch(setContainmentData({ data: newParams.containment }))
    }
  }, 1000)

  useEffect(() => {
    onParamChange({ scenarioState, severity })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scenarioState, severity])

  useEffect(() => {
    if (incomingParams) {
      // Prior to update we must cancel any pending (debounced) call to set from
      // form parameters. A re-render with prior scenario data can occur when
      // switching views with multiple scenarios. The debounced call would
      // change parameters for the new scenario.
      cancelSetScenarioToCustom()
      cancelDebouncedRun()

      // Update state from incoming parameters and be paranoid about unecessary updates
      if (!isEqual(scenarioState.data, incomingParams.scenarioState.data)) {
        scenarioDispatch(setScenarioData({ data: incomingParams.scenarioState.data }))
        if (incomingParams.scenarioState.current !== CUSTOM_SCENARIO_NAME) {
          scenarioDispatch(setScenario({ name: incomingParams.scenarioState.current }))
        }
        setSeverity(incomingParams.severity)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [incomingParams, cancelSetScenarioToCustom, cancelDebouncedRun])

  useEffect(() => {
    if (incomingResult && !isEqual(result, incomingResult)) {
      // Update from incoming and be paranoid about unecessary updates
      setResult(incomingResult)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [incomingResult])

  function handleSubmit(params: AllParams, { setSubmitting }: FormikHelpers<AllParams>) {
    runSimulation(params, severity, setAllResults, setEmpiricalCases)
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
                      toggleAutorun={togglePersistAutorun}
                      severity={severity}
                      result={result}
                      caseCounts={empiricalCases}
                      onScenarioClone={onScenarioClone}
                      onScenarioSave={onScenarioSave}
                      onScenarioShare={onScenarioShare}
                      onScenarioDelete={onScenarioDelete}
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

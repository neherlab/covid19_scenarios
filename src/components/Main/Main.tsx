import React, { useReducer, useState, useEffect, useCallback } from 'react'
import { values } from 'lodash'
import { Form, Formik, FormikHelpers } from 'formik'
import { Col, Row } from 'reactstrap'
import { SeverityTableRow } from './Scenario/SeverityTable'
import { AllParams, EmpiricalData } from '../../algorithms/types/Param.types'
import { AlgorithmResult } from '../../algorithms/types/Result.types'
import { run, intervalsToTimeSeries } from '../../algorithms/run'
import LocalStorage, { LOCAL_STORAGE_KEYS } from '../../helpers/localStorage'
import severityData from '../../assets/data/severityData.json'
import { getCaseCountsData } from './state/caseCountsData'
import { schema } from './validation/schema'
import { scenarioReducer } from './state/reducer'
import { defaultScenarioState, State } from './state/state'
import { deserializeScenarioFromURL, buildLocationSearch } from './state/serialization/URLSerializer'
import { ResultsCard } from './Results/ResultsCard'
import { ScenarioCard } from './Scenario/ScenarioCard'
import { updateSeverityTable } from './Scenario/severityTableUpdate'
import { TimeSeries } from '../../algorithms/types/TimeSeries.types'
import Delay from './state/delay/Delay'
import { updateURL } from './state/delay/updateURL'
import './Main.scss'

export const severityTableIsValid = (severity: SeverityTableRow[]) => {
  return !severity.some((row) => values(row?.errors).some((x) => x !== undefined))
}

export const severityErrors = (severity: SeverityTableRow[]) => {
  return severity.map((row) => row?.errors)
}

const runSimulation = async (
  params: AllParams,
  scenarioState: State,
  severity: SeverityTableRow[],
  setResult: React.Dispatch<React.SetStateAction<AlgorithmResult | undefined>>,
  setEmpiricalCases: React.Dispatch<React.SetStateAction<EmpiricalData | undefined>>,
) => {
  //console.log('=== RUNNING SIMULATION ===')
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

const Main = () => {
  const [result, setResult] = useState<AlgorithmResult | undefined>()
  const [autorunSimulation, setAutorunSimulation] = useState(
    LocalStorage.get<boolean>(LOCAL_STORAGE_KEYS.AUTORUN_SIMULATION) || false,
  )
  const [scenarioState, scenarioDispatch] = useReducer(
    scenarioReducer,
    defaultScenarioState,
    deserializeScenarioFromURL,
  )

  // TODO: Can this complex state be handled by formik too?
  const [severity, setSeverity] = useState<SeverityTableRow[]>(severityDefaults)
  const [locationSearch, setLocationSeach] = useState<string>('')
  const scenarioUrl = `${window.location.origin}${locationSearch}`

  const [empiricalCases, setEmpiricalCases] = useState<EmpiricalData | undefined>()

  const togglePersistAutorun = useCallback(() => {
    LocalStorage.set(LOCAL_STORAGE_KEYS.AUTORUN_SIMULATION, !autorunSimulation)
    setAutorunSimulation(!autorunSimulation)
  }, [autorunSimulation])

  // runs only once, when the component is mounted:
  useEffect(() => {
    Delay.setDebug(LocalStorage.get(LOCAL_STORAGE_KEYS.DEBUG) || false)
    Delay.connect(scenarioDispatch)

    // if the link contains a persisted query, we're running the simulation without any delay (and displaying graphs)
    // this is because the page was either shared via link, or opened in new tab
    if (window.location.search) {
      //console.log('=== SEARCH STRING DETECTED ===', window.location.search)
      const deserializedState = deserializeScenarioFromURL(scenarioState)
      const params: AllParams = {
        ...deserializedState.data,
      }
      Delay.setParams(params)
      runSimulation(params, scenarioState, severity, setResult, setEmpiricalCases)
    }

    // clean-up on unmount
    return Delay.disconnect
  }, [])

  useEffect(() => {
    const nextLocationSearch = buildLocationSearch(scenarioState)

    if (nextLocationSearch !== locationSearch) {
      // whenever the generated query string changes, we're updating:
      setLocationSeach(nextLocationSearch)

      if (autorunSimulation) {
        runSimulation(Delay.getLatestParams(), scenarioState, severity, setResult, setEmpiricalCases)
      }
    }
  }, [autorunSimulation, scenarioState, severity])

  const handleSubmit = useCallback(
    (params: AllParams, { setSubmitting }: FormikHelpers<AllParams>) => {
      updateURL(params)
      runSimulation(params, scenarioState, severity, setResult, setEmpiricalCases)
      setSubmitting(false)
    },
    [scenarioState, severity, setResult, setEmpiricalCases],
  )

  const params = Delay.getLatestParams()

  return (
    <Row>
      <Col md={12}>
        <Formik
          enableReinitialize
          initialValues={params}
          validationSchema={schema}
          onSubmit={handleSubmit}
          validate={Delay.trigger}
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
                      params={params}
                      mitigation={params.containment}
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

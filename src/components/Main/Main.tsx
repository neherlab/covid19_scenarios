import React, { useReducer, useState, useEffect } from 'react'
import { useDebouncedCallback } from 'use-debounce'

import _ from 'lodash'

import { Form, Formik, FormikHelpers } from 'formik'

import { Col, Row } from 'reactstrap'

import { SeverityTableRow } from './Scenario/SeverityTable'

import { AllParams, EmpiricalData } from '../../algorithms/types/Param.types'
import { AlgorithmResult } from '../../algorithms/types/Result.types'
import run from '../../algorithms/run'

import countryAgeDistribution from '../../assets/data/country_age_distribution.json'
import severityData from '../../assets/data/severityData.json'

import countryCaseCounts from '../../assets/data/case_counts.json'

import { schema } from './validation/schema'

import { setEpidemiologicalData, setPopulationData, setSimulationData, setContainmentData } from './state/actions'
import { scenarioReducer } from './state/reducer'
import { defaultScenarioState } from './state/state'
import { serializeScenarioToURL, deserializeScenarioFromURL } from './state/URLSerializer'

import { ResultsCard } from './Results/ResultsCard'
import { ScenarioCard } from './Scenario/ScenarioCard'
import { updateSeverityTable } from './Scenario/severityTableUpdate'

import './Main.scss'
import { useScrollIntoView } from '../../helpers/hooks'

export function severityTableIsValid(severity: SeverityTableRow[]) {
  return !severity.some((row) => _.values(row?.errors).some((x) => x !== undefined))
}

export function severityErrors(severity: SeverityTableRow[]) {
  return severity.map((row) => row?.errors)
}

const severityDefaults: SeverityTableRow[] = updateSeverityTable(severityData)

const isCountry = (country: string): country is keyof typeof countryAgeDistribution => {
  return countryAgeDistribution.hasOwnProperty(country)
}

const isRegion = (region: string): region is keyof typeof countryCaseCounts => {
  return countryCaseCounts.hasOwnProperty(region)
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

  async function runSimulation(params: AllParams) {
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

    const ageDistribution = countryAgeDistribution[params.population.country]
    const caseCounts: EmpiricalData = countryCaseCounts[params.population.cases] || []
    const containmentData = params.containment.reduction

    serializeScenarioToURL(scenarioState, params)
    const newResult = await run(paramsFlat, severity, ageDistribution, containmentData)
    setResult(newResult)
    caseCounts.sort((a, b) => (a.time > b.time ? 1 : -1))
    setEmpiricalCases(caseCounts)
  }

  const [debouncedRun] = useDebouncedCallback((params: AllParams) => runSimulation(params), 500)

  useEffect(() => {
    if (autorunSimulation) {
      debouncedRun({
        population: scenarioState.population.data,
        epidemiological: scenarioState.epidemiological.data,
        simulation: scenarioState.simulation.data,
        containment: scenarioState.containment.data,
      })
    }
  }, [autorunSimulation, debouncedRun, scenarioState])

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
    runSimulation(params)
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
            /**
             * viewport width - we only want to scroll the ResultsCard into view if viewing on mobile devices, where the layout is only a single column
             * @see {@link https://stackoverflow.com/a/8876069/3942699}
             */
            const vw = Math.max(document.documentElement.clientWidth, window.innerWidth || 0)
            /**
             * 992 is the width at which the layout collapses into a single column
             * @see {@tutorial https://getbootstrap.com/docs/4.0/layout/overview/#responsive-breakpoints}
             *
             * only `scrollIntoView` when `isSubmitting` goes from `true` -> `false`
             */
            const refOfElementToScrollIntoView = useScrollIntoView<HTMLDivElement>(!isSubmitting && vw < 992)

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
                    <div ref={refOfElementToScrollIntoView}>
                      <ResultsCard
                        canRun={canRun}
                        autorunSimulation={autorunSimulation}
                        toggleAutorun={toggleAutorun}
                        severity={severity}
                        result={result}
                        caseCounts={empiricalCases}
                      />
                    </div>
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

import React, { useState } from 'react'

import { connect } from 'react-redux'
import { Form, Formik, FormikHelpers, FormikErrors, FormikValues } from 'formik'
import { Col, Row } from 'reactstrap'

import type { AlgorithmResult } from '../../algorithms/types/Result.types'
import type {
  ScenarioDatum,
  SeverityDistributionDatum,
  CaseCountsDatum,
  AgeDistributionDatum,
} from '../../algorithms/types/Param.types'

import type { State } from '../../state/reducer'
import { selectIsRunning } from '../../state/algorithm/algorithm.selectors'
import {
  selectScenarioData,
  selectAgeDistributionData,
  selectSeverityDistributionData,
} from '../../state/scenario/scenario.selectors'
import {
  selectIsAutorunEnabled,
  selectIsLogScale,
  selectShouldFormatNumbers,
  selectAreResultsMaximized,
} from '../../state/settings/settings.selectors'

import { ColCustom } from '../Layout/ColCustom'

import { areAgeGroupParametersValid } from './Scenario/AgeGroupParameters'
import { schema } from './validation/schema'

import { ResultsCard } from './Results/ResultsCard'
import { ScenarioCard } from './Scenario/ScenarioCard'
// import PrintPage from './PrintPage/PrintPage'

import './Main.scss'

interface FormikValidationErrors extends Error {
  errors: FormikErrors<FormikValues>
}

function getColumnSizes(areResultsMaximized: boolean) {
  if (areResultsMaximized) {
    return { colScenario: { xl: 4 }, colResults: { xl: 8 } }
  }

  return { colScenario: { xl: 6 }, colResults: { xl: 6 } }
}

export interface MainProps {
  scenarioData: ScenarioDatum
  ageDistributionData: AgeDistributionDatum[]
  severityDistributionData: SeverityDistributionDatum[]
  isRunning: boolean
  isAutorunEnabled: boolean
  isLogScale: boolean
  shouldFormatNumbers: boolean
  areResultsMaximized: boolean
  triggerRun(): void
}

export function Main({
  scenarioData,
  ageDistributionData,
  severityDistributionData,
  triggerRun,
  isRunning,
  isAutorunEnabled,
  isLogScale,
  shouldFormatNumbers,
  areResultsMaximized,
}: MainProps) {
  const [result, setResult] = useState<AlgorithmResult | undefined>()
  const [printable, setPrintable] = useState(false)

  function handleSubmit(_0: ScenarioDatum, { setSubmitting }: FormikHelpers<ScenarioDatum>) {
    setSubmitting(true)
    triggerRun()
    setSubmitting(false)
  }

  function validateFormAndUpdateState(newParams: ScenarioDatum) {
    return schema
      .validate(newParams)
      .then((validParams) => {
        triggerRun()
        return validParams
      })
      .catch((error: FormikValidationErrors) => error.errors)
  }

  const openPrintPreview = () => setPrintable(true)
  const { colScenario, colResults } = getColumnSizes(areResultsMaximized)

  // if (printable) {
  //   return (
  //     <PrintPage
  //       result={result}
  //       onClose={() => {
  //         setPrintable(false)
  //       }}
  //     />
  //   )
  // }

  return (
    <Row noGutters className="row-main">
      <Col>
        <Formik
          enableReinitialize
          initialValues={scenarioData}
          onSubmit={handleSubmit}
          validate={validateFormAndUpdateState}
          validationSchema={schema}
          validateOnMount
        >
          {({ values, errors, touched, isValid, isSubmitting }) => {
            const canRun = isValid && areAgeGroupParametersValid(severityDistributionData, ageDistributionData)

            return (
              <Form noValidate className="form form-main">
                <Row className="row-form-main">
                  <ColCustom lg={4} {...colScenario} className="col-wrapper-scenario animate-flex-width">
                    <ScenarioCard errors={errors} touched={touched} />
                  </ColCustom>

                  <ColCustom lg={8} {...colResults} className="col-wrapper-results animate-flex-width">
                    <ResultsCard canRun={canRun} openPrintPreview={openPrintPreview} />
                  </ColCustom>
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
  scenarioData: selectScenarioData(state),
  ageDistributionData: selectAgeDistributionData(state),
  severityDistributionData: selectSeverityDistributionData(state),
  isRunning: selectIsRunning(state),
  isAutorunEnabled: selectIsAutorunEnabled(state),
  isLogScale: selectIsLogScale(state),
  shouldFormatNumbers: selectShouldFormatNumbers(state),
  areResultsMaximized: selectAreResultsMaximized(state),
})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(Main)

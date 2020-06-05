import React from 'react'

import { isEqual } from 'lodash'

import { connect } from 'react-redux'
import { Form, Formik, FormikErrors, FormikValues, FormikHelpers } from 'formik'
import { Col, Row } from 'reactstrap'
import { ActionCreator } from 'typescript-fsa'
import { useDebouncedCallback } from 'use-debounce'

import type { ScenarioDatum, SeverityDistributionDatum, AgeDistributionDatum } from '../../algorithms/types/Param.types'

import type { State } from '../../state/reducer'
import {
  selectScenarioData,
  selectAgeDistributionData,
  selectSeverityDistributionData,
} from '../../state/scenario/scenario.selectors'
import { selectAreResultsMaximized } from '../../state/settings/settings.selectors'
import { setCanRun, setScenarioData } from '../../state/scenario/scenario.actions'
import { algorithmRunTrigger } from '../../state/algorithm/algorithm.actions'

import { ColCustom } from '../Layout/ColCustom'
import { schema } from './validation/schema'
import { Disclaimer } from './Disclaimer'
import { ResultsCard } from './Results/ResultsCard'
import { ScenarioCard } from './Scenario/ScenarioCard'

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
  areResultsMaximized: boolean
  setCanRun: ActionCreator<boolean>
  setScenarioData: ActionCreator<ScenarioDatum>
  algorithmRunTrigger: ActionCreator<void>
}

const mapStateToProps = (state: State) => ({
  scenarioData: selectScenarioData(state),
  ageDistributionData: selectAgeDistributionData(state),
  severityDistributionData: selectSeverityDistributionData(state),
  areResultsMaximized: selectAreResultsMaximized(state),
})

const mapDispatchToProps = {
  algorithmRunTrigger,
  setCanRun,
  setScenarioData,
}

export const Main = connect(mapStateToProps, mapDispatchToProps)(MainDisconnected)

export function MainDisconnected({
  scenarioData,
  ageDistributionData,
  severityDistributionData,
  areResultsMaximized,
  algorithmRunTrigger,
  setCanRun,
  setScenarioData,
}: MainProps) {
  const [validateFormAndUpdateState] = useDebouncedCallback((newParams: ScenarioDatum) => {
    return schema
      .validate(newParams)
      .then((validParams) => {
        setCanRun(true)
        if (!isEqual(validParams, scenarioData)) {
          setScenarioData(newParams)
          algorithmRunTrigger()
        }
        return validParams
      })
      .catch((error: FormikValidationErrors) => {
        setCanRun(false)
        return error.errors
      })
  }, 50)

  function handleSubmit(_0: ScenarioDatum, { setSubmitting }: FormikHelpers<ScenarioDatum>) {
    algorithmRunTrigger()
    setSubmitting(false)
  }

  const { colScenario, colResults } = getColumnSizes(areResultsMaximized)

  return (
    <>
      <Disclaimer />
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
              // const canRun = isValid && areAgeGroupParametersValid(severityDistributionData, ageDistributionData)
              // setCanRun(canRun)

              return (
                <Form noValidate className="form form-main">
                  <Row className="row-form-main">
                    <ColCustom lg={4} {...colScenario} className="col-wrapper-scenario animate-flex-width">
                      <ScenarioCard errors={errors} touched={touched} />
                    </ColCustom>

                    <ColCustom lg={8} {...colResults} className="col-wrapper-results animate-flex-width">
                      <ResultsCard />
                    </ColCustom>
                  </Row>
                </Form>
              )
            }}
          </Formik>
        </Col>
      </Row>
    </>
  )
}

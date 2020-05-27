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
import { Disclaimer } from './Disclaimer'

// import { areAgeGroupParametersValid } from './Scenario/AgeGroupParameters'
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
  // const [printable, setPrintable] = useState(false)

  const [validateFormAndUpdateState] = useDebouncedCallback(async (scenarioDataNew: ScenarioDatum) => {
    try {
      const scenarioDataNewValidated = await schema.validate(scenarioDataNew)
      setCanRun(true)
      if (!isEqual(scenarioDataNewValidated, scenarioData)) {
        setScenarioData(scenarioDataNew)
        algorithmRunTrigger()
      }
    } catch (error) {
      setCanRun(false)
      return error.errors
    }
    return {}
  }, 500)

  function handleSubmit(_0: ScenarioDatum, { setSubmitting }: FormikHelpers<ScenarioDatum>) {
    algorithmRunTrigger()
    setSubmitting(false)
  }

  // const openPrintPreview = () => setPrintable(true)
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
    <>
      <Disclaimer />
      <Row noGutters className="row-main">
        <Col>
          <Formik
            enableReinitialize
            initialValues={scenarioData}
            onSubmit={handleSubmit}
            validate={validateFormAndUpdateState}
            validateOnMount
          >
            {({ errors, touched, isValid }) => {
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

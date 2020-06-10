import React, { useCallback, useMemo } from 'react'

import { isEqual, omit, pick, zipWith } from 'lodash'

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
  selectCanRun,
} from '../../state/scenario/scenario.selectors'
import { selectAreResultsMaximized } from '../../state/settings/settings.selectors'
import {
  setAgeDistributionData,
  setCanRun,
  setScenarioData,
  setSeverityDistributionData,
} from '../../state/scenario/scenario.actions'
import { algorithmRunTrigger } from '../../state/algorithm/algorithm.actions'

import { ColCustom } from '../Layout/ColCustom'

import type { AgeGroupRow } from './SeverityTable/SeverityTable'
import { schema } from './validation/schema'
import { Disclaimer } from './Disclaimer'
import { ResultsCard } from './Results/ResultsCard'
import { ScenarioCard } from './Scenario/ScenarioCard'

interface FormikValidationErrors extends Error {
  errors: FormikErrors<FormikValues>
}

function getColumnSizes(areResultsMaximized: boolean) {
  if (areResultsMaximized) {
    return { colScenario: { xl: 4 }, colResults: { xl: 8 } }
  }

  return { colScenario: { xl: 6 }, colResults: { xl: 6 } }
}

export interface ScenarioParams {
  scenarioData: ScenarioDatum
  ageDistributionData: AgeDistributionDatum[]
  severityDistributionData: SeverityDistributionDatum[]
}

function toFormData({ scenarioData, severityDistributionData, ageDistributionData }: ScenarioParams): FormData {
  const severity = zipWith(severityDistributionData, ageDistributionData, (severityRow, ageDistributionRow) => ({
    id: severityRow.ageGroup,
    ...severityRow,
    ...ageDistributionRow,
  }))
  return { ...scenarioData, severity }
}

function fromFormData(formData: FormData): ScenarioParams {
  const scenarioData = omit(formData, ['severity']) as ScenarioDatum
  const severityDistributionData = formData.severity.map((row) => omit(row, ['id', 'population']))
  const ageDistributionData = formData.severity.map((row) => pick(row, ['ageGroup', 'population']))
  return { scenarioData, severityDistributionData, ageDistributionData }
}

export interface FormData extends ScenarioDatum {
  severity: AgeGroupRow[]
}

export interface MainProps {
  canRun: boolean
  scenarioData: ScenarioDatum
  ageDistributionData: AgeDistributionDatum[]
  severityDistributionData: SeverityDistributionDatum[]
  areResultsMaximized: boolean
  setCanRun: ActionCreator<boolean>
  algorithmRunTrigger: ActionCreator<void>
  setScenarioData: ActionCreator<ScenarioDatum>
  setSeverityDistributionData: ActionCreator<SeverityDistributionDatum[]>
  setAgeDistributionData: ActionCreator<AgeDistributionDatum[]>
}

const mapStateToProps = (state: State) => ({
  canRun: selectCanRun(state),
  scenarioData: selectScenarioData(state),
  ageDistributionData: selectAgeDistributionData(state),
  severityDistributionData: selectSeverityDistributionData(state),
  areResultsMaximized: selectAreResultsMaximized(state),
})

const mapDispatchToProps = {
  algorithmRunTrigger,
  setCanRun,
  setScenarioData,
  setSeverityDistributionData,
  setAgeDistributionData,
}

export const Main = connect(mapStateToProps, mapDispatchToProps)(MainDisconnected)
export default Main

export function MainDisconnected({
  canRun,
  scenarioData,
  ageDistributionData,
  severityDistributionData,
  areResultsMaximized,
  algorithmRunTrigger,
  setCanRun,
  setScenarioData,
  setSeverityDistributionData,
  setAgeDistributionData,
}: MainProps) {
  const [validateFormAndUpdateState] = useDebouncedCallback((newFormDataDangerous: FormData) => {
    return schema
      .validate(newFormDataDangerous)
      .then((newFormDataValid) => {
        if (!canRun) {
          setCanRun(true)
        }

        const {
          scenarioData: newScenarioData,
          ageDistributionData: newAgeDistributionData,
          severityDistributionData: newSeverityDistributionData,
        } = fromFormData(newFormDataValid)

        if (!isEqual(newScenarioData, scenarioData)) {
          setScenarioData(newScenarioData)
        }

        if (!isEqual(newSeverityDistributionData, severityDistributionData)) {
          setSeverityDistributionData(newSeverityDistributionData)
        }

        if (!isEqual(newAgeDistributionData, ageDistributionData)) {
          setAgeDistributionData(newAgeDistributionData)
        }

        return newFormDataValid
      })
      .catch((error: FormikValidationErrors) => {
        if (canRun) {
          setCanRun(false)
        }
        return error.errors
      })
  }, 500)

  const formData = useMemo(() => toFormData({ scenarioData, ageDistributionData, severityDistributionData }), [
    ageDistributionData,
    scenarioData,
    severityDistributionData,
  ])

  const handleSubmit = useCallback(
    (_0: FormData, { setSubmitting }: FormikHelpers<FormData>) => {
      setSubmitting(true)
      algorithmRunTrigger()
      setSubmitting(false)
    },
    [algorithmRunTrigger],
  )

  const { colScenario, colResults } = getColumnSizes(areResultsMaximized)

  return (
    <>
      <Disclaimer />
      <Row noGutters className="row-main">
        <Col>
          <Formik
            enableReinitialize
            initialValues={formData}
            onSubmit={handleSubmit}
            validate={validateFormAndUpdateState}
            validationSchema={schema}
            validateOnMount
          >
            {({ values, errors, touched, isValid, isSubmitting }) => {
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

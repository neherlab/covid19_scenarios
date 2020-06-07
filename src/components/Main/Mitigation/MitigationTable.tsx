import React from 'react'

import { FieldArray, FormikErrors, FormikTouched, FormikValues } from 'formik'
import { useTranslation } from 'react-i18next'
import { FaPlus } from 'react-icons/fa'
import { connect } from 'react-redux'
import { Button, Col, Row } from 'reactstrap'

import type { MitigationInterval } from '../../../algorithms/types/Param.types'
import { suggestNextMitigationInterval } from '../../../algorithms/utils/createMitigationInterval'

import type { State } from '../../../state/reducer'
import { selectMitigationIntervals } from '../../../state/scenario/scenario.selectors'
import { MitigationIntervalComponent } from './MitigationIntervalComponent'

export interface MitigationTableProps {
  mitigationIntervals: MitigationInterval[]
  errors?: FormikErrors<FormikValues>
  touched?: FormikTouched<FormikValues>
}

const mapStateToProps = (state: State) => ({
  mitigationIntervals: selectMitigationIntervals(state),
})

const mapDispatchToProps = {}

export const MitigationTable = connect(mapStateToProps, mapDispatchToProps)(MitigationTableDisconnected)

export function MitigationTableDisconnected({ mitigationIntervals, errors, touched }: MitigationTableProps) {
  const { t } = useTranslation()

  return (
    <FieldArray
      name="mitigation.mitigationIntervals"
      render={(arrayHelpers) => (
        <>
          <Row>
            <Col>
              <div className="mitigation-table-wrapper">
                {mitigationIntervals.map((interval: MitigationInterval, index: number) => {
                  return (
                    <MitigationIntervalComponent
                      key={interval.id}
                      interval={interval}
                      index={index}
                      arrayHelpers={arrayHelpers}
                      errors={errors}
                      touched={touched}
                    />
                  )
                })}
              </div>
            </Col>
          </Row>

          <Row>
            <Col>
              <div className="table-controls text-right align-middle">
                <Button
                  type="button"
                  onClick={() => {
                    const interval = suggestNextMitigationInterval(mitigationIntervals)
                    arrayHelpers.push(interval)
                  }}
                >
                  <FaPlus size={20} />
                  <span className="ml-2 d-inline align-middle">{t(`Add`)}</span>
                </Button>
              </div>
            </Col>
          </Row>
        </>
      )}
    />
  )
}

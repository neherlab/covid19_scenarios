import React from 'react'

import { FastField, FieldArray } from 'formik'
import { useTranslation } from 'react-i18next'
import { Button, FormGroup, Row, Col } from 'reactstrap'

import { FaTrash } from 'react-icons/fa'

import { MitigationInterval, MitigationIntervals } from '../../../algorithms/types/Param.types'

import { suggestNextMitigationInterval } from '../../../algorithms/utils/createMitigationInterval'

import { MitigationDatePicker } from './MitigationDatePicker'

import './MitigationTable.scss'

export interface MitigationTableProps {
  mitigationIntervals: MitigationIntervals
}

export function MitigationTable({ mitigationIntervals }: MitigationTableProps) {
  const { t } = useTranslation()

  return (
    <FieldArray
      name="containment.mitigationIntervals"
      render={(arrayHelpers) => (
        <Row noGutters>
          <Col>
            <Row>
              <Col>
                <div className="form w-100">
                  {mitigationIntervals.map((interval: MitigationInterval, index: number) => {
                    if (!interval) {
                      return null
                    }

                    return (
                      <FormGroup key={interval.id} className="interval-form-group w-100">
                        <Row className="" noGutters>
                          <Col size="12" xs="12" sm="12" md="12" lg="12" xl="12">
                            <FastField
                              className="form-control"
                              id={`containment.mitigationIntervals[${index}].name`}
                              name={`containment.mitigationIntervals[${index}].name`}
                              type="text"
                            />
                          </Col>
                          <Col xs="auto" sm="auto" md="auto" lg="5" xl="auto" className="align-self-center">
                            <MitigationDatePicker
                              className="form-control"
                              identifier={`containment.mitigationIntervals[${index}].timeRange`}
                              value={interval.timeRange}
                              allowPast
                            />
                          </Col>
                          <Col xs="4" sm="5" md="6" lg="4" xl="6">
                            <FastField
                              className="form-control h-100"
                              id={`containment.mitigationIntervals[${index}].mitigationValue`}
                              name={`containment.mitigationIntervals[${index}].mitigationValue`}
                              type="number"
                              step={0.1}
                              min={0}
                              max={1}
                            />
                          </Col>
                          <Col xs="auto" sm="auto" md="auto" lg="auto" xl="auto" className="ml-auto align-self-center">
                            <Button type="button" onClick={() => arrayHelpers.remove(index)}>
                              <FaTrash />
                            </Button>
                          </Col>
                        </Row>
                      </FormGroup>
                    )
                  })}
                </div>
              </Col>
            </Row>
            <Row>
              <Col>
                <Button
                  type="button"
                  onClick={() => {
                    const interval = suggestNextMitigationInterval(mitigationIntervals)
                    arrayHelpers.push(interval)
                  }}
                >
                  {t('Add')}
                </Button>
              </Col>
            </Row>
          </Col>
        </Row>
      )}
    />
  )
}

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
                <div className="form-inline w-100">
                  {mitigationIntervals.map((interval: MitigationInterval, index: number) => {
                    if (!interval) {
                      return null
                    }

                    return (
                      <FormGroup key={interval.id} className="interval-form-group w-100">
                        <FastField
                          className="form-control"
                          id={`containment.mitigationIntervals[${index}].name`}
                          name={`containment.mitigationIntervals[${index}].name`}
                          type="text"
                        />

                        <MitigationDatePicker
                          identifier={`containment.mitigationIntervals[${index}].timeRange`}
                          value={interval.timeRange}
                          allowPast
                        />

                        <FastField
                          className="form-control"
                          id={`containment.mitigationIntervals[${index}].mitigationValue`}
                          name={`containment.mitigationIntervals[${index}].mitigationValue`}
                          type="number"
                          step={0.1}
                          min={0}
                          max={1}
                        />

                        <Button type="button" onClick={() => arrayHelpers.remove(index)}>
                          <FaTrash />
                        </Button>
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

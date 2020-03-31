import React from 'react'

import { Field, FieldArray } from 'formik'
import { useTranslation } from 'react-i18next'
import { Button, FormGroup } from 'reactstrap'

import { FaTrash } from 'react-icons/fa'

import { MitigationInterval, MitigationIntervals } from '../../../algorithms/types/Param.types'

import { suggestNextMitigationInterval } from '../../../algorithms/utils/createMitigationInterval'

import { MitigationDatePicker } from './MitigationDatePicker'

export interface MitigationTableProps {
  mitigationIntervals: MitigationIntervals
}

export function MitigationTable({ mitigationIntervals }: MitigationTableProps) {
  const { t } = useTranslation()

  return (
    <FieldArray
      name="containment.mitigationIntervals"
      render={(arrayHelpers) => (
        <div>
          <div className="form-inline">
            {mitigationIntervals.map((interval: MitigationInterval, index: number) => (
              <FormGroup key={interval.id}>
                <Field
                  className="form-control"
                  id={`containment.mitigationIntervals[${index}].name`}
                  name={`containment.mitigationIntervals[${index}].name`}
                  type="text"
                />

                <MitigationDatePicker identifier={`containment.mitigationIntervals[${index}].timeRange`} allowPast />

                <Field
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
            ))}
          </div>
          <Button
            type="button"
            onClick={() => {
              const interval = suggestNextMitigationInterval(mitigationIntervals)
              arrayHelpers.push(interval)
            }}
          >
            {t('Add')}
          </Button>
        </div>
      )}
    />
  )
}

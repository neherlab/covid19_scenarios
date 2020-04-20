import React from 'react'
import { useTranslation } from 'react-i18next'
import { Field, FieldProps } from 'formik'
import { Col, FormGroup, Row } from 'reactstrap'

import FormLabel from './FormLabel'
import RangeInput from './RangeInput'

export interface FormRangeInputProps {
  identifier: string
  label?: string
  help?: string | React.ReactNode
}

export function FormRangeInput({ identifier, label, help }: FormRangeInputProps) {
  const { t } = useTranslation()

  return (
    <Field name={identifier}>
      {({ field: { value }, form: { setFieldValue }, meta: { error } }: FieldProps) => {
        const rangeInput = () => (
          <>
            <RangeInput
              value={value}
              onChange={(value) => setFieldValue(identifier, value)}
              hasError={!!error}
              placeholder={t('Enter a number or range of numbers...')}
              title={t('Enter a number or range of numbers. e.g. 29 or 29-31')}
              separator={t('to')}
              hint={t('to ...')}
            />
            {error && <div className="text-danger">{error[0]}</div>}
          </>
        )

        return label ? (
          <FormGroup className="my-0">
            <Row noGutters>
              <Col xl={7}>
                <FormLabel identifier={identifier} label={label} help={help} />
              </Col>
              <Col xl={5}>{rangeInput()}</Col>
            </Row>
          </FormGroup>
        ) : (
          rangeInput()
        )
      }}
    </Field>
  )
}

import React, { useState } from 'react'

import { Button } from 'reactstrap'
import { useTranslation, getI18n } from 'react-i18next'
import { FormikErrors, FormikTouched, FormikValues } from 'formik'
import { FaTrash } from 'react-icons/fa'

import { CaseCountsDatum } from '../../../algorithms/types/Param.types'

import { caseCountsNames } from '../state/getCaseCounts'
import { NONE_COUNTRY_NAME } from '../state/state'

import { FormCustom } from '../../Form/FormCustom'
import { FormDropdown } from '../../Form/FormDropdown'
import CaseCountsUploader, { ImportedCaseCounts } from '../CaseCounts/CaseCountsUploader'

export interface ConfirmedCasesDataPickerProps {
  setCaseCounts(caseCounts: CaseCountsDatum[]): void
  errors?: FormikErrors<FormikValues>
  touched?: FormikTouched<FormikValues>
}

const caseCountOptions = caseCountsNames.map((name) => ({ value: name, label: name }))
caseCountOptions.push({ value: NONE_COUNTRY_NAME, label: getI18n().t(NONE_COUNTRY_NAME) })

export function ConfirmedCasesDataPicker({ setCaseCounts, errors, touched }: ConfirmedCasesDataPickerProps) {
  const { t } = useTranslation()
  const [customFilename, setCustomFilename] = useState<string | undefined>()

  function onDataImported(imported: ImportedCaseCounts) {
    setCustomFilename(imported.fileName)
    setCaseCounts(imported.data)
  }

  function reset() {
    setCustomFilename(undefined)
  }

  if (customFilename) {
    return (
      <FormCustom
        identifier="population.caseCountsName"
        label={t('Confirmed cases')}
        help={t('Select region for which to plot confirmed case and death counts.')}
      >
        <span className="truncate-ellipsis">{customFilename}</span>
        <Button
          color="secondary"
          outline
          size="sm"
          onClick={reset}
          title={'Delete the imported case count data'}
          className="ml-2"
        >
          <FaTrash />
        </Button>
      </FormCustom>
    )
  }

  return (
    <>
      <FormDropdown<string>
        identifier="population.caseCountsName"
        label={t('Confirmed cases')}
        help={t('Select region for which to plot confirmed case and death counts.')}
        options={caseCountOptions}
        errors={errors}
        touched={touched}
      />
      <CaseCountsUploader onDataImported={onDataImported} />
    </>
  )
}

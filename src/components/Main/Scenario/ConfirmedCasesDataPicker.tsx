import React, { useState } from 'react'

import { connect } from 'react-redux'
import { Button } from 'reactstrap'
import { useTranslation, getI18n } from 'react-i18next'
import type { FormikErrors, FormikTouched, FormikValues } from 'formik'
import { FaTrash } from 'react-icons/fa'
import { ActionCreator } from 'typescript-fsa'

import type { State } from '../../../state/reducer'
import { NONE_COUNTRY_NAME } from '../../../state/scenario/scenario.state'
import { caseCountsNames } from '../../../io/defaults/getCaseCountsData'
import { SetCaseCountsData, setCaseCountsData } from '../../../state/caseCounts/caseCounts.actions'

import { FormCustom } from '../../Form/FormCustom'
import { FormDropdown } from '../../Form/FormDropdown'
import CaseCountsUploader, { ImportedCaseCounts } from '../CaseCounts/CaseCountsUploader'

const caseCountOptions = caseCountsNames.map((name) => ({ value: name, label: name }))
caseCountOptions.push({ value: NONE_COUNTRY_NAME, label: getI18n().t(NONE_COUNTRY_NAME) })

export interface CaseCountsDataPickerProps {
  setCaseCountsData: ActionCreator<SetCaseCountsData>
  errors?: FormikErrors<FormikValues>
  touched?: FormikTouched<FormikValues>
}

const mapStateToProps = (state: State) => ({})

const mapDispatchToProps = {
  setCaseCountsData,
}

export const CaseCountsDataPicker = connect(mapStateToProps, mapDispatchToProps)(CaseCountsDataPickerDisconnected)

export function CaseCountsDataPickerDisconnected({ setCaseCountsData, errors, touched }: CaseCountsDataPickerProps) {
  const { t } = useTranslation()
  const [customFilename, setCustomFilename] = useState<string | undefined>()

  function onDataImported(imported: ImportedCaseCounts) {
    setCustomFilename(imported.fileName)
    setCaseCountsData({ data: { data: imported.data, name: imported.fileName } })
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

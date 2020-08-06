import React from 'react'

import { connect } from 'react-redux'
import { Button } from 'reactstrap'
import { useTranslation } from 'react-i18next'
import type { FormikErrors, FormikTouched, FormikValues } from 'formik'
import { FaTrash } from 'react-icons/fa'
import type { ActionCreator } from 'typescript-fsa'

import type { CaseCountsData } from '../../../algorithms/types/Param.types'

import { NONE_COUNTRY_NAME } from '../../../constants'

import type { State } from '../../../state/reducer'
import { setCaseCountsDataCustom, resetCaseCounts } from '../../../state/scenario/scenario.actions'
import { selectCaseCountsNameCustom } from '../../../state/scenario/scenario.selectors'
import { caseCountsNames } from '../../../io/defaults/getCaseCountsData'

import { FormCustom } from '../../Form/FormCustom'
import { FormDropdown } from '../../Form/FormDropdown'
import CaseCountsUploader, { ImportedCaseCounts } from './CaseCountsUploader'

const caseCountOptions = caseCountsNames.map((name) => ({ value: name, label: name }))
caseCountOptions.push({ value: NONE_COUNTRY_NAME, label: NONE_COUNTRY_NAME })

export interface CaseCountsDataPickerProps {
  caseCountsNameCustom?: string
  setCaseCountsDataCustom: ActionCreator<CaseCountsData>
  resetCaseCounts: ActionCreator<void>
  errors?: FormikErrors<FormikValues>
  touched?: FormikTouched<FormikValues>
}

const mapStateToProps = (state: State) => ({
  caseCountsNameCustom: selectCaseCountsNameCustom(state),
})

const mapDispatchToProps = {
  setCaseCountsDataCustom,
  resetCaseCounts,
}

export const CaseCountsDataPicker = connect(mapStateToProps, mapDispatchToProps)(CaseCountsDataPickerDisconnected)

export function CaseCountsDataPickerDisconnected({
  caseCountsNameCustom,
  setCaseCountsDataCustom,
  resetCaseCounts,
  errors,
  touched,
}: CaseCountsDataPickerProps) {
  const { t } = useTranslation()

  function onDataImported(imported: ImportedCaseCounts) {
    setCaseCountsDataCustom({ data: imported.data, name: imported.fileName })
  }

  function reset() {
    resetCaseCounts()
  }

  if (caseCountsNameCustom) {
    return (
      <FormCustom
        identifier="population.caseCountsName"
        label={t('Confirmed cases')}
        help={t('Select region for which to plot confirmed case and death counts.')}
      >
        <span className="truncate-ellipsis">{caseCountsNameCustom}</span>
        <Button
          color="secondary"
          outline
          size="sm"
          onClick={reset}
          title={t('Delete the imported case counts data')}
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

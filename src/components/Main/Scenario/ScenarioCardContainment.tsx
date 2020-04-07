import React from 'react'

import { FormikErrors, FormikTouched, FormikValues } from 'formik'

import { useTranslation } from 'react-i18next'

import { CardWithoutDropdown } from '../../Form/CardWithoutDropdown'
import { MitigationTable } from '../Mitigation/MitigationTable'
import { AllParams } from '../../../algorithms/types/Param.types'

import PrintPageSeparatorHack from '../PrintPageSeparatorHack'

export interface ScenarioCardContainmentProps {
  values: AllParams
  errors?: FormikErrors<FormikValues>
  touched?: FormikTouched<FormikValues>
}

function ScenarioCardContainment({ values, errors, touched }: ScenarioCardContainmentProps) {
  const { t } = useTranslation()

  const { mitigationIntervals } = values.containment

  return (
    <>
      <PrintPageSeparatorHack />
      <CardWithoutDropdown
        identifier="containmentScenario"
        label={<h3 className="p-0 d-inline text-truncate">{t('Mitigation')}</h3>}
        help={t('Reduction of transmission through mitigation measures over time. Add or remove interventions.')}
      >
        <div className="w-auto">
          <MitigationTable mitigationIntervals={mitigationIntervals} />
        </div>
      </CardWithoutDropdown>
    </>
  )
}

export { ScenarioCardContainment }

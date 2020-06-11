import React from 'react'

import { FormikErrors, FormikTouched, FormikValues } from 'formik'

import { useTranslation } from 'react-i18next'

import { CollapsibleCard } from '../../Form/CollapsibleCard'
import { MitigationTable } from '../Mitigation/MitigationTable'

export interface ScenarioCardContainmentProps {
  errors?: FormikErrors<FormikValues>
  touched?: FormikTouched<FormikValues>
}

function ScenarioCardContainment({ errors, touched }: ScenarioCardContainmentProps) {
  const { t } = useTranslation()

  return (
    <CollapsibleCard
      className="card-mitigation"
      defaultCollapsed={false}
      identifier="containmentScenario"
      title={<h3 className="p-0 d-inline text-truncate">{t('Mitigation')}</h3>}
      help={t(
        'Reduction of transmission through mitigation measures over time. Add or remove interventions. The intervention efficacy is specified as a range of plausible multiplicative reductions of the base growth rate',
      )}
    >
      <div className="w-auto">
        <MitigationTable />
      </div>
    </CollapsibleCard>
  )
}

export { ScenarioCardContainment }

import React from 'react'

import { FormikErrors, FormikTouched, FormikValues } from 'formik'

import { useTranslation } from 'react-i18next'

import { CardWithoutDropdown } from '../../Form/CardWithoutDropdown'
import { MitigationTable } from '../Mitigation/MitigationTable'

import { State } from '../state/state'

export interface ScenarioCardContainmentProps {
  scenarioState: State
  errors?: FormikErrors<FormikValues>
  touched?: FormikTouched<FormikValues>
}

function ScenarioCardContainment({ scenarioState, errors, touched }: ScenarioCardContainmentProps) {
  const { t } = useTranslation()

  const { mitigationIntervals } = scenarioState.data.containment

  return (
    <CardWithoutDropdown
      identifier="containmentScenario"
      label={<h3 className="p-0 d-inline text-truncate">{t('Mitigation')}</h3>}
      help={t(
        'Reduction of transmission through mitigation measures over time. Add or remove interventions.',
      )}
    >
      <div className="w-auto">
        <MitigationTable mitigationIntervals={mitigationIntervals} />
      </div>
    </CardWithoutDropdown>
  )
}

export { ScenarioCardContainment }

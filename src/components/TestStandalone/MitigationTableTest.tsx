import React from 'react'
import { useTranslation } from 'react-i18next'
import { Formik } from 'formik'

import { CardWithoutDropdown } from '../Form/CardWithoutDropdown'
import { MitigationTable } from '../Main/Mitigation/MitigationTable'
import { MitigationIntervals } from '../../algorithms/types/Param.types'

function MitigationTableTest() {
  const { t } = useTranslation()

  const mitigationIntervals: MitigationIntervals = [
    {
      color: '#bf5b17',
      id: '06ad1640-ce01-41c0-8dc2-78fbbfbd8dd6',
      mitigationValue: 0.2,
      name: 'Intervention #1',
      timeRange: {
        tMax: new Date('2020-09-01'),
        tMin: new Date('2020-03-12'),
      },
    },
    {
      color: '#666666',
      id: 'a353e47f-ed52-4517-9cb5-063878edbbca',
      mitigationValue: 0.6,
      name: 'Intervention #2',
      timeRange: {
        tMax: new Date('2020-09-01'),
        tMin: new Date('2020-03-29'),
      },
    },
  ]

  return (
    <CardWithoutDropdown
      identifier="containmentScenario"
      label={<h3 className="p-0 d-inline text-truncate">{t('Mitigation')}</h3>}
      help={t('Reduction of transmission through mitigation measures over time. Add or remove interventions.')}
    >
      <div className="w-auto">
        <Formik enableReinitialize initialValues={{ containment: { mitigationIntervals } }} onSubmit={() => null}>
          <MitigationTable mitigationIntervals={mitigationIntervals} />
        </Formik>
      </div>
    </CardWithoutDropdown>
  )
}

export default MitigationTableTest

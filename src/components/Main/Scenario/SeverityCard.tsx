import React from 'react'

import { CollapsibleCard } from '../../Form/CollapsibleCard'

import { SeverityTable, SeverityTableRow } from './SeverityTable'

import { useTranslation } from 'react-i18next'

export interface SeverityCardProps {
  severity: SeverityTableRow[]
  setSeverity(severity: SeverityTableRow[]): void
}

function SeverityCard({ severity, setSeverity }: SeverityCardProps) {
  const { t } = useTranslation()
  return (
    <CollapsibleCard
      identifier="severity-card"
      title={
        <>
          <h5 className="my-1">{t('Severity-assumptions')}</h5>
          <p className="my-0">{t('Based-on-data-from')} {t('China')}</p>
        </>
      }
      help={t('Assumptions-on-severity-which-are-informed-by-epidemiological-and-clinical-observations-in-china')}
      defaultCollapsed
    >
      <p>
        {t('this-table-summarizes-assumptions')}
      </p>

      <SeverityTable severity={severity} setSeverity={setSeverity} />
    </CollapsibleCard>
  )
}

export { SeverityCard }

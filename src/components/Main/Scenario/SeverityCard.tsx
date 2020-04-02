import React from 'react'

import { useTranslation } from 'react-i18next'

import { CollapsibleCard } from '../../Form/CollapsibleCard'
import { help } from '../../Form/FormHelpButton'

import { SeverityTable, SeverityTableRow } from './SeverityTable'

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
          <h3 className="my-1 text-wrap">{t('Severity assumptions and age-specific isolation')}</h3>
          <p className="my-0">
            {t('based on data from')} {t('China')}
          </p>
        </>
      }
      help={help(
        `${t('based on data from')} ${t('China')}`,
        t('Assumptions on severity which are informed by epidemiological and clinical observations in China'),
      )}
      defaultCollapsed
    >
      <p>
        {t(
          'This table summarizes the assumptions on severity which are informed by epidemiological and clinical observations in China. The first column reflects our assumption on what fraction of infections are reflected in the statistics from China, the following columns contain the assumption on what fraction of the previous category deteriorates to the next. These fields are editable and can be adjusted to different assumptions. The last column is the implied infection fatality for different age groups.',
        )}
      </p>

      <SeverityTable severity={severity} setSeverity={setSeverity} />
    </CollapsibleCard>
  )
}

export { SeverityCard }

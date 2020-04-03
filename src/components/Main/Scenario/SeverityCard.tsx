import React from 'react'
import { useTranslation } from 'react-i18next'
import { AnyAction } from 'typescript-fsa'

import { CollapsibleCard } from '../../Form/CollapsibleCard'
import { SeverityTable, SeverityTableRow } from './SeverityTable'
import { State } from '../state/state'

export interface SeverityCardProps {
  severity: SeverityTableRow[]
  setSeverity(severity: SeverityTableRow[]): void
  scenarioState: State
  scenarioDispatch(action: AnyAction): void
}

function SeverityCard({ severity, setSeverity, scenarioState, scenarioDispatch }: SeverityCardProps) {
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
      help={t('Assumptions on severity which are informed by epidemiological and clinical observations in China')}
      defaultCollapsed
    >
      <p>
        {t(
          'This table summarizes the assumptions on severity which are informed by epidemiological and clinical observations in China. The first column reflects our assumption on what fraction of infections are reflected in the statistics from China, the following columns contain the assumption on what fraction of the previous category deteriorates to the next. These fields are editable and can be adjusted to different assumptions. The last column is the implied infection fatality for different age groups.',
        )}
      </p>

      <SeverityTable
        severity={severity}
        setSeverity={setSeverity}
        scenarioState={scenarioState}
        scenarioDispatch={scenarioDispatch}
      />
    </CollapsibleCard>
  )
}

export { SeverityCard }

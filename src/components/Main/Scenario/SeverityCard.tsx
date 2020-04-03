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
          <h3 className="my-1 text-wrap">{t('Age group specific parameters')}</h3>
          <p className="my-0">
            {t('Demographics')} -- {t('Disease severity')} -- {t('Group specific isolation')}
          </p>
        </>
      }
      help={t('Assumptions on severity which are informed by epidemiological and clinical observations in China')}
      defaultCollapsed
    >
      <SeverityTable
        severity={severity}
        setSeverity={setSeverity}
        scenarioState={scenarioState}
        scenarioDispatch={scenarioDispatch}
      />
      <p>
        {t('Summary of demographics and age dependent parameters.')} &nbsp;
        {t('The second column shows how many people fall into each age group.')} &nbsp;
        {t(
          'The following columns summarize COVID19 severity informed by epidemiological and clinical observations from China. ',
        )}
        &nbsp;
        {t(
          'The column "Confirmed" reflects our assumption on what fraction of infections are reflected in the statistics, the following columns contain the assumption on what fraction of the previous category deteriorates to the next. ',
        )}
        &nbsp;
        {t('Most fields are editable and can be adjusted to different assumptions.')} &nbsp;
        {t('The last column can be used to specify age-group specific isolation measures.')}
      </p>

    </CollapsibleCard>
  )
}

export { SeverityCard }

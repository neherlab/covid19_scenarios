import React from 'react'
import { useTranslation } from 'react-i18next'
import { AnyAction } from 'typescript-fsa'

import type { AgeDistributionDatum, SeverityDistributionDatum } from '../../../algorithms/types/Param.types'

import { CollapsibleCard } from '../../Form/CollapsibleCard'
import AgeGroupParameters from './AgeGroupParameters'
import { State } from '../state/state'
import { setAgeDistributionData } from '../state/actions'

export interface SeverityCardProps {
  severity: SeverityDistributionDatum[]
  setSeverity(severity: SeverityDistributionDatum[]): void
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
          <h3 className="my-1">{t('Age-group-specific parameters')}</h3>
          <p className="my-0">{t('Demographics, disease severity, group-specific isolation')}</p>
        </>
      }
      help={t('Assumptions on severity which are informed by epidemiological and clinical observations in China')}
      defaultCollapsed
    >
      <AgeGroupParameters
        severity={severity}
        setSeverity={setSeverity}
        ageDistribution={scenarioState.ageDistribution}
        setAgeDistribution={(ageDistribution: AgeDistributionDatum[]) =>
          scenarioDispatch(setAgeDistributionData({ data: ageDistribution }))
        }
      />
      <p>
        {t('Summary of demographics and age-dependent parameters.')} &nbsp;
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
        {t('The last column can be used to specify age-group-specific isolation measures.')}
      </p>
    </CollapsibleCard>
  )
}

export { SeverityCard }

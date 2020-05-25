import React from 'react'

import { connect } from 'react-redux'
import { useTranslation } from 'react-i18next'
import type { ActionCreator } from 'typescript-fsa'

import type { AgeDistributionDatum, SeverityDistributionDatum } from '../../../algorithms/types/Param.types'
import { setAgeDistributionData, setSeverityDistributionData } from '../../../state/scenario/scenario.actions'

import { State } from '../../../state/reducer'
import { selectAgeDistributionData, selectSeverityDistributionData } from '../../../state/scenario/scenario.selectors'

import { CollapsibleCard } from '../../Form/CollapsibleCard'
import AgeGroupParameters from './AgeGroupParameters'

export interface SeverityCardProps {
  ageDistributionData: AgeDistributionDatum[]
  severityDistributionData: SeverityDistributionDatum[]
  setAgeDistributionData: ActionCreator<AgeDistributionDatum[]>
  setSeverityDistributionData: ActionCreator<SeverityDistributionDatum[]>
}

const mapStateToProps = (state: State) => ({
  ageDistributionData: selectAgeDistributionData(state),
  severityDistributionData: selectSeverityDistributionData(state),
})

const mapDispatchToProps = {
  setAgeDistributionData,
  setSeverityDistributionData,
}

export const SeverityCard = connect(mapStateToProps, mapDispatchToProps)(SeverityCardDisconnected)

function SeverityCardDisconnected({
  ageDistributionData,
  severityDistributionData,
  setAgeDistributionData,
  setSeverityDistributionData,
}: SeverityCardProps) {
  const { t } = useTranslation()
  return (
    <CollapsibleCard
      className="card-severity"
      identifier="severity-card"
      title={
        <>
          <h3 className="my-1">{t('Age-group-specific parameters')}</h3>
          <p className="my-0">{t('Demographics, disease severity, group-specific isolation')}</p>
        </>
      }
      help={t('Assumptions on severity which are informed by epidemiological and clinical observations in China')}
      defaultCollapsed={false}
    >
      <AgeGroupParameters
        severity={severityDistributionData}
        setSeverity={setSeverityDistributionData}
        ageDistribution={ageDistributionData}
        setAgeDistribution={setAgeDistributionData}
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

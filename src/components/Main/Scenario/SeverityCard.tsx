import React from 'react'

import { connect } from 'react-redux'
import { useTranslation } from 'react-i18next'
import type { ActionCreator } from 'src/state/util/fsaActions'

import type { AgeDistributionDatum, SeverityDistributionDatum } from '../../../algorithms/types/Param.types'
import { setAgeDistributionData, setSeverityDistributionData } from '../../../state/scenario/scenario.actions'

import { State } from '../../../state/reducer'
import { selectAgeDistributionData, selectSeverityDistributionData } from '../../../state/scenario/scenario.selectors'

import { CollapsibleCard } from '../../Form/CollapsibleCard'
import { SeverityTable } from '../SeverityTable/SeverityTable'
import SeverityCardInfo from './SeverityCardInfo.mdx'

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
      help={t(
        'Assumptions on severity which are informed by epidemiological and clinical observations in China, Spain, Switzerland, and Italy',
      )}
      defaultCollapsed={false}
    >
      <SeverityTable />
      <SeverityCardInfo />
    </CollapsibleCard>
  )
}

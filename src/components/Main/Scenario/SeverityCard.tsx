import React from 'react'

import { connect } from 'react-redux'
import { ActionCreator } from 'typescript-fsa'

import { SeverityTableData, SeverityData } from '../../../algorithms/Param.types'

import { State } from '../../../state/reducer'
import { selectDataSeverity } from '../../../state/scenario/scenario.selectors'
import { setSeverityData, SetSeverityDataParams } from '../../../state/scenario/scenario.actions'

import { CollapsibleCard } from '../../Form/CollapsibleCard'

import { SeverityTable } from './SeverityTable'

export interface SeverityCardProps {
  severityData: SeverityData
  setSeverityData: ActionCreator<SetSeverityDataParams>
}

function SeverityCard({ severityData, setSeverityData }: SeverityCardProps) {
  function handleSetSeverity(severityTable: SeverityTableData) {
    setSeverityData({ data: { severityTable } })
  }

  return (
    <CollapsibleCard
      identifier="severity-card"
      title={
        <>
          <h5 className="my-1">Severity assumptions</h5>
          <p className="my-0">based on data from China</p>
        </>
      }
      help="Assumptions on severity which are informed by epidemiological and clinical observations in China"
      defaultCollapsed
    >
      <p>
        This table summarizes the assumptions on severity which are informed by epidemiological and clinical
        observations in China. The first column reflects our assumption on what fraction of infections are reflected in
        the statistics from China, the following columns contain the assumption on what fraction of the previous
        category deteriorates to the next. These fields are editable and can be adjusted to different assumptions. The
        last column is the implied infection fatality for different age groups.
      </p>

      <SeverityTable severity={severityData.severityTable} setSeverity={handleSetSeverity} />
    </CollapsibleCard>
  )
}

const mapStateToProps = (state: State) => ({
  severityData: selectDataSeverity(state),
})

const mapDispatchToProps = {
  setSeverityData,
}

export default connect(mapStateToProps, mapDispatchToProps)(SeverityCard)

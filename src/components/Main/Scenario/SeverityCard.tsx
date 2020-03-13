import React from 'react'

import { CollapsibleCard } from '../../Form/CollapsibleCard'

import { SeverityTable, SeverityTableRow } from './SeverityTable'

export interface SeverityCardProps {
  severity: SeverityTableRow[]
  setSeverity(severity: SeverityTableRow[]): void
}

function SeverityCard({ severity, setSeverity }: SeverityCardProps) {
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

      <SeverityTable severity={severity} setSeverity={setSeverity} />
    </CollapsibleCard>
  )
}

export { SeverityCard }

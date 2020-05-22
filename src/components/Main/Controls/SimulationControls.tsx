import React from 'react'

import { connect } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { AiFillFilePdf } from 'react-icons/ai'
import { MdTab } from 'react-icons/md'
import { Button } from 'reactstrap'
import { CaseCountsDatum, ScenarioDatum } from '../../../algorithms/types/Param.types'

import type { SeverityDistributionDatum } from '../../../algorithms/types/Param.types'
import type { AlgorithmResult } from '../../../algorithms/types/Result.types'
import { selectIsRunning, selectResult } from '../../../state/algorithm/algorithm.selectors'
import { selectCaseCountsData } from '../../../state/caseCounts/caseCounts.selectors'
import { State } from '../../../state/reducer'
import { selectScenarioData } from '../../../state/scenario/scenario.selectors'
import {
  selectIsAutorunEnabled,
  selectIsLogScale,
  selectShouldFormatNumbers,
} from '../../../state/settings/settings.selectors'

import LinkButton from '../../Buttons/LinkButton'
import { ModalButtonExport } from './ModalButtonExport'
import { ModalButtonSharing } from './ModalButtonSharing'
import { RunButtonContent } from './RunButtonContent'
import { SettingsControls } from './SettingsControls'

import './SimulationControls.scss'

const ICON_SIZE = 25

export interface SimulationControlsProps {
  scenarioState: State
  severity: SeverityDistributionDatum[]
  severityName: string
  result?: AlgorithmResult
  isRunning: boolean
  canRun: boolean
  canExport: boolean
  scenarioUrl: string
  openPrintPreview(): void
  isLogScale: boolean
  toggleLogScale(): void
  shouldFormatNumbers: boolean
  toggleFormatNumbers(): void
  isAutorunEnabled: boolean
  toggleAutorun(): void
}

export interface DeterministicLinePlotProps {
  isRunning: boolean
  isAutorunEnabled: boolean
  canRun: boolean
}

const mapStateToProps = (state: State) => ({
  isRunning: selectIsRunning(state),
  isAutorunEnabled: selectIsAutorunEnabled(state),
})

const mapDispatchToProps = {}

function SimulationControls({ isRunning, isAutorunEnabled, canRun }: SimulationControlsProps) {
  const { t } = useTranslation()

  return (
    <>
      <Button
        className="btn-simulation-controls btn-run"
        type="submit"
        color="primary"
        disabled={!canRun || isRunning}
        data-testid="RunResults"
        title={isAutorunEnabled ? t('Refresh the simulation') : t('Run the simulation')}
      >
        <RunButtonContent isRunning={isRunning} isAutorunEnabled={isAutorunEnabled} size={ICON_SIZE} />
      </Button>

      <LinkButton
        className="btn-simulation-controls"
        disabled={!canRun}
        href={scenarioUrl}
        target="_blank"
        data-testid="RunResultsInNewTab"
        title={t('Run in a new tab')}
      >
        <MdTab size={ICON_SIZE} />
      </LinkButton>

      <ModalButtonExport buttonSize={ICON_SIZE} />

      <Button
        type="button"
        className="btn-simulation-controls"
        disabled={!canExport}
        onClick={openPrintPreview}
        title={t('Open Print Preview (Save as PDF or print)')}
      >
        <AiFillFilePdf size={ICON_SIZE} />
      </Button>

      <ModalButtonSharing buttonSize={ICON_SIZE} shareableLink={scenarioUrl} />

      <SettingsControls />
    </>
  )
}

const SimulationControlsConnected = connect(mapStateToProps, mapDispatchToProps)(SimulationControls)

export { SimulationControlsConnected as SimulationControls }

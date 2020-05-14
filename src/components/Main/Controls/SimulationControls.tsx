import React from 'react'

import { useTranslation } from 'react-i18next'
import { AiFillFilePdf } from 'react-icons/ai'
import { MdTab } from 'react-icons/md'
import { Button, CustomInput, FormGroup } from 'reactstrap'

import type { SeverityDistributionDatum } from '../../../algorithms/types/Param.types'
import type { AlgorithmResult } from '../../../algorithms/types/Result.types'

import type { State } from '../state/state'

import LinkButton from '../../Buttons/LinkButton'
import { ModalButtonExport } from './ModalButtonExport'
import { ModalButtonSharing } from './ModalButtonSharing'
import { PlotControls } from './PlotControls'
import { RunButtonContent } from './RunButtonContent'
import { ModalbuttonSettings } from './ModalButtonSettings'

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

function SimulationControls({
  scenarioState,
  severity,
  severityName,
  result,
  isRunning,
  canRun,
  canExport,
  scenarioUrl,
  openPrintPreview,
  isLogScale,
  toggleLogScale,
  shouldFormatNumbers,
  toggleFormatNumbers,
  isAutorunEnabled,
  toggleAutorun,
}: SimulationControlsProps) {
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
        <div className="btn-text">{t(`New tab`)}</div>
      </LinkButton>

      <ModalButtonExport
        buttonSize={ICON_SIZE}
        scenarioState={scenarioState}
        severity={severity}
        severityName={severityName}
        result={result}
      />

      <Button
        type="button"
        className="btn-simulation-controls"
        disabled={!canExport}
        onClick={openPrintPreview}
        title={t('Open Print Preview (Save as PDF or print)')}
      >
        <AiFillFilePdf size={ICON_SIZE} />
        <div className="btn-text">{`PDF`}</div>
      </Button>

      <ModalButtonSharing buttonSize={ICON_SIZE} shareableLink={scenarioUrl} />

      <ModalbuttonSettings
        buttonSize={ICON_SIZE}
        isLogScale={isLogScale}
        toggleLogScale={toggleLogScale}
        shouldFormatNumbers={shouldFormatNumbers}
        toggleFormatNumbers={toggleFormatNumbers}
        isAutorunEnabled={isAutorunEnabled}
        toggleAutorun={toggleAutorun}
      />
    </>
  )
}

export { SimulationControls }

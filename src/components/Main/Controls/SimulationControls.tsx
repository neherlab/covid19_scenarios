import React from 'react'

import { useTranslation } from 'react-i18next'
import { AiFillFilePdf } from 'react-icons/ai'
import { MdSettings, MdTab } from 'react-icons/md'
import { Button, CustomInput, FormGroup } from 'reactstrap'

import type { SeverityDistributionDatum } from '../../../algorithms/types/Param.types'
import type { AlgorithmResult } from '../../../algorithms/types/Result.types'

import type { State } from '../state/state'

import LinkButton from '../../Buttons/LinkButton'
import { ModalButtonExport } from './ModalButtonExport'
import { ModalButtonSharing } from './ModalButtonSharing'
import { RunButtonContent } from './RunButtonContent'

const ICON_SIZE = 25

export interface SimulationControlsProps {
  scenarioState: State
  severity: SeverityDistributionDatum[]
  severityName: string
  result?: AlgorithmResult
  isRunning: boolean
  isAutorunEnabled: boolean
  canRun: boolean
  canExport: boolean
  scenarioUrl: string
  toggleAutorun(): void
  openPrintPreview(): void
}

function SimulationControls({
  scenarioState,
  severity,
  severityName,
  result,
  isRunning,
  isAutorunEnabled,
  canRun,
  canExport,
  scenarioUrl,
  toggleAutorun,
  openPrintPreview,
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
        <div>{t(`New tab`)}</div>
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
        <div>{`PDF`}</div>
      </Button>

      <ModalButtonSharing buttonSize={ICON_SIZE} shareableLink={scenarioUrl} />

      <Button type="button" className="btn-simulation-controls" title={t('Open settings window')}>
        <MdSettings size={ICON_SIZE} />
        <div>{`Settings`}</div>
      </Button>

      <FormGroup inline className="ml-auto">
        <label htmlFor="autorun-checkbox" className="d-flex">
          <CustomInput
            id="autorun-checkbox"
            type="checkbox"
            onChange={toggleAutorun}
            checked={isAutorunEnabled}
            aria-checked={isAutorunEnabled}
          />
          {t(`Run automatically`)}
        </label>
      </FormGroup>
    </>
  )
}

export { SimulationControls }

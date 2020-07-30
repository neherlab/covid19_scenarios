import React, { useCallback } from 'react'

import { connect } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { AiFillFilePdf } from 'react-icons/ai'
import { MdTab } from 'react-icons/md'
import { Button } from 'reactstrap'
import { ActionCreator } from 'typescript-fsa'

import type { State } from '../../../state/reducer'
import { selectIsRunning, selectHasResult } from '../../../state/algorithm/algorithm.selectors'
import { selectIsAutorunEnabled } from '../../../state/settings/settings.selectors'
import { selectCanRun } from '../../../state/scenario/scenario.selectors'
import { newTabOpenTrigger, printPreviewOpenTrigger } from '../../../state/ui/ui.actions'

import { ModalButtonExport } from './ModalButtonExport'
import { ModalButtonSharing } from './ModalButtonSharing'
import { RunButtonContent } from './RunButtonContent'
import { SettingsControls } from './SettingsControls'

const ICON_SIZE = 25

export interface SimulationControlsProps {
  canRun: boolean
  hasResult: boolean
  isRunning: boolean
  isAutorunEnabled: boolean
  newTabOpen: ActionCreator<void>
  printPreviewOpen: ActionCreator<void>
}

const mapStateToProps = (state: State) => ({
  canRun: selectCanRun(state),
  hasResult: selectHasResult(state),
  isRunning: selectIsRunning(state),
  isAutorunEnabled: selectIsAutorunEnabled(state),
})

const mapDispatchToProps = {
  newTabOpen: newTabOpenTrigger,
  printPreviewOpen: printPreviewOpenTrigger,
}

function SimulationControls({
  canRun,
  hasResult,
  isRunning,
  isAutorunEnabled,
  newTabOpen,
  printPreviewOpen,
}: SimulationControlsProps) {
  const { t } = useTranslation()
  const newTabOpenCallback = useCallback(() => newTabOpen(), [newTabOpen])
  const printPreviewOpenCallback = useCallback(() => printPreviewOpen(), [printPreviewOpen])

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

      <Button
        className="btn-simulation-controls"
        disabled={!canRun}
        onClick={newTabOpenCallback}
        data-testid="RunResultsInNewTab"
        title={t('Run in a new tab')}
      >
        <MdTab size={ICON_SIZE} />
      </Button>

      <ModalButtonExport buttonSize={ICON_SIZE} />

      <Button
        type="button"
        className="btn-simulation-controls"
        disabled={!hasResult}
        onClick={printPreviewOpenCallback}
        title={t('Open Print Preview (Save as PDF or print)')}
      >
        <AiFillFilePdf size={ICON_SIZE} />
      </Button>

      <ModalButtonSharing buttonSize={ICON_SIZE} />

      <SettingsControls />
    </>
  )
}

const SimulationControlsConnected = connect(mapStateToProps, mapDispatchToProps)(SimulationControls)

export { SimulationControlsConnected as SimulationControls }

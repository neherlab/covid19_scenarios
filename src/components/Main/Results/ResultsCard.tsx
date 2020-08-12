import React, { useRef, useCallback } from 'react'

import classNames from 'classnames'
import { connect } from 'react-redux'
import { Button, Col, Row } from 'reactstrap'
import { useTranslation } from 'react-i18next'
import { FiChevronLeft } from 'react-icons/fi'
import { ActionCreator } from 'typescript-fsa'

import { selectHasResult } from '../../../state/algorithm/algorithm.selectors'
import { State } from '../../../state/reducer'
import { selectCanRun } from '../../../state/scenario/scenario.selectors'
import { selectAreResultsMaximized } from '../../../state/settings/settings.selectors'
import { toggleResultsMaximized } from '../../../state/settings/settings.actions'

import { CollapsibleCard } from '../../Form/CollapsibleCard'

import { CardWithControls } from '../../Form/CardWithControls'

import { AgeBarChart } from './AgeBarChart'
import { DeterministicLinePlot } from './DeterministicLinePlot'
import { OutcomeRatesTable } from './OutcomeRatesTable'
import { OutcomesDetailsTable } from './OutcomesDetailsTable'
import { SimulationControls } from '../Controls/SimulationControls'
import { PlotSpinner } from './PlotSpinner'

const ICON_SIZE = 50

interface ResultsCardProps {
  canRun: boolean
  hasResult: boolean
  areResultsMaximized: boolean
  toggleResultsMaximized: ActionCreator<void>
}

const mapStateToProps = (state: State) => ({
  canRun: selectCanRun(state),
  hasResult: selectHasResult(state),
  areResultsMaximized: selectAreResultsMaximized(state),
})

const mapDispatchToProps = {
  toggleResultsMaximized,
}

function ResultsCardDisconnected({ canRun, hasResult, areResultsMaximized, toggleResultsMaximized }: ResultsCardProps) {
  const { t } = useTranslation()
  const scrollTargetRef = useRef<HTMLDivElement | null>(null)
  const toggleResultsMaximizedLocal = useCallback(() => toggleResultsMaximized(), [toggleResultsMaximized])

  function scrollToResults() {
    scrollTargetRef?.current?.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' })
  }

  return (
    <>
      <CardWithControls
        identifier="results-card"
        className="card-results"
        labelComponent={
          <h2 className="p-0 m-0 text-truncate d-flex align-items-center" data-testid="ResultsCardTitle">
            <Button
              onClick={toggleResultsMaximizedLocal}
              className="btn-dark btn-results-expand mr-2 pt-1 pb-2 d-none d-xl-block"
            >
              <FiChevronLeft className={classNames(areResultsMaximized ? 'icon-rotate-180' : 'icon-rotate-0')} />
            </Button>
            <span>{t('Results')}</span>
          </h2>
        }
        help={t('This section contains simulation results')}
      >
        <Row noGutters className="row-results-simulation-controls">
          <Col>
            <SimulationControls />
          </Col>
        </Row>

        <Row noGutters className="row-results-trajectories">
          <Col>
            <div ref={scrollTargetRef} />
            <CardWithControls
              className="card-trajectories"
              identifier="trajectories"
              labelComponent={<h3 className="d-inline text-truncate">{t('Outbreak trajectories')}</h3>}
              help={t(`Simulation results over time`)}
            >
              <Row noGutters>
                <Col>
                  <DeterministicLinePlot />
                  <PlotSpinner size={ICON_SIZE} />
                </Col>
              </Row>
            </CardWithControls>
          </Col>
        </Row>

        <Row noGutters className="row-results-age-distribution">
          <Col>
            <CardWithControls
              className="card-age-distribution"
              identifier="age-distribution"
              labelComponent={<h3 className="d-inline text-truncate">{t('Distribution across age groups')}</h3>}
              help={t('Summary of outcomes per age group')}
            >
              <Row>
                <Col>
                  <AgeBarChart />
                  <PlotSpinner size={ICON_SIZE} />
                </Col>
              </Row>
            </CardWithControls>
          </Col>
        </Row>

        <Row noGutters className="row-results-outcomes">
          <Col>
            <CollapsibleCard
              className="card-outcomes-table"
              identifier="outcomes-table"
              title={<h3 className="d-inline text-truncate">{t('Outcomes summary table')}</h3>}
              help={t('Summary table of outcomes for the entire population')}
              defaultCollapsed
            >
              <Row>
                <Col>
                  <OutcomesDetailsTable />
                  <PlotSpinner size={ICON_SIZE} />
                </Col>
              </Row>
            </CollapsibleCard>
          </Col>
        </Row>

        <Row noGutters className="row-results-outcomes-table">
          <Col>
            <CardWithControls
              className="card-outcomes"
              identifier="outcomes"
              labelComponent={<h3 className="d-inline text-truncate">{t('Outcomes')}</h3>}
              help={t('Summary of outcomes for the entire population')}
            >
              <Row>
                <Col>
                  <OutcomeRatesTable />
                  <PlotSpinner size={ICON_SIZE} />
                </Col>
              </Row>
            </CardWithControls>
          </Col>
        </Row>
      </CardWithControls>

      {hasResult && (
        <div className="container-goto-results d-flex d-md-none w-100">
          <Button className="btn-goto-results mx-auto" color="primary" onClick={scrollToResults}>
            {t('Go to results')}
          </Button>
        </div>
      )}
    </>
  )
}

const ResultsCard = connect(mapStateToProps, mapDispatchToProps)(ResultsCardDisconnected)

export { ResultsCard }

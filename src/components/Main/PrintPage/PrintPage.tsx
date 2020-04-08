import React from 'react'
import { Button } from 'reactstrap'
import { useTranslation } from 'react-i18next'
import { AllParams, PopulationData, EpidemiologicalData, EmpiricalData } from '../../../algorithms/types/Param.types'
import { AlgorithmResult } from '../../../algorithms/types/Result.types'
import { SeverityTableRow } from '../Scenario/SeverityTable'
import { DeterministicLinePlot } from '../Results/DeterministicLinePlot'
import { OutcomeRatesTable } from '../Results/OutcomeRatesTable'
import { AgeBarChart } from '../Results/AgeBarChart'
import TableResult from './TableResult'
import logo from '../../../assets/img/HIVEVO_logo.png'

import './PrintPage.scss'

interface PropsType {
  params: AllParams
  scenarioUsed: string
  severity: SeverityTableRow[]
  result?: AlgorithmResult
  caseCounts?: EmpiricalData
  onClose: () => void
}

export default function PrintParameters({ params, scenarioUsed, severity, result, caseCounts, onClose }: PropsType) {
  const { t } = useTranslation()
  if (result && caseCounts) {
    return (
      <div style={{ maxWidth: '20cm' }}>
        <div className="d-print-none">
          <Button onClick={onClose} color="primary" size="sm">
            {t('Close Print Preview')}
          </Button>
          &nbsp;
          <Button onClick={() => window.print()} color="primary" size="sm">
            {t('Print (or save as PDF)')}
          </Button>
        </div>
        <div>
          <h1 className="text-center">COVID-19 Scenarios</h1>
          <p className="text-center">
            COVID19-Scenarios allows to explore the dynamics of a COVID19 outbreak in a community and the anticipated
            burden on the health care system.
          </p>

          <div className="text-center p-logo">
            <img alt="logo" src={logo} />
          </div>
          <p>
            COVID19-Scenarios, as every other model, has parameters whose values are not known with certainty and that
            might differ between places and with time. The values of some of these parameters have a big effect on the
            results, especially those that determine how rapidly the outbreak spreads or how effective counter measures
            are: some values will result in a small limited outbreak, others in a massive outbreak with many fatalities.
            Furthermore, when extrapolating the outbreak into the future, the results will critically depend on
            assumptions of <strong>future</strong> policy and the degree to which infection control measures are adhered
            to. It is therefore important to interpret the model output with care and to assess the plausibility of the
            parameter values and model assumptions.{' '}
          </p>
          <p>
            {t(
              `This tool uses a mathematical model to simulate a variety of COVID-19 outcomes based on user-defined parameters. This output of the model depends on model assumptions and parameter choices.`,
            )}
          </p>
          <p>
            {t(
              `It is not a medical predictor, and should be used for informational and research purposes only. Please carefully consider the parameters you choose. Interpret and use the simulated results responsibly. Authors are not liable for any direct or indirect consequences of this usage.`,
            )}
          </p>
        </div>
        <div
          style={{
            breakBefore: 'always',
            pageBreakBefore: 'always',
          }}
        >
          <h2>Parameters</h2>
          <p>Scenario used : {scenarioUsed}</p>
          <h3>Population</h3>
          {(Object.keys(params.population) as (keyof PopulationData)[]).map((key) => {
            return (
              <p key={key} style={{ margin: 0 }}>
                <u>{key}:</u> {params.population[key]}
              </p>
            )
          })}
          <h3>Epidemiology</h3>
          {(Object.keys(params.epidemiological) as (keyof EpidemiologicalData)[]).map((key) => {
            return (
              <p key={key} style={{ margin: 0 }}>
                <u>{key}:</u> {params.epidemiological[key]}
              </p>
            )
          })}
          <h3>Mitigation</h3>
          {params.containment.mitigationIntervals.map((mitigationInterval) => {
            return (
              <div key={mitigationInterval.id} style={{ marginBottom: 10 }}>
                <h6>{mitigationInterval.name}:</h6>
                <p style={{ margin: 0 }}>
                  <u>from:</u> {mitigationInterval.timeRange.tMin.toString()}
                </p>
                <p style={{ margin: 0 }}>
                  <u>to:</u> {mitigationInterval.timeRange.tMax.toString()}
                </p>
                <p style={{ margin: 0 }}>
                  <u>value:</u> {mitigationInterval.mitigationValue}
                </p>
              </div>
            )
          })}
        </div>
        <div
          style={{
            breakBefore: 'always',
            pageBreakBefore: 'always',
          }}
        >
          <h2>results</h2>
          <DeterministicLinePlot
            data={result}
            params={params}
            mitigation={params.containment}
            logScale
            showHumanized
            caseCounts={caseCounts}
            forcedWidth={700}
            forcedHeight={500}
          />
        </div>
        <div
          style={{
            breakBefore: 'always',
            pageBreakBefore: 'always',
          }}
        >
          <TableResult result={result} />
        </div>
        <div
          style={{
            breakBefore: 'always',
            pageBreakBefore: 'always',
          }}
        >
          <AgeBarChart showHumanized data={result} rates={severity} forcedWidth={700} forcedHeight={350} printLabel />
          <OutcomeRatesTable showHumanized result={result} rates={severity} printable />
        </div>
      </div>
    )
  }
  return null
}

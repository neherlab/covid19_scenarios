import React from 'react'
import moment from 'moment'
import { Button } from 'reactstrap'
import { useTranslation } from 'react-i18next'
import { AllParams, PopulationData, EpidemiologicalData, EmpiricalData } from '../../../algorithms/types/Param.types'
import { AlgorithmResult } from '../../../algorithms/types/Result.types'
import { SeverityTableRow } from '../Scenario/ScenarioTypes'
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

const months = moment.months()

const parameterExplanations = {
  cases: 'Case counts for',
  country: 'Age distribution for',
  populationServed: 'Population size',
  hospitalBeds: 'Number of hospital beds',
  ICUBeds: 'Number of available ICU beds',
  importsPerDay: 'Cases imported into community per day',
  initialNumberOfCases: 'Case number at the start of the simulation',
  infectiousPeriod: 'Infectious period [days]',
  latencyTime: 'Latency [days]',
  lengthHospitalStay: 'Average time in regular ward [days]',
  lengthICUStay: 'Average time in ICU ward [days]',
  overflowSeverity: 'Increase in death rate when ICUs are overcrowed',
  r0: 'R0 at the beginning of the outbreak',
  seasonalForcing: 'Seasonal variation in transmissibility',
  peakMonth: 'Seasonal peak in transmissibility',
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
          <div className="text-right p-logo">
            <img alt="logo" src={logo} width={'20%'} />
          </div>
          <h1 className="text-center">COVID-19 Scenarios</h1>

          <p>
            COVID19-Scenarios allows to explore the dynamics of a COVID19 outbreak in a community and the anticipated
            burden on the health care system. COVID19-Scenarios, as every other model, has parameters whose values are
            not known with certainty and that might differ between places and with time. The values of some of these
            parameters have a big effect on the results, especially those that determine how rapidly the outbreak
            spreads or how effective counter measures are: some values will result in a small limited outbreak, others
            in a massive outbreak with many fatalities. Furthermore, when extrapolating the outbreak into the future,
            the results will critically depend on assumptions of <strong>future</strong> policy and the degree to which
            infection control measures are adhered to. It is therefore important to interpret the model output with care
            and to assess the plausibility of the parameter values and model assumptions.{' '}
          </p>
          <p>
            The underlying model is an age-structured generalized SEIR model. For details, please consult the
            documentation on <a href="https://covid19-scenarios.org/about">covid19-scenarios.org/about</a>. Default
            parameter choices are informed by the available evidence at the time, but might need adjustment for a
            particular community or as more information on the outbreak is available.
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
          <h5>Scenario used : {scenarioUsed}</h5>
          <h3>Population</h3>
          {(Object.keys(params.population) as (keyof PopulationData)[]).map((key) => {
            return (
              <p key={key} style={{ margin: 0 }}>
                {parameterExplanations[key] || key}: <b>{params.population[key]}</b>
              </p>
            )
          })}
          <p />
          <h3>Epidemiology</h3>
          {(Object.keys(params.epidemiological) as (keyof EpidemiologicalData)[]).map((key) => {
            return (
              <p key={key} style={{ margin: 0 }}>
                {parameterExplanations[key] || key}:{' '}
                <b>{key === 'peakMonth' ? months[params.epidemiological[key]] : params.epidemiological[key]}</b>
              </p>
            )
          })}
          <p />
          <h3>Mitigation</h3>
          {params.containment.mitigationIntervals.map((mitigationInterval) => {
            return (
              <div key={mitigationInterval.id} style={{ marginBottom: 10 }}>
                <h5>{mitigationInterval.name}:</h5>
                <p style={{ margin: 0 }}>
                  from: <b>{mitigationInterval.timeRange.tMin.toString()}</b>
                </p>
                <p style={{ margin: 0 }}>
                  to: <b>{mitigationInterval.timeRange.tMax.toString()}</b>
                </p>
                <p style={{ margin: 0 }}>
                  Reduction of transmission: <b>{mitigationInterval.mitigationValue}%</b>
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
        <p />
        <p>
          Produced with <a href="https://covid19-scenarios.org">covid19-scenarios.org</a> on{' '}
          {new Date().toString()}.
        </p>
      </div>
    )
  }
  return null
}

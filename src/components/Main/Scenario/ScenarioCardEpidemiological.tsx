import React from 'react'
import { useTranslation } from 'react-i18next'
import moment from 'moment'

import { FormikErrors, FormikTouched, FormikValues } from 'formik'

import { CardWithoutDropdown } from '../../Form/CardWithoutDropdown'
import { FormDropdown } from '../../Form/FormDropdown'
import { FormSpinBox } from '../../Form/FormSpinBox'

const months = moment.months()
const monthOptions = months.map((month, i) => ({ value: i, label: month }))

export interface ScenarioCardEpidemiologicalProps {
  errors?: FormikErrors<FormikValues>
  touched?: FormikTouched<FormikValues>
}

function ScenarioCardEpidemiological({ errors, touched }: ScenarioCardEpidemiologicalProps) {
  const { t } = useTranslation()
  // function handleChangeEpidemiologicalScenario(newEpidemiologicalScenario: string) {
  //   scenarioDispatch(setEpidemiologicalScenario({ scenarioName: newEpidemiologicalScenario }))
  // }

  return (
    <CardWithoutDropdown
      className="card--epidemiology"
      identifier="epidemiologicalScenario"
      label={<h3 className="p-0 d-inline text-truncate">{t('Epidemiology')}</h3>}
      help={t(
        'Epidemiological parameters specifing growth rate, seasonal variation, and duration of hospital stay. The presets are combinations of speed and geography (speed/region).',
      )}
    >
      <FormSpinBox
        identifier="epidemiological.r0"
        label={`${t('Annual average')} R\u2080`}
        help={t(
          'Average number of secondary infections per case. When R0 varies throughout the year (seasonal forcing), this value is the mean R0.',
        )}
        step={0.1}
        errors={errors}
        touched={touched}
      />
      <FormSpinBox
        identifier="epidemiological.latencyTime"
        label={`${t('Latency')} [${t('days')}]`}
        help={t('Time from infection to onset of symptoms (here onset of infectiousness)')}
        step={1}
        min={0}
        errors={errors}
        touched={touched}
      />
      <FormSpinBox
        identifier="epidemiological.infectiousPeriod"
        label={`${t('Infectious period')} [${t('days')}]`}
        help={t(
          'Average number of days a person is infectious. Over this time, R0 infections happen on average. Together with the latency time, this defines the serial interval. The longer the serial interval, the slower the outbreak.',
        )}
        step={1}
        min={0}
        errors={errors}
        touched={touched}
      />
      <FormSpinBox
        identifier="epidemiological.seasonalForcing"
        label={t('Seasonal forcing')}
        help={t('Amplitude of seasonal variation in transmission')}
        step={0.1}
        min={0}
        errors={errors}
        touched={touched}
      />
      <FormDropdown<number>
        identifier="epidemiological.peakMonth"
        label={t('Seasonal peak')}
        help={t('Time of the year with peak transmission')}
        options={monthOptions}
        errors={errors}
        touched={touched}
      />
      <FormSpinBox
        identifier="epidemiological.lengthHospitalStay"
        label={`${t('Hospital stay')} [${t('days')}]`}
        help={t('Average number of days a severe case stays in regular hospital beds')}
        step={1}
        min={0}
        errors={errors}
        touched={touched}
      />
      <FormSpinBox
        identifier="epidemiological.lengthICUStay"
        label={`${t('ICU stay')} [${t('days')}]`}
        help={t('Average number of days a critical case stays in the ICU')}
        step={1}
        min={0}
        errors={errors}
        touched={touched}
      />
      <FormSpinBox
        identifier="epidemiological.overflowSeverity"
        label={t('Severity of ICU overflow')}
        help={t(
          'A multiplicative factor to death rate to patients that require but do not have access to an ICU bed relative to those who do.',
        )}
        step={0.1}
        min={1}
        errors={errors}
        touched={touched}
      />
    </CardWithoutDropdown>
  )
}

export { ScenarioCardEpidemiological }

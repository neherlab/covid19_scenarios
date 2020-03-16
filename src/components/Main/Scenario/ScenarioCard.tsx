import React from 'react'

import { FormikErrors, FormikTouched } from 'formik'
import { connect } from 'react-redux'
import { ActionCreator } from 'typescript-fsa'

import { Col, Row } from 'reactstrap'

import { CardWithDropdown } from '../../Form/CardWithDropdown'
import { stringsToOptions } from '../../Form/FormDropdownOption'

import { State } from '../../../state/reducer'
import { setOverallScenario, SetScenarioParams } from '../../../state/scenario/scenario.actions'
import { selectCurrentScenarioOverall, selectScenariosOverall } from '../../../state/scenario/scenario.selectors'

import ScenarioCardContainment from './ScenarioCardContainment'
import ScenarioCardEpidemiological from './ScenarioCardEpidemiological'
import ScenarioCardPopulation from './ScenarioCardPopulation'
import SeverityCard from './SeverityCard'

export interface ScenarioCardProps {
  errors?: FormikErrors<any>
  touched?: FormikTouched<any>
  overallScenario: string
  overallScenarios: string[]
  setOverallScenario: ActionCreator<SetScenarioParams>
}

function ScenarioCard({ overallScenario, overallScenarios, setOverallScenario, errors, touched }: ScenarioCardProps) {
  const overallScenarioOptions = stringsToOptions(overallScenarios)

  function handleChangeOverallScenario(newOverallScenario: string) {
    setOverallScenario({ scenarioName: newOverallScenario })
  }

  return (
    <CardWithDropdown
      identifier="overallScenario"
      label={<h3 className="p-0 m-0 d-inline text-truncate">Scenario</h3>}
      help="Combination of population, epidemiology, and mitigation scenarios"
      options={overallScenarioOptions}
      value={overallScenarioOptions.find(s => s.label === overallScenario)}
      onValueChange={handleChangeOverallScenario}
    >
      <>
        <Row noGutters>
          <Col xl={6} className="py-1 px-1">
            <ScenarioCardPopulation errors={errors} touched={touched} />
          </Col>

          <Col xl={6} className="py-1 px-1">
            <ScenarioCardEpidemiological errors={errors} touched={touched} />
          </Col>
        </Row>

        <Row noGutters>
          <Col className="py-1 px-1">
            <ScenarioCardContainment errors={errors} touched={touched} />
          </Col>
        </Row>

        <Row noGutters>
          <Col className="py-1 px-1">
            <SeverityCard />
          </Col>
        </Row>
      </>
    </CardWithDropdown>
  )
}

const mapStateToProps = (state: State) => ({
  overallScenario: selectCurrentScenarioOverall(state),
  overallScenarios: selectScenariosOverall(state),
})

const mapDispatchToProps = {
  setOverallScenario,
}

export default connect(mapStateToProps, mapDispatchToProps)(ScenarioCard)

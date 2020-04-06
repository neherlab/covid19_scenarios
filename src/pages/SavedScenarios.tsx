import React from 'react'
import { Container, Col, Row } from 'reactstrap'

import LinkExternal from '../components/Router/LinkExternal'
import ScenarioBoard from '../components/Main/ScenarioBoard/ScenarioBoard'

const SavedScenarios: React.FC = () => {
  return (
    <Container>
      <ScenarioBoard />
    </Container>
  )
}

export default SavedScenarios

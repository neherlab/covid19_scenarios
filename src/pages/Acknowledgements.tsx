import React, { useState, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import { Container, Col, Row } from 'reactstrap'
import { useTranslation } from 'react-i18next'

import './About.scss'

import LinkExternal from '../components/Router/LinkExternal'

const Acknowledgements: React.FC = () => {
  const { t } = useTranslation()
  const [loading, setLoading] = useState<boolean>(true)
  const [content, setContent] = useState<string>('')

  useEffect(() => {
    const loadContent = async (): Promise => {
      try {
        const res: Promise = await fetch(
          'https://raw.githubusercontent.com/neherlab/covid19_scenarios/master/README.md',
        )
        const readme: string = await res.text()
        const ackRegex: RegExp = new RegExp(
          '(<h2.{0,}>\n.{0,}Acknowledgements.{0,}\n</h2>(.|[\r|\n]){0,}\n{0,2})## ',
          'gm',
        )
        const ackSection: string[] = ackRegex.exec(readme)
        setContent(ackSection.length > 1 ? ackSection[1] : t('Not Found'))
      } catch (err) {
        console.error(err)
      }
    }
    loadContent()
  }, [])

  return (
    <Container>
      <Row>
        <Col>
          <ReactMarkdown source={content} escapeHtml={false} />
        </Col>
      </Row>
    </Container>
  )
}

export default Acknowledgements

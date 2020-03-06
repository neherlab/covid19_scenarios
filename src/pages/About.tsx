import React from 'react'
import {
  Col,
  Row,
} from 'reactstrap'

import './About.scss'
import model from '../assets/img/model_sketch.svg.png'

import LinkExternal from '../components/Router/LinkExternal'

const About: React.FC = () => {
  return (
    <>
      <h1 className="h1-about">{'About COVID-19 Scenarios'}</h1>
      <Row>
      <Col lg={2}></Col>
      <Col lg={8}>
      <p>
        {`This web application serves as a plannling tool for COVID-19 outbreaks in communities across the world.
        It implements a simple SIR model with additional categories for exposed individuals that are not yet infectious,
        severely sick people in need of hospitalization, people in critical condition, and a fatal category.`}
      </p>

      <h2>{'Basic assumptions'}</h2>
      <p>
        {`The model works as follows:`}
      </p>
      <ul>
        <li> susceptible individuals are exposed/infected through contact with infectious individuals. Each infectious individual causes on average R_<sub>0</sub> secondary infections while they are infectious.
            Transmissibility of the virus could have seasonal variation which is parameterized with the parameter "seasonal forcing" (amplitude) and "peak month" (month of most efficient transmission).
          </li>
        <li> exposed individuals progress to a symptomatic/infectious state after an average incubation time</li>
        <li> infectious individuals recover or progress to severe disease. The ratio of recovery to severe progression depends on the age distribution in the populations</li>
        <li> severely sick individuals either recover or deteriorate and turn critical. Again, this depends on the age distribution in the population </li>
        <li> critically ill individuals either return to regular hospital or die. Again, this depends on the age distribution in the population </li>
      </ul>
      <p>
        The individual parameters of the model can all be changed to allow exploration of different scenari
        Importantly, the simulation does not explicitly account for future containment measures. This might be added in the future, but for now you can reduce R<sub>0</sub> to explore the effects of infection control.
      </p>

      <figure className="figure w-100">
        <img src={model} className="figure-img img-fluid rounded"
             alt="Short description goes here" />
        <figcaption className="figure-caption text-center">
          Figure 1. Caption goes here
        </figcaption>
      </figure>

      <p>
        {`COVID-19 is much more severe in the elderly and proportion of elderly in a community is therefore an important determinant of the overall burden on the health care system and the death toll.
        We collected age distributions for many countries from data provided by the UN and make those available as input parameters.
        Furthermore, we use data provided by the epidemiology group by the `}
        <LinkExternal url="http://weekly.chinacdc.cn/en/article/id/e53946e2-c6c4-41e9-9a9b-fea8db1a8f51">{`Chinese CDC`}
        </LinkExternal>{` to estimate the fraction of severe and fatal cases by age group.`}
      </p>

      <h2>{'Team'}</h2>
      </Col>
      <Col lg={2}></Col>
      </Row>
    </>
  )
}

export default About

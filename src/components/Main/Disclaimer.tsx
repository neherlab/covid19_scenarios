import React, { useEffect, useState } from 'react'

import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Row, Col, CustomInput, Form, FormGroup } from 'reactstrap'
import { useTranslation } from 'react-i18next'

import './Disclaimer.scss'

import LocalStorage, { LOCAL_STORAGE_KEYS } from '../../helpers/localStorage'

import logo from '../../assets/img/HIVEVO_logo.png'

const disclaimerVersion = 0

interface SuppressShowAgain {
  version: number
  suppressShowAgain: boolean
}

function onDialogClosed(suppressShowAgain: boolean) {
  LocalStorage.set(LOCAL_STORAGE_KEYS.SUPPRESS_DISCLAIMER, {
    version: disclaimerVersion,
    suppressShowAgain,
  })
}

function DisclaimerContent() {
  const { t } = useTranslation()
  return (
    <>
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
    </>
  )
}

export default function DisclaimerProps() {
  const { t } = useTranslation()
  const [showModal, setShowModal] = useState(false)
  const [suppressShowAgain, setsuppressShowAgain] = useState(false)

  useEffect(() => {
    const persistedSuppressShowAgain = LocalStorage.get<SuppressShowAgain>(LOCAL_STORAGE_KEYS.SUPPRESS_DISCLAIMER)

    if (persistedSuppressShowAgain !== null) {
      setsuppressShowAgain(persistedSuppressShowAgain.suppressShowAgain)
      setShowModal(
        !persistedSuppressShowAgain.suppressShowAgain || persistedSuppressShowAgain.version < disclaimerVersion,
      )
    } else {
      setShowModal(true)
    }
  }, [])

  const toggle = () => setShowModal(!showModal)
  const toggleChecked = () => setsuppressShowAgain(!suppressShowAgain)

  return (
    <>
      <div className="d-none d-print-block p-break-after">
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
        <DisclaimerContent />
      </div>
      <Modal
        isOpen={showModal}
        backdrop="static"
        fade={false}
        centered
        autoFocus
        toggle={toggle}
        onClosed={() => onDialogClosed(suppressShowAgain)}
      >
        <ModalHeader>{t(`COVID-19 Scenarios`)}</ModalHeader>
        <ModalBody>
          <Row>
            <Col>
              <DisclaimerContent />
            </Col>
          </Row>
          <Row>
            <Col>
              <Form inline>
                <FormGroup className="ml-auto">
                  <CustomInput
                    id="dont-show-again"
                    type="checkbox"
                    onChange={toggleChecked}
                    checked={suppressShowAgain}
                  />
                  <label htmlFor="dont-show-again" className="d-flex">
                    {t(`Don't show again`)}
                  </label>
                </FormGroup>
              </Form>
            </Col>
          </Row>
        </ModalBody>
        <ModalFooter>
          <Button className="mx-auto" color="danger" onClick={toggle}>
            Accept
          </Button>
        </ModalFooter>
      </Modal>
    </>
  )
}

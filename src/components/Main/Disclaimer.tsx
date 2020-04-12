import React, { useEffect, useState } from 'react'

import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Row, Col, CustomInput, Form, FormGroup } from 'reactstrap'
import { useTranslation } from 'react-i18next'

import './Disclaimer.scss'

import LocalStorage, { LOCAL_STORAGE_KEYS } from '../../helpers/localStorage'

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
          </Col>
        </Row>

        <Row>
          <Col>
            <Form inline>
              <FormGroup className="ml-auto">
                <label htmlFor="dont-show-again" className="d-flex">
                  <CustomInput
                    id="dont-show-again"
                    type="checkbox"
                    onChange={toggleChecked}
                    checked={suppressShowAgain}
                  />
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
  )
}

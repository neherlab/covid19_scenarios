import React, { useState } from 'react'

import { useTranslation } from 'react-i18next'
import { connect } from 'react-redux'
import {
  Button,
  Col,
  CustomInput,
  Form,
  FormGroup,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
  UncontrolledAlert,
} from 'reactstrap'
import { ActionCreator } from 'typescript-fsa'

import type { State } from '../../state/reducer'
import {
  selectDisclaimerShouldSuppress,
  selectDisclaimerVersionAccepted,
} from '../../state/settings/settings.selectors'
import { setDisclaimerVersionAccepted, toggleDisclaimerShouldSuppress } from '../../state/settings/settings.actions'
import { LinkExternal } from '../Link/LinkExternal'

const DISCLAIMER_CURRENT_VERSION = 2

export interface DisclaimerProps {
  disclaimerVersionAccepted?: number
  disclaimerShouldSuppress: boolean
  setDisclaimerVersionAccepted: ActionCreator<number>
  toggleDisclaimerShouldSuppress: ActionCreator<void>
}

const mapStateToProps = (state: State) => ({
  disclaimerVersionAccepted: selectDisclaimerVersionAccepted(state),
  disclaimerShouldSuppress: selectDisclaimerShouldSuppress(state),
})

const mapDispatchToProps = {
  setDisclaimerVersionAccepted,
  toggleDisclaimerShouldSuppress,
}

export const Disclaimer = connect(mapStateToProps, mapDispatchToProps)(DisclaimerDisconnected)

export function DisclaimerDisconnected({
  disclaimerVersionAccepted,
  disclaimerShouldSuppress,
  setDisclaimerVersionAccepted,
  toggleDisclaimerShouldSuppress,
}: DisclaimerProps) {
  const { t } = useTranslation()

  const [isOpen, setIsOpen] = useState(
    !(disclaimerShouldSuppress && disclaimerVersionAccepted && disclaimerVersionAccepted <= DISCLAIMER_CURRENT_VERSION),
  )

  function onAccept() {
    setDisclaimerVersionAccepted(DISCLAIMER_CURRENT_VERSION)
    setIsOpen(false)
  }

  const toggleDisclaimerShouldSuppressLocal = () => toggleDisclaimerShouldSuppress()

  return (
    <Modal isOpen={isOpen} backdrop="static" fade={false} centered autoFocus size="lg">
      <ModalHeader>{t(`COVID-19 Scenarios`)}</ModalHeader>
      <ModalBody>
        <Row noGutters>
          <Col>
            <UncontrolledAlert color="warning">
              <h5 className="text-center">{t('Archived')}</h5>
              <p>{t('The data and pre-set scenarios are no longer being updated, but we keep the website alive for posterity.')}</p>
              <p>
                {t(
                  'If you want to continue this work, you can find the source code for the website as well as the data update scripts at ',
                )}
                <LinkExternal url="https://github.com/neherlab/covid19_scenarios">
                  {t('https://github.com/neherlab/covid19_scenarios')}
                </LinkExternal>
              </p>
            </UncontrolledAlert>
          </Col>
        </Row>

        <Row>
          <Col>
            <p>
              {t(
                'This tool uses a mathematical model to simulate a variety of COVID-19 outcomes based on user-defined parameters. This output of the model depends on model assumptions and parameter choices.',
              )}
            </p>
            <p>
              {t(
                'It is not a medical predictor, and should be used for informational and research purposes only. Please carefully consider the parameters you choose. Interpret and use the simulated results responsibly. Authors are not liable for any direct or indirect consequences of this usage.',
              )}
            </p>
            <p>
              {t(
                'The pre-set parameters in the different scenarios are meant as a starting point for adjustments by the user, not as proper fits to the available data.',
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
                    onChange={toggleDisclaimerShouldSuppressLocal}
                    checked={disclaimerShouldSuppress}
                  />
                  {t(`Don't show again`)}
                </label>
              </FormGroup>
            </Form>
          </Col>
        </Row>
      </ModalBody>
      <ModalFooter>
        <Button color="danger" onClick={onAccept}>
          {t('Accept')}
        </Button>
      </ModalFooter>
    </Modal>
  )
}

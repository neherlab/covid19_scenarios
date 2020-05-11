import React, { useState } from 'react'

import { useTranslation } from 'react-i18next'
import { Button, Col, Modal, ModalBody, ModalHeader, Row, ModalFooter, InputGroup, InputGroupAddon } from 'reactstrap'
import { MdShare } from 'react-icons/md'

import {
  EmailIcon,
  EmailShareButton,
  FacebookIcon,
  FacebookShareButton,
  LinkedinIcon,
  LinkedinShareButton,
  TwitterIcon,
  TwitterShareButton,
  VKIcon,
  VKShareButton,
  WeiboIcon,
  WeiboShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from 'react-share'

import { ClipboardButton } from '../../Buttons/ClipboardButton'
import { UrlTextInput } from './UrlTextInput'

import './ModalButtonSharing.scss'

const SOCIAL_ICON_SIZE = 44

export interface ModalButtonSharingProps {
  buttonSize: number
  shareableLink: string
}

function ModalButtonSharing({ buttonSize, shareableLink }: ModalButtonSharingProps) {
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState<boolean>(false)

  function toggleOpen() {
    setIsOpen(!isOpen)
  }

  function open() {
    setIsOpen(true)
  }

  function close() {
    setIsOpen(false)
  }

  return (
    <>
      <Button
        className="btn-simulation-controls"
        type="button"
        onClick={open}
        title={t(`Share a direct link to this simulation`)}
      >
        <MdShare size={buttonSize} />
        <div>{t(`Share`)}</div>
      </Button>
      <Modal
        className="sharing-modal"
        centered
        isOpen={isOpen}
        toggle={toggleOpen}
        fade={false}
        autoFocus={false}
        size="lg"
      >
        <ModalHeader toggle={close}>
          <MdShare size={20} />
          <span className="ml-2">{t(`Share`)}</span>
        </ModalHeader>
        <ModalBody>
          <Row>
            <Col>
              <Row>
                <Col>
                  <h4 className="text-center">{t(`Copy shareable link`)}</h4>

                  <div className="mx-auto shareable-link-explanation">
                    <p className="mb-0 text-center">
                      {t(`This shareable link encodes all scenario parameters in the URL itself.`)}
                    </p>
                    <p className="text-center">
                      {t(`When later navigated to this link, these parameters will be restored.`)}
                    </p>
                  </div>
                </Col>
              </Row>

              <Row className="mt-3">
                <Col>
                  <InputGroup>
                    <UrlTextInput text={shareableLink} />
                    <InputGroupAddon addonType="append">
                      <ClipboardButton textToCopy={shareableLink} className="url-copy-button" />
                    </InputGroupAddon>
                  </InputGroup>
                </Col>
              </Row>
            </Col>
          </Row>

          <Row className="mt-5">
            <Col className="text-center">
              <Row>
                <Col>
                  <h4 className="text-center">{t(`Send in email or share on social media`)}</h4>
                </Col>
              </Row>

              <Row className="mt-3">
                <Col className="text-center">
                  <EmailShareButton subject={`COVID-19 Scenarios`} url={shareableLink}>
                    <div className="btn-sharing" title={`Send in an Email`}>
                      <EmailIcon size={SOCIAL_ICON_SIZE} />
                      <div>{`Email`}</div>
                    </div>
                  </EmailShareButton>

                  <TwitterShareButton url={shareableLink}>
                    <div className="btn-sharing" title={`Share on Twitter`}>
                      <TwitterIcon size={SOCIAL_ICON_SIZE} />
                      <div>{`Twitter`}</div>
                    </div>
                  </TwitterShareButton>

                  <FacebookShareButton url={shareableLink}>
                    <div className="btn-sharing" title={`Share on Facebook`}>
                      <FacebookIcon size={SOCIAL_ICON_SIZE} />
                      <div>{`Facebook`}</div>
                    </div>
                  </FacebookShareButton>

                  <WhatsappShareButton url={shareableLink}>
                    <div className="btn-sharing" title={`Share on WhatsApp`}>
                      <WhatsappIcon size={SOCIAL_ICON_SIZE} />
                      <div>{`WhatsApp`}</div>
                    </div>
                  </WhatsappShareButton>

                  <LinkedinShareButton url={shareableLink}>
                    <div className="btn-sharing" title={`Share on LinkedIn`}>
                      <LinkedinIcon size={SOCIAL_ICON_SIZE} />
                      <div>{`LinkedIn`}</div>
                    </div>
                  </LinkedinShareButton>

                  <VKShareButton url={shareableLink}>
                    <div className="btn-sharing" title={`Share on VK`}>
                      <VKIcon size={SOCIAL_ICON_SIZE} />
                      <div>{`VK`}</div>
                    </div>
                  </VKShareButton>

                  <WeiboShareButton url={shareableLink}>
                    <div className="btn-sharing" title={`Share on Weibo`}>
                      <WeiboIcon size={SOCIAL_ICON_SIZE} />
                      <div>{`Weibo`}</div>
                    </div>
                  </WeiboShareButton>
                </Col>
              </Row>
            </Col>
          </Row>
        </ModalBody>
        <ModalFooter>
          <Button className="close-button" type="button" onClick={open} title={t(`Cancel`)}>
            <div>{t(`Cancel`)}</div>
          </Button>
        </ModalFooter>
      </Modal>
    </>
  )
}

export { ModalButtonSharing }

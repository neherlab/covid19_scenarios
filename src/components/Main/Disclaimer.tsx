import React, { useEffect, useState } from 'react'
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap'
import LocalStorage, { LOCAL_STORAGE_KEYS } from '../../helpers/localStorage'

const disclaimerVersion = 0

function onDialogClosed(suppressShowAgain: boolean) {
  LocalStorage.set(LOCAL_STORAGE_KEYS.SUPPRESS_DISCLAIMER, {
    version: disclaimerVersion,
    suppressShowAgain,
  })
}

export default function DisclaimerProps() {
  const [showModal, setShowModal] = useState(false)
  const [suppressShowAgain, setsuppressShowAgain] = useState(false)

  useEffect(() => {
    const persistedSuppressShowAgain = LocalStorage.get(LOCAL_STORAGE_KEYS.SUPPRESS_DISCLAIMER)

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
    <Modal isOpen={showModal} centered toggle={toggle} onClosed={() => onDialogClosed(suppressShowAgain)}>
      <ModalHeader toggle={toggle}>COVID-19 Scenario Disclaimer</ModalHeader>
      <ModalBody>
        <div className="row mx-md-3">
          THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED
          TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
          AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF
          CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
          DEALINGS IN THE SOFTWARE.
          <br />
          <br />
          This tool uses a mathematical model to simulate a variety of COVID-19 outcomes based on user-defined
          parameters. This tool is not a medical predictor, and should be used for informative and research purposes
          only; please use the simulated results responsibly.
          <br />
          <br />
          <strong>GDPR disclaimer:</strong> This tool writes small amounts of data to your device's local storage to
          improve the user experience. Your continued use of the tool constitutes acceptance.
        </div>
        <div className="row float-right mt-sm-3 pr-md-3">
          <label className="form-check-label">
            <input
              type="checkbox"
              className="form-check-input"
              onChange={toggleChecked}
              checked={suppressShowAgain}
              aria-checked={suppressShowAgain}
            />
            Don't show again
          </label>
        </div>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={toggle}>
          Accept
        </Button>
      </ModalFooter>
    </Modal>
  )
}

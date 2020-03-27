import React, { useEffect, useState } from 'react'
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap'

const disclaimerVersion = 0
const SUPPRESS_DISCLAIMER_ID = 'suppress-disclaimer'

interface SuppressShowAgain {
  version: number
  suppressShowAgain: boolean
}

function onDialogClosed(suppressShowAgain: boolean) {
  const persist: SuppressShowAgain = {
    version: disclaimerVersion,
    suppressShowAgain,
  }

  localStorage.setItem(SUPPRESS_DISCLAIMER_ID, JSON.stringify(persist))
}

export default function DisclaimerProps() {
  const [showModal, setShowModal] = useState(false)
  const [suppressShowAgain, setsuppressShowAgain] = useState(false)

  useEffect(() => {
    const localStorageItem = localStorage.getItem(SUPPRESS_DISCLAIMER_ID)

    if (localStorageItem) {
      const suppressItem: SuppressShowAgain = JSON.parse(localStorageItem)
      setsuppressShowAgain(suppressItem.suppressShowAgain)
      setShowModal(!suppressItem.suppressShowAgain || suppressItem.version < disclaimerVersion)
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
              ariaChecked={suppressShowAgain}
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

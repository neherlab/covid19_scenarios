import React, { useState } from 'react'

import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap'

import FileUploadZone, { FileType } from './FileUploadZone'

export interface ButtonForModalProps {
  files: Map<FileType, File>
  onFilesChange(files: Map<FileType, File>): void
}

export function ComparisonModalWithButton({ files, onFilesChange }: ButtonForModalProps) {
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const toggleModalIsOpen = () => setModalIsOpen(!modalIsOpen)

  return (
    <>
      <Button className="compare-button" type="button" color="success" onClick={toggleModalIsOpen} hidden>
        {`Compare`}
      </Button>
      <Modal className="height-fit" centered size="lg" isOpen={modalIsOpen} toggle={toggleModalIsOpen}>
        <ModalHeader toggle={toggleModalIsOpen}>Modal title</ModalHeader>
        <ModalBody>
          <FileUploadZone files={files} onFilesChange={onFilesChange} />
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={toggleModalIsOpen}>
            Done
          </Button>
        </ModalFooter>
      </Modal>
    </>
  )
}

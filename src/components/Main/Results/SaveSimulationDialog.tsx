import React from 'react'
import { Button, Modal, ModalBody, ModalFooter, ModalHeader, Table } from 'reactstrap'
import { useTranslation } from 'react-i18next'
import { AlgorithmResult } from '../../../algorithms/types/Result.types'
import { Formik, FormikHelpers, Form } from 'formik'
import * as Yup from 'yup'
import { FormTextField } from '../../Form/FormTextField'

export interface SaveSimulationDialogProps {
  showModal: boolean
  toggleShowModal: () => void
  onSave: (name: string, creator: string) => void
}

interface SaveDetails {
  name: string
  owner: string
}

export default function SaveSimulationDialog({ showModal, toggleShowModal, onSave }: SaveSimulationDialogProps) {
  const { t } = useTranslation()
  const initValues: SaveDetails = {
    name: '',
    owner: '',
  }

  function handleSubmit(formValues: SaveDetails, { setSubmitting }: FormikHelpers<SaveDetails>) {
    onSave(formValues.name, formValues.owner)
  }

  return (
    <Modal className="height-fit" centered size="lg" isOpen={showModal} toggle={toggleShowModal}>
      <ModalHeader toggle={toggleShowModal}>{'Save simulation'}</ModalHeader>
      <ModalBody>
        <Formik
          initialValues={initValues}
          onSubmit={(values) => {
            onSave(values.name, values.owner)
          }}
          validationSchema={Yup.object().shape({
            name: Yup.string().required('Required'),
            owner: Yup.string().required('Required'),
          })}
        >
          {({ errors, touched, isValid, isSubmitting }) => {
            return (
              <Form className="form">
                <FormTextField identifier="name" label="Enter a scenario name" />
                <FormTextField identifier="owner" label="Enter your name or email" />
                <div className="modal-btn-container">
                  <Button color="secondary" onClick={toggleShowModal}>
                    Cancel
                  </Button>
                  <Button color="primary" type="submit" disabled={!isValid} onClick={toggleShowModal}>
                    Save
                  </Button>
                </div>
              </Form>
            )
          }}
        </Formik>
      </ModalBody>
    </Modal>
  )
}

import React from 'react'
import { useDispatch } from 'react-redux'

import { useFormik } from 'formik'
import { Form, FormGroup, Label, Input, Button, Modal, ModalHeader, ModalBody } from 'reactstrap'

import { setSignupVisible, setLoginVisible } from '../../state/ui/ui.actions'
import { signInWithEmail } from '../../helpers/cloudStorage'

function LoginForm() {
  const dispatch = useDispatch()

  const initialValues = {
    email: '',
    password: ''
  }

  const formik = useFormik({
    initialValues,
    onSubmit: async (values) => {
      await signInWithEmail(values.email, values.password) || null
      dispatch(setLoginVisible({ loginVisible: false }))
    }
  })

  const handleNewUserClick = () => {
    dispatch(setLoginVisible({ loginVisible: false }))
    dispatch(setSignupVisible({ signupVisible: true }))
  }

  return (
    <Modal isOpen={true} toggle={() => dispatch(setLoginVisible({ loginVisible: false }))}>
      <ModalHeader toggle={() => dispatch(setLoginVisible({ loginVisible: false }))}>
        Log in
      </ModalHeader>
      <ModalBody>
        <Form onSubmit={formik.handleSubmit}>
          <FormGroup>
            <Label>E-mail</Label>
            <Input 
              id="login-form-email"
              name="email"
              onChange={formik.handleChange}
              value={formik.values.email}
              type="text"
            />
          </FormGroup>
          <FormGroup>
            <Label>Password</Label>
            <Input 
              id="login-form-password"
              name="password"
              onChange={formik.handleChange} 
              value={formik.values.password}
              type="text"
            />
          </FormGroup>
          <span>
            <Button type="submit" color="primary">
              Login
            </Button>
          </span>
          <span>
            <Button type="button" color="primary" onClick={handleNewUserClick}>
              New user?
            </Button>
          </span>
        </Form>
      </ModalBody>
    </Modal>
  )
}

export { LoginForm }

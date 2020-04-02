import React from 'react'
import { useDispatch } from 'react-redux'

import { useFormik } from 'formik'
import { Card, CardBody, Col, Form, FormGroup, Label, Input, Button } from 'reactstrap'

import { setSignupVisible } from '../../state/ui/ui.actions'
import { createUserWithEmail } from '../../helpers/cloudStorage'

function SignupForm() {
  const dispatch = useDispatch()

  const initialValues = {
    email: '',
    password: '',
    repeatPassword: ''
  }

  const formik = useFormik({
    initialValues,
    onSubmit: async (values) => {
      if (values.password === values.repeatPassword) {
        await createUserWithEmail(values.email, values.password)
        dispatch(setSignupVisible({ signupVisible: false }))
      }
      else {
        throw new Error('Passwords do not match')
      }
    }
  })


  return (
    <div className="form-container" onClick={() => dispatch(setSignupVisible({ signupVisible: false }))}>
      <Card>
        <CardBody>
          <Col>
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
                  type="password"
                />
              </FormGroup>
              <FormGroup>
                <Label>Repeat password</Label>
                <Input 
                  id="login-form-repeat-password"
                  name="repeatPassword"
                  onChange={formik.handleChange}
                  value={formik.values.repeatPassword}
                  type="password"
                />
              </FormGroup>
              <Button type="submit">
                Sign up & login
              </Button>
            </Form>
          </Col>
        </CardBody>
      </Card>
    </div>
  )
}

export { SignupForm }

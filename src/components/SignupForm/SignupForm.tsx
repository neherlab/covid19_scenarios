import React from 'react'

import { useFormik } from 'formik'
import { Card, CardBody, Col, Form, FormGroup, Label, Input, Button } from 'reactstrap'

import { createUserWithEmail } from '../../helpers/cloudStorage'

function SignupForm() {
  const initialValues = {
    email: '',
    password: '',
    repeatPassword: ''
  }

  const formik = useFormik({
    initialValues,
    onSubmit: (values) => {
      if (values.password === values.repeatPassword) {
        createUserWithEmail(values.email, values.password)
      }
      else {
        throw new Error('Passwords do not match')
      }
    }
  })


  return (
    <div className="form-container">
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

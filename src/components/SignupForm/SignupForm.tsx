import React from 'react'

import { useFormik } from 'formik'
import { Card, CardBody, Col, Form, FormGroup, Label, Input, Button } from 'reactstrap'

function SignupForm() {
  const initialValues = {
    email: '',
    password: '',
    repeatPassword: ''
  }

  const formik = useFormik({
    initialValues,
    onSubmit: (values) => {
      alert(JSON.stringify(values))
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
                  type="text"
                />
              </FormGroup>
              <FormGroup>
                <Label>Password</Label>
                <Input 
                  id="login-form-repeat-password"
                  name="repeat-password"
                  onChange={formik.handleChange}
                  value={formik.values.repeatPassword}
                  type="text"
                />
              </FormGroup>
              <Button>Login</Button>
            </Form>
          </Col>
        </CardBody>
      </Card>
    </div>
  )
}

export { SignupForm }

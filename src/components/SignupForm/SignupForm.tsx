import React from 'react'
import { useDispatch } from 'react-redux'

import { useFormik } from 'formik'
import { Card, CardBody, Col, Form, FormGroup, Label, Input, Button } from 'reactstrap'

import { createUserWithEmail } from '../../helpers/cloudStorage'
import { setCurrentUserUid } from '../../state/user/user.actions'

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
        const uid = await createUserWithEmail(values.email, values.password)
        //dispatch(setCurrentUserUid({ currentUserUid: uid }))
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

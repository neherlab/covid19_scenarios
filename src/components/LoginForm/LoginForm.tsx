import React from 'react'
import { useDispatch } from 'react-redux'

import { useFormik } from 'formik'
import { Card, CardBody, Col, Form, FormGroup, Label, Input, Button } from 'reactstrap'

import { setCurrentUserUid } from '../../state/user/user.actions'
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
      const uid = await signInWithEmail(values.email, values.password) || null
      //dispatch(setCurrentUserUid({ currentUserUid: uid }))
    }
  })

  const handleNewUserClick = () => {
    dispatch(setLoginVisible({ loginVisible: false }))
    dispatch(setSignupVisible({ signupVisible: true }))
  }

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
              <Button type="submit">
                Login
              </Button>
              <Button type="button" onClick={handleNewUserClick}>
                New user?
              </Button>
            </Form>
          </Col>
        </CardBody>
      </Card>
    </div>
  )
}

export { LoginForm }

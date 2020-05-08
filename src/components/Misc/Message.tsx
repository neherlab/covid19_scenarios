import { UncontrolledAlert, UncontrolledAlertProps } from 'reactstrap'
import React from 'react'

export default function Message(props: UncontrolledAlertProps) {
  const { children } = props
  return children ? <UncontrolledAlert {...props}>{children}</UncontrolledAlert> : null
}

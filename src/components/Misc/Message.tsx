import { UncontrolledAlert, UncontrolledAlertProps } from 'reactstrap'
import React from 'react'

export default function Message(props: UncontrolledAlertProps) {
  return props.children ? <UncontrolledAlert {...props}>{props.children}</UncontrolledAlert> : null
}

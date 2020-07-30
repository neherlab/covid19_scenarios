import React from 'react'
import { Card, CardBody } from 'reactstrap'

import Popover from '../Wrappers/Popover'

export interface FormHelpButtonProps {
  help?: string | React.ReactNode
}

export default function FormHelpButton({ help }: FormHelpButtonProps) {
  return (
    <Popover preventDefault stopPropagation style={{ border: 'none' }}>
      <button className="btn btn-secondary help-button ml-2" type="button" aria-label="help">
        <span className="help-button-icon">{'?'}</span>
      </button>
      <Card className="card-help">
        <CardBody className="card-body-help">
          <p>{help}</p>
        </CardBody>
      </Card>
    </Popover>
  )
}

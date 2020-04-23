import React from 'react'
import { Card, CardBody } from 'reactstrap'

import { FaQuestion } from 'react-icons/fa'
import Popover from '../Wrappers/Popover'

import './FormHelpButton.scss'

export interface FormHelpButtonProps {
  help?: string | React.ReactNode
}

export default function FormHelpButton({ help }: FormHelpButtonProps) {
  return (
    <Popover preventDefault stopPropagation>
      <button className="btn btn-secondary help-button ml-2" type="button" aria-label="help">
        <FaQuestion className="help-button-icon" />
      </button>
      <Card className="card--help">
        <CardBody>
          <p>{help}</p>
        </CardBody>
      </Card>
    </Popover>
  )
}

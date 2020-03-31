import React from 'react'

import { Button, Card, CardBody, CardHeader, UncontrolledPopover } from 'reactstrap'

import { onlyText } from 'react-children-utilities'

import { FaQuestion } from 'react-icons/fa'

import './FormHelpButton.scss'

function safeId(id: string) {
  return id.replace('.', '-')
}

function getText(label: any) {
  if (typeof label === 'string') {
    return label
  } else if (label.type === 'h2' || label.type === 'h3') {
    return onlyText(label)
  } else if (label.props && label.props.children) {
    return onlyText(label.props.children[0])
  } else {
    return ''
  }
}

export interface FormHelpButtonProps {
  identifier: string
  label: string | React.ReactNode
  help?: string | React.ReactNode
}

export default function FormHelpButton({ identifier, label, help }: FormHelpButtonProps) {
  return (
    <>
      <Button
        id={safeId(identifier)}
        className="help-button ml-2"
        type="button"
        aria-label="help"
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
        }}
      >
        <FaQuestion className="help-button-icon" />
      </Button>
      <UncontrolledPopover placement="right" target={safeId(identifier)} trigger="legacy" hideArrow>
        <Card className="card--help">
          <CardBody>
            {label && <h4>{getText(label)}</h4>}
            <p>{help}</p>
          </CardBody>
        </Card>
      </UncontrolledPopover>
    </>
  )
}

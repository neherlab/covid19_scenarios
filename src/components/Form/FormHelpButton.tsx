import React from 'react'

import { Button, Card, CardBody, UncontrolledPopover } from 'reactstrap'

import { FaQuestion } from 'react-icons/fa'

import './FormHelpButton.scss'

function safeId(id: string) {
  return id.replace('.', '-')
}

export interface HelpProps {
  label: string
  text: string
}

export function help(label:string = "", text:string = "") : HelpProps {
  return { label, text }
}

export interface FormHelpButtonProps {
  identifier: string
  help?: HelpProps
}

export default function FormHelpButton({ identifier, help }: FormHelpButtonProps) {
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
            <h4>{help.label}</h4>
            <p>{help.text}</p>
          </CardBody>
        </Card>
      </UncontrolledPopover>
    </>
  )
}

import React from 'react'

import { Button, Card, CardBody, CardHeader, UncontrolledPopover } from 'reactstrap'

import { FaQuestion } from 'react-icons/fa'

import './FormHelpButton.scss'

function safeId(id: string) {
  return id.replace('.', '-')
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
        className="help-button"
        type="button"
        aria-label="help"
        onClick={e => {
          if (!popoverOpen) {
            e.currentTarget.focus()
          }
          e.preventDefault()
          e.stopPropagation()
        }}
      >
        <FaQuestion className="help-button-icon" />
      </Button>
      <UncontrolledPopover placement="right" target={safeId(identifier)} trigger="legacy" hideArrow>
        <Card>
          <CardHeader>{label}</CardHeader>
          <CardBody>{help}</CardBody>
        </Card>
      </UncontrolledPopover>
    </>
  )
}

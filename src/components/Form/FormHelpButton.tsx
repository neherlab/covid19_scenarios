import React, { useState } from 'react'

import { Button, Card, CardBody, CardHeader, Popover } from 'reactstrap'

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
  const [popoverOpen, setPopoverOpen] = useState(false)

  return (
    <>
      <Button
        id={safeId(identifier)}
        className="help-button"
        type="button"
        onClick={e => {
          e.preventDefault()
          e.stopPropagation()
        }}
        onFocus={() => setPopoverOpen(true)}
        onBlur={() => setPopoverOpen(false)}
      >
        <FaQuestion className="help-button-icon" />
      </Button>
      <Popover placement="right" target={safeId(identifier)} trigger="focus" hideArrow isOpen={popoverOpen}>
        <Card>
          <CardHeader>{label}</CardHeader>
          <CardBody>{help}</CardBody>
        </Card>
      </Popover>
    </>
  )
}

import React, { useState } from 'react'
import { useOnClickOutside } from 'usehooks'
import { Card, CardBody, CardHeader, Popover } from 'reactstrap'
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

  const toggle = () => setPopoverOpen(!popoverOpen)

  return (
    <>
      <div id={safeId(identifier)} />

      <FaQuestion className="help-button help-button-icon" onClick={toggle} onFocus={toggle} onBlur={toggle} />

      <Popover
        placement="auto"
        target={safeId(identifier)}
        trigger="focus"
        hideArrow
        isOpen={popoverOpen}
        toggle={toggle}
      >
        <Card>
          <CardHeader>{label}</CardHeader>
          <CardBody>{help}</CardBody>
        </Card>
      </Popover>
    </>
  )
}

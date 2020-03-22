import React, { useState, useRef } from 'react'
import { Card, CardBody, CardHeader, Popover } from 'reactstrap'
import { FaQuestion } from 'react-icons/fa'
import useOnClickOutside from 'use-onclickoutside'

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
  const iconRef = useRef(null)
  useOnClickOutside(iconRef, () => setPopoverOpen(false))

  const toggle = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setPopoverOpen(!popoverOpen)
  }

  return (
    <>
      <div ref={iconRef} role="button" onClick={toggle} onKeyDown={() => setPopoverOpen(!popoverOpen)} tabIndex={0}>
        <FaQuestion id={safeId(identifier)} className="help-button help-button-icon" />
      </div>

      <Popover placement="auto" target={safeId(identifier)} trigger="click legacy" hideArrow isOpen={popoverOpen}>
        <Card>
          <CardHeader>{label}</CardHeader>
          <CardBody>{help}</CardBody>
        </Card>
      </Popover>
    </>
  )
}

import React, { useState, ReactNode } from 'react'
import Popper from 'popper.js'
import { Button, Popover, PopoverHeader, PopoverBody } from 'reactstrap'
import { copyToClipboard } from '../../helpers/copyToClipboard'

interface ClipboardButtonProps {
  disabled: boolean
  children: ReactNode
  textToCopy?: string
  popoverBody: ReactNode
  popoverHeader?: string
  popoverPlacement?: Popper.Placement
  popoverTarget: string | HTMLElement | React.RefObject<HTMLElement>
}

/**
 * When clicked, copies textToCopy to clipboard
 * The user could then paste this text somewhere else
 */
export default function ClipboardButton({
  disabled,
  children,
  textToCopy,
  popoverBody = '',
  popoverHeader = '',
  popoverPlacement = 'bottom',
  popoverTarget,
}: ClipboardButtonProps) {
  const [popoverOpen, setPopoverOpen] = useState(false)
  const closePopover = () => setPopoverOpen(false)
  const onClick = () => {
    if (textToCopy) {
      copyToClipboard(String(textToCopy))
      setPopoverOpen(true)
    }
  }

  return (
    <>
      <Button disabled={disabled} onClick={onClick} color="primary" size="sm">
        {children}
      </Button>
      <Popover placement={popoverPlacement} open={popoverOpen} target={popoverTarget} ontoggle={closePopover}>
        <PopoverHeader>{popoverHeader}</PopoverHeader>
        <PopoverBody>{popoverBody}</PopoverBody>
      </Popover>
    </>
  )
}

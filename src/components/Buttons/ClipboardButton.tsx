import React, { useState, ReactNode } from 'react'
import { Button } from 'reactstrap'
import { copyToClipboard } from '../../helpers/copyToClipboard'

interface ClipboardButtonProps {
  disabled: boolean
  children: ReactNode
  doneMessage?: ReactNode
  textToCopy?: string
}

/**
 * When clicked, copies textToCopy to clipboard
 * The user could then paste this text somewhere else
 */
const ClipboardButton = ({ disabled, children, textToCopy, doneMessage = 'Copied!' }: ClipboardButtonProps) => {
  const [popoverOpen, setPopoverOpen] = useState(false)
  const onClick = () => {
    if (textToCopy) {
      copyToClipboard(String(textToCopy))
      setPopoverOpen(true)
    }
  }

  return (
    <>
      <Button disabled={disabled} onClick={onClick} color="primary" size="sm">
        {popoverOpen ? doneMessage : children}
      </Button>
    </>
  )
}

export default ClipboardButton

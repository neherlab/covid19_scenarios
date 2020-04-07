import React, { ReactNode } from 'react'
import { Button } from 'reactstrap'

interface LinkButtonProps {
  children: ReactNode
  className?: string
  color?: string
  disabled?: boolean
  href?: string
  size?: string
  target: '_blank' | '_self' | '_parent' | '_top'
  type?: 'submit' | 'reset' | 'button'
  onClick?: () => void
}

const LinkButton = ({
  className,
  color = 'primary',
  children,
  disabled = false,
  href,
  onClick,
  target = '_self',
  type = 'button',
  size = 'sm',
}: LinkButtonProps) => {
  return (
    <a href={href} target={target}>
      <Button disabled={disabled} onClick={onClick} className={className} type={type} color={color} size={size}>
        {children}
      </Button>
    </a>
  )
}

export default LinkButton

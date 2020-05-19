import React from 'react'

import { Button, ButtonProps } from 'reactstrap'

interface LinkButtonProps extends React.PropsWithChildren<ButtonProps> {
  href?: string
  target: '_blank' | '_self' | '_parent' | '_top'
}

const LinkButton = ({ href, target = '_self', type = 'button', children, ...restProps }: LinkButtonProps) => {
  return (
    <a href={href} target={target}>
      <Button type={type} {...restProps}>
        {children}
      </Button>
    </a>
  )
}

export default LinkButton

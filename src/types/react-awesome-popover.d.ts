import * as React from 'react'

export = Popover

// eslint-disable-next-line react/prefer-stateless-function
declare class Popover extends React.Component<Popover.PopoverProps> {}

declare namespace Popover {
  interface PopoverProps extends React.HTMLAttributes<HTMLElement> {
    placement?: string
    overlayColor?: string
    preventDefault?: boolean
    stopPropagation?: boolean
    arrowProps?: object
  }
}

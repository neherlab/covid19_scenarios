import React from 'react'

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

export default Popover

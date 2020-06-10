import React from 'react'

export = Popover

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

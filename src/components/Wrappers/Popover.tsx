import React from 'react'

import Popover from 'react-awesome-popover'

const WrappedPopover = (rest: Popover.PopoverProps) => (
  <Popover className="nl-popover" overlayColor="none" arrowProps={{ className: 'd-none' }} {...rest} />
)

export default WrappedPopover

import React, { HTMLProps } from 'react'

import classNames from 'classnames'
import { Row, Col } from 'reactstrap'

export function MdxWrapper<T extends HTMLProps<HTMLDivElement>>(props: T) {
  const { children, className } = props
  return (
    <div {...props} className={classNames(className, 'container container-fluid mdx-wrapper my-2 px-3 py-3')}>
      <Row>
        <Col>{children}</Col>
      </Row>
    </div>
  )
}

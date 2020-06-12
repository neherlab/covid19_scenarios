import React, { useRef } from 'react'

import classNames from 'classnames'
import { Input, InputProps } from 'reactstrap'

export interface UrlTextInputProps extends InputProps {
  text: string
}

function UrlTextInput({ text, className, ...restProps }: UrlTextInputProps) {
  const inputRef = useRef<HTMLInputElement>()

  function selectAll() {
    const input = inputRef?.current
    if (!input) {
      return
    }
    input.select()
  }

  return (
    <Input
      className={classNames('form-control', 'url-text-input', 'h-100', className)}
      type="text"
      value={text}
      onFocus={selectAll}
      onDoubleClick={selectAll}
      onClick={selectAll}
      // NOTE: This is a bug in @types/reactstrap typings:
      // it claims that `innerRef` is `React.Ref` while in reality it is `React.RefObject`
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      innerRef={inputRef}
      readOnly
      {...restProps}
    />
  )
}

export { UrlTextInput }

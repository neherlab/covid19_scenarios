import React, { useRef } from 'react'

import classNames from 'classnames'
import { Input } from 'reactstrap'

export interface UrlTextInputProps {
  text: string
}

function UrlTextInput({ text }: UrlTextInputProps) {
  const inputRef: React.RefObject<HTMLInputElement | undefined> = useRef(undefined)

  function selectAll() {
    const input = inputRef?.current
    if (!input) {
      return
    }
    input.select()
  }

  return (
    <Input
      className={classNames('form-control', 'url-text-input')}
      type="text"
      value={text}
      onFocus={selectAll}
      onDoubleClick={selectAll}
      onClick={selectAll}
      // NOTE: This is a bug in @types/reactstrap typings:
      // it claims that `innerRef` is `React.Ref` while in reality it is `React.RefObject`
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      innerRef={inputRef}
      readOnly
    />
  )
}

export { UrlTextInput }

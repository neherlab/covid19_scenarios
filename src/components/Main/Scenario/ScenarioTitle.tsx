import React, { useState, useRef, useEffect } from 'react'

import { isEmpty } from 'lodash'

import classNames from 'classnames'
import { If, Then, Else } from 'react-if'
import { Button, Input, InputGroup, InputGroupAddon } from 'reactstrap'
import { MdEdit, MdCheck } from 'react-icons/md'

export interface ScenarioTitleProps {
  title: string
  onRename(title: string): void
}

function ScenarioTitle({ title, onRename }: ScenarioTitleProps) {
  const inputRef: React.RefObject<HTMLInputElement | undefined> = useRef(undefined)
  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState(title)

  useEffect(() => {
    setName(title)
  }, [title])

  function handleStartEditing() {
    setIsEditing(true)

    const input = inputRef?.current
    if (!input) {
      return
    }

    // focus and select the input text
    input.focus()
    input.select()
  }

  function handleKeyDown(event: React.KeyboardEvent) {
    if (isEditing && event.keyCode === 27) {
      event.preventDefault()
      handleRename()
    }
  }

  function handleRename() {
    if (!name || isEmpty(name)) {
      return
    }

    onRename(name)
    setIsEditing(false)

    const input = inputRef?.current
    if (!input) {
      return
    }

    // deselect and remove focus
    window?.getSelection()?.empty()
    window?.getSelection()?.removeAllRanges()
    input.blur()
  }

  return (
    <InputGroup>
      <Input
        className={classNames('form-control', 'scenario-title-input')}
        style={{ display: 'inline', width: inputRef?.current?.scrollWidth }}
        type="text"
        readOnly={!isEditing}
        value={name}
        onChange={(event) => setName(event.target.value)}
        onBlur={handleRename}
        onDoubleClick={handleStartEditing}
        onKeyDown={handleKeyDown}
        // NOTE: This is a bug in @types/reactstrap typings:
        // it claims that `innerRef` is `React.Ref` while in reality it is `React.RefObject`
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        innerRef={inputRef}
      />
      <InputGroupAddon addonType="append">
        <If condition={!isEditing}>
          <Then>
            <Button className="scenario-title-btn-edit" onClick={handleStartEditing}>
              <MdEdit />
            </Button>
          </Then>
          <Else>
            <Button className="scenario-title-btn-confirm" onClick={handleRename}>
              <MdCheck />
            </Button>
          </Else>
        </If>
      </InputGroupAddon>
    </InputGroup>
  )
}

export { ScenarioTitle }

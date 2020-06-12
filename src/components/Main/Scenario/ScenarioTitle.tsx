import React, { useState, useRef, useEffect } from 'react'

import { isEmpty } from 'lodash'

import classNames from 'classnames'
import { If, Then, Else } from 'react-if'
import { Button, Input, InputGroup, InputGroupAddon } from 'reactstrap'
import { MdEdit, MdCheck, MdCancel } from 'react-icons/md'

export interface ScenarioTitleProps {
  title: string
  onRename(title: string): void
}

function ScenarioTitle({ title, onRename }: ScenarioTitleProps) {
  const inputRef = useRef<HTMLInputElement>()
  const [isEditing, setIsEditing] = useState(false)
  const [currentName, setCurrentName] = useState(title)
  const [previousName, setPreviousName] = useState(title)

  useEffect(() => {
    setCurrentName(title)
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
    if (isEditing) {
      if (event.keyCode === 13 /* Enter */) {
        event.preventDefault()
        handleRename()
      } else if (event.keyCode === 27 /* Escape */) {
        event.preventDefault()
        handleCancel()
      }
    }
  }

  function handleRename() {
    if (!currentName || isEmpty(currentName)) {
      return
    }

    onRename(currentName)
    setPreviousName(currentName)
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

  function handleCancel() {
    setCurrentName(previousName)
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
    <InputGroup className="scenario-title-input-group">
      <Input
        className={classNames('form-control', 'scenario-title-input', !isEditing && 'readonly')}
        style={{ display: 'inline', width: inputRef?.current?.scrollWidth }}
        type="text"
        readOnly={!isEditing}
        value={currentName}
        onChange={(event) => setCurrentName(event.target.value)}
        onDoubleClick={handleStartEditing}
        onKeyDown={handleKeyDown}
        // NOTE: This is a bug in @types/reactstrap typings:
        // it claims that `innerRef` is `React.Ref` while in reality it is `React.RefObject`
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        innerRef={inputRef}
      />
      <InputGroupAddon addonType="append">
        <If condition={!isEditing}>
          <Then>
            <Button
              color="transparent"
              className="scenario-title-btn scenario-title-btn-edit"
              onClick={handleStartEditing}
            >
              <MdEdit className="scenario-title-icon scenario-title-icon-edit" />
            </Button>
          </Then>
          <Else>
            <Button color="transparent" className="scenario-title-btn scenario-title-btn-cancel" onClick={handleCancel}>
              <MdCancel className="scenario-title-icon scenario-title-icon-cancel" />
            </Button>
            <Button
              color="transparent"
              className="scenario-title-btn scenario-title-btn-confirm"
              onClick={handleRename}
            >
              <MdCheck className="scenario-title-icon scenario-title-icon-confirm" />
            </Button>
          </Else>
        </If>
      </InputGroupAddon>
    </InputGroup>
  )
}

export { ScenarioTitle }

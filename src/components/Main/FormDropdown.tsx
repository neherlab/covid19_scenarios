import React, { useState } from 'react'

import Downshift from 'downshift'
import { FormGroup } from 'reactstrap'

import './FormDropdown.scss'

export interface FormDropdownItem {
  value: string
}

export interface FormDropdownProps {
  id: string
  label: string
  values: string[]
  defaultValue: string
  onChange(value: string): void
}

export default function FormDropdown({
  id,
  label,
  values,
  defaultValue,
  onChange,
}: FormDropdownProps) {
  const items = values.map(value => ({ value }))
  const initialItem = { value: defaultValue }

  return (
    <Downshift
      onChange={(item: FormDropdownItem | null) =>
        onChange(item?.value ?? defaultValue)
      }
      itemToString={item => item?.value ?? ''}
      initialSelectedItem={initialItem}
    >
      {({
        getInputProps,
        getItemProps,
        getLabelProps,
        getMenuProps,
        isOpen,
        inputValue,
        highlightedIndex,
        selectedItem,
        getRootProps,
      }) => {
        return (
          <FormGroup>
            <label {...getLabelProps()} htmlFor={id} className="form-text">
              {label}
            </label>

            <div
              {...getRootProps({}, { suppressRefError: true })}
              className="form-dropdown-root"
            >
              <input
                className="form-dropdown-input form-control"
                {...getInputProps()}
              />
            </div>

            <ul className="form-dropdown-list" {...getMenuProps()}>
              {isOpen
                ? items
                    .filter(
                      item => !inputValue || item.value.includes(inputValue),
                    )
                    .map((item, index) => {
                      const highlighted =
                        highlightedIndex === index ? 'highlighted' : ''

                      return (
                        <li
                          {...getItemProps({
                            key: item.value,
                            index,
                            item,
                          })}
                          className={`form-dropdown-item ${highlighted}`}
                        >
                          {item.value}
                        </li>
                      )
                    })
                : null}
            </ul>
          </FormGroup>
        )
      }}
    </Downshift>
  )
}

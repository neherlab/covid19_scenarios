import React, { useState, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { setLoginVisible } from '../../state/ui/ui.actions'

import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap'

import LanguageSwitcher from '../LanguageSwitcher'
import './UserMenu.scss'

function UserMenu() {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dispatch = useDispatch()

  const toggle = () => setDropdownOpen(!dropdownOpen)

  const handleLoginClick = () => {
    setDropdownOpen(false)
    dispatch(setLoginVisible({ loginVisible: true }))
  }

  return (
    <Dropdown className="user-menu-dropdown" isOpen={dropdownOpen} toggle={toggle}>
      <DropdownToggle caret>
        USER
      </DropdownToggle>
      <DropdownMenu>
        <DropdownItem onClick={handleLoginClick}>
          Login
        </DropdownItem>
        <DropdownItem>
          Download my data
        </DropdownItem>
        <DropdownItem>
          Clear my data
        </DropdownItem>
        <DropdownItem>
          <LanguageSwitcher />
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  )
}

export { UserMenu }

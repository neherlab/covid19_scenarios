import React, { useState, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setLoginVisible } from '../../state/ui/ui.actions'
import { signOut } from '../../helpers/cloudStorage'
import { State } from '../../state/reducer'

import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap'

import LanguageSwitcher from '../LanguageSwitcher'
import './UserMenu.scss'

function UserMenu() {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dispatch = useDispatch()

  const toggle = () => setDropdownOpen(!dropdownOpen)

  const userIsLogged = useSelector(({ user }): State => user.currentUserUid !== null ? true : false)

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
        <DropdownItem onClick={userIsLogged ? signOut : handleLoginClick}>
          {userIsLogged ? 'Logout' : 'Login'}
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

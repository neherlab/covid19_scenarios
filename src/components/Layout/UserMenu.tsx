import React, { useState, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setLoginVisible } from '../../state/ui/ui.actions'
import { signOut } from '../../helpers/cloudStorage'
import { State } from '../../state/reducer'

import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap'

import './UserMenu.scss'

function UserMenu() {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dispatch = useDispatch()

  const toggle = () => setDropdownOpen(!dropdownOpen)

  const userPhoto = useSelector(({ user }): State => user.currentUserPhoto)
  console.log(userPhoto)

  const handleLoginClick = () => {
    setDropdownOpen(false)
    dispatch(setLoginVisible({ loginVisible: true }))
  }

  return (
    <Dropdown className="user-menu-dropdown" isOpen={dropdownOpen} toggle={toggle}>
      <DropdownToggle color="black">
        {userPhoto !== null ? (
          <img className="user-menu-photo" src={userPhoto} />
        ) : (
          <img className="user-menu-photo" src={userPhoto} />
        ) /* Change the last picture to some appropriate placeholder */}
      </DropdownToggle>
      <DropdownMenu>
        <DropdownItem onClick={userPhoto !== null ? signOut : handleLoginClick}>
          {userPhoto !== null ? 'Logout' : 'Login'}
        </DropdownItem>
        <DropdownItem>Download my data</DropdownItem>
        <DropdownItem>Clear my data</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  )
}

export { UserMenu }

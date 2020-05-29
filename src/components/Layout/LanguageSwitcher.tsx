import React, { useState } from 'react'

import classNames from 'classnames'
import { connect } from 'react-redux'
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem, DropdownProps } from 'reactstrap'
import { ActionCreator } from 'typescript-fsa'
import { MdCheck } from 'react-icons/md'

import { LocaleWithKey, localesArray, LocaleKey } from '../../i18n/i18n'

import type { State } from '../../state/reducer'
import { selectLocale } from '../../state/settings/settings.selectors'
import { setLocale } from '../../state/settings/settings.actions'

export interface LanguageSwitcherProps extends DropdownProps {
  currentLocale: LocaleWithKey
  setLocale: ActionCreator<LocaleKey>
}

const mapStateToProps = (state: State) => ({
  currentLocale: selectLocale(state),
})

const mapDispatchToProps = {
  setLocale,
}

export const LanguageSwitcher = connect(mapStateToProps, mapDispatchToProps)(LanguageSwitcherDisconnected)

export function LanguageSwitcherDisconnected({ currentLocale, setLocale, ...restProps }: LanguageSwitcherProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const toggle = () => setDropdownOpen((prevState) => !prevState)
  const setLocaleLocal = (key: LocaleKey) => () => setLocale(key)

  return (
    <Dropdown isOpen={dropdownOpen} toggle={toggle} {...restProps}>
      <DropdownToggle nav caret>
        <LanguageSwitcherItem locale={currentLocale} />
      </DropdownToggle>
      <DropdownMenu positionFixed>
        {localesArray.map((locale) => {
          const isCurrent = locale.key === currentLocale.key
          return (
            <DropdownItem key={locale.key} onClick={setLocaleLocal(locale.key)}>
              {isCurrent ? <MdCheck /> : <span className="language-switcher-check-filler" />}
              <LanguageSwitcherItem locale={locale} />
            </DropdownItem>
          )
        })}
      </DropdownMenu>
    </Dropdown>
  )
}

export function LanguageSwitcherItem({ locale }: { locale: LocaleWithKey }) {
  return (
    <>
      <span className={classNames(`flag-icon flag-icon-${locale.flag}`)} />
      <span>{locale.name}</span>
    </>
  )
}

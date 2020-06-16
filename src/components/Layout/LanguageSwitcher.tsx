import React, { useState } from 'react'

import { connect } from 'react-redux'
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem, DropdownProps } from 'reactstrap'
import { ActionCreator } from 'typescript-fsa'

import { LocaleWithKey, localesArray, LocaleKey } from 'src/i18n/i18n'

import type { State } from 'src/state/reducer'
import { selectLocale } from 'src/state/settings/settings.selectors'
import { setLocale } from 'src/state/settings/settings.actions'

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
    <Dropdown className="language-switcher" isOpen={dropdownOpen} toggle={toggle} {...restProps}>
      <DropdownToggle nav caret>
        <LanguageSwitcherItem locale={currentLocale} />
      </DropdownToggle>
      <DropdownMenu className="language-switcher-menu" positionFixed>
        {localesArray.map((locale) => {
          const isCurrent = locale.key === currentLocale.key
          return (
            <DropdownItem active={isCurrent} key={locale.key} onClick={setLocaleLocal(locale.key)}>
              <LanguageSwitcherItem locale={locale} />
            </DropdownItem>
          )
        })}
      </DropdownMenu>
    </Dropdown>
  )
}

export function LanguageSwitcherItem({ locale }: { locale: LocaleWithKey }) {
  const { Flag, name } = locale
  return (
    <>
      <Flag className="language-switcher-flag" />
      <span className="pl-2">{name}</span>
    </>
  )
}

import React, { useState } from 'react'
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap'
import i18next from 'i18next'

import langs from '../../langs'

import LocalStorage, { LOCAL_STORAGE_KEYS } from '../../helpers/localStorage'

import './LanguageSwitcher.scss'

const DEFAULT_LANG = 'en'

/**
 * Returns our active lang loaded from localstorage
 */
export function getCurrentLang(): string {
  const storedLang = LocalStorage.get<string>(LOCAL_STORAGE_KEYS.LANG)
  return storedLang ?? DEFAULT_LANG
}

/**
 * Displays a Styled span with the lang name.
 * Flag next?
 * @param lang
 */
function Lang({ lang }: { lang: Lang }) {
  return <span className="language-switcher-lang">{lang.name}</span>
}

export default function LanguageSwitcher() {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const toggle = () => setDropdownOpen((prevState) => !prevState)
  const selectedLang = getCurrentLang()

  return (
    <Dropdown isOpen={dropdownOpen} toggle={toggle} className="pull-right" data-testid="LanguageSwitcher">
      <DropdownToggle caret>
        <Lang lang={langs[selectedLang]} />
      </DropdownToggle>
      <DropdownMenu>
        {Object.keys(langs).map((key) => (
          <DropdownItem
            key={key}
            onClick={() => {
              i18next.changeLanguage(langs[key].lang, () => {
                LocalStorage.set(LOCAL_STORAGE_KEYS.LANG, langs[key].lang)
              })
            }}
          >
            <Lang lang={langs[key]} />
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  )
}

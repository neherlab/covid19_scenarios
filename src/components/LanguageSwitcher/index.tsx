import React, { useState } from 'react'
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap'
import i18next from 'i18next'

import langs, { Lang as LANG, LangType } from '../../langs'

import LocalStorage, { LOCAL_STORAGE_KEYS } from '../../helpers/localStorage'

import './LanguageSwitcher.scss'

const DEFAULT_LANG = LANG.EN

/**
 * Returns our active lang loaded from localstorage
 */
export function getCurrentLang(): LANG {
  const storedLang = LocalStorage.get<LANG>(LOCAL_STORAGE_KEYS.LANG)
  return storedLang ?? DEFAULT_LANG
}

/**
 * Displays a Styled span with the lang name.
 * Flag next?
 * @param lang
 */
function Lang({ lang }: { lang: LangType }) {
  return <span className="language-switcher-lang">{lang.name}</span>
}

export default function LanguageSwitcher() {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const toggle = () => setDropdownOpen((prevState) => !prevState)
  const selectedLang = getCurrentLang()
  const langKeys = Object.keys(langs) as LANG[]

  return (
    <Dropdown isOpen={dropdownOpen} toggle={toggle} className="pull-right" data-testid="LanguageSwitcher">
      <DropdownToggle caret>
        <Lang lang={langs[selectedLang]} />
      </DropdownToggle>
      <DropdownMenu>
        {langKeys.map((key) => (
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

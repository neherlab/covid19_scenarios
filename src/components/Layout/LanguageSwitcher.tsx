import React, { useState } from 'react'
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap'
import i18next from 'i18next'

import SupportedLocales, { Locale, SupportedLocale } from '../../langs'

import LocalStorage, { LOCAL_STORAGE_KEYS } from '../../helpers/localStorage'

import './LanguageSwitcher.scss'

const DEFAULT_LOCALE: SupportedLocale = 'en'

/**
 * Returns our active lang loaded from localstorage
 */
export function getCurrentLang(): SupportedLocale {
  const storedLang = LocalStorage.get<SupportedLocale>(LOCAL_STORAGE_KEYS.LANG)
  return storedLang ?? DEFAULT_LOCALE
}

/**
 * Displays a Styled span with the lang name.
 * Flag next?
 * @param lang
 */
function Lang({ lang }: { lang: Locale }) {
  return <span className="language-switcher-lang">{lang.name}</span>
}

export default function LanguageSwitcher() {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const toggle = () => setDropdownOpen((prevState) => !prevState)
  const selectedLang = getCurrentLang()

  return (
    <Dropdown isOpen={dropdownOpen} toggle={toggle} className="pull-right" data-testid="LanguageSwitcher">
      <DropdownToggle caret>
        <Lang lang={SupportedLocales[selectedLang]} />
      </DropdownToggle>
      <DropdownMenu>
        {(Object.keys(SupportedLocales) as SupportedLocale[]).map((key: SupportedLocale) => (
          <DropdownItem
            key={key}
            onClick={() => {
              i18next.changeLanguage(SupportedLocales[key].lang, () => {
                LocalStorage.set(LOCAL_STORAGE_KEYS.LANG, SupportedLocales[key].lang)
              })
            }}
          >
            <Lang lang={SupportedLocales[key]} />
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  )
}

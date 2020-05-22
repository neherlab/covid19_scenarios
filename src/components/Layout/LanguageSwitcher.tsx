import React, { useState } from 'react'
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap'
import i18next from 'i18next'

import SupportedLocales, { Locale, SupportedLocale } from '../../langs'

import './LanguageSwitcher.scss'

const DEFAULT_LOCALE: SupportedLocale = 'en'

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
  const selectedLang = 'en' // TODO: get language

  return (
    <Dropdown isOpen={dropdownOpen} toggle={toggle} data-testid="LanguageSwitcher">
      <DropdownToggle caret>
        <Lang lang={SupportedLocales[selectedLang]} />
      </DropdownToggle>
      <DropdownMenu positionFixed>
        {(Object.keys(SupportedLocales) as SupportedLocale[]).map((key: SupportedLocale) => (
          <DropdownItem
            key={key}
            onClick={() => {
              i18next.changeLanguage(SupportedLocales[key].lang, () => {
                // TODO: set language
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

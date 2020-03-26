import React, { useState } from 'react'
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap'
import i18next from 'i18next'
import * as d3 from 'd3'

import langs, { Lang as LangType } from '../../langs'

import './LanguageSwitcher.scss'

/**
 * Returns our active lang loaded from localstorage
 */
export function getCurrentLang(): string {
  let selectedLang = 'en' // default
  const storedLang = localStorage.getItem('lang')

  if (storedLang) {
    selectedLang = storedLang
  }
  return selectedLang
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
                localStorage.setItem('lang', langs[key].lang)
              })
              d3.formatDefaultLocale(langs[key].d3Locale)
            }}
          >
            <Lang lang={langs[key]} />
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  )
}

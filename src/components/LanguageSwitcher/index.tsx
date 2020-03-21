import React, { useState } from 'react'
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap'
import i18next from 'i18next'

import './LanguageSwitcher.scss'

type Lang = {
  lang: string
  name: string
}

// TODO: better way of retrieving the languages available.
const langs: { [key: string]: Lang } = {
  en: {
    lang: 'en',
    name: 'english',
  },
  fr: {
    lang: 'fr',
    name: 'français',
  },
  pt: {
    lang: 'pt',
    name: 'português',
  },
}

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
function Lang({ lang }: { lang: Lang }) {
  return <span className="language-switcher-lang">{lang.name}</span>
}

export default function LanguageSwitcher() {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const toggle = () => setDropdownOpen(prevState => !prevState)
  const selectedLang = getCurrentLang()

  return (
    <Dropdown isOpen={dropdownOpen} toggle={toggle} className="pull-right">
      <DropdownToggle caret>
        <Lang lang={langs[selectedLang]} />
      </DropdownToggle>
      <DropdownMenu>
        {Object.keys(langs).map(key => (
          <DropdownItem
            key="lang"
            onClick={() => {
              i18next.changeLanguage(langs[key].lang, () => {
                localStorage.setItem('lang', langs[key].lang)
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

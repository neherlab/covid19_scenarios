export enum LANG {
  EN = 'en',
  FR = 'fr',
  PT = 'pt',
  DE = 'de',
  ES = 'es',
  PL = 'pl',
}

/* eslint-disable only-ascii/only-ascii */
export type LangType = {
  lang: LANG
  numeralLocale: string
  name: string
}

const langs: Record<LANG, LangType> = {
  [LANG.EN]: {
    lang: LANG.EN,
    numeralLocale: 'en-gb',
    name: 'english',
  },
  [LANG.FR]: {
    lang: LANG.FR,
    numeralLocale: 'fr-ca',
    name: 'français',
  },
  [LANG.PT]: {
    lang: LANG.PT,
    numeralLocale: 'pt-br',
    name: 'português',
  },
  [LANG.DE]: {
    lang: LANG.DE,
    numeralLocale: 'de',
    name: 'deutsch',
  },
  [LANG.ES]: {
    lang: LANG.ES,
    numeralLocale: 'es',
    name: 'español',
  },
  [LANG.PL]: {
    lang: LANG.PL,
    numeralLocale: 'pl',
    name: 'polski',
  },
}

export default langs

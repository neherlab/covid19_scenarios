export enum Lang {
  EN = 'en',
  FR = 'fr',
  PT = 'pt',
  DE = 'de',
  ES = 'es',
  PL = 'pl',
}

/* eslint-disable only-ascii/only-ascii */
export type LangType = {
  lang: Lang
  numeralLocale: string
  name: string
}

const langs: Record<Lang, LangType> = {
  [Lang.EN]: {
    lang: Lang.EN,
    numeralLocale: 'en-gb',
    name: 'english',
  },
  [Lang.FR]: {
    lang: Lang.FR,
    numeralLocale: 'fr-ca',
    name: 'français',
  },
  [Lang.PT]: {
    lang: Lang.PT,
    numeralLocale: 'pt-br',
    name: 'português',
  },
  [Lang.DE]: {
    lang: Lang.DE,
    numeralLocale: 'de',
    name: 'deutsch',
  },
  [Lang.ES]: {
    lang: Lang.ES,
    numeralLocale: 'es',
    name: 'español',
  },
  [Lang.PL]: {
    lang: Lang.PL,
    numeralLocale: 'pl',
    name: 'polski',
  },
}

export default langs

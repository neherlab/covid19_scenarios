/* eslint-disable only-ascii/only-ascii */
export type Lang = {
  lang: string
  numeralLocale: string
  name: string
}

const langs: { [key: string]: Lang } = {
  en: {
    lang: 'en',
    numeralLocale: 'en-gb',
    name: 'english',
  },
  fr: {
    lang: 'fr',
    numeralLocale: 'fr-ca',
    name: 'français',
  },
  pt: {
    lang: 'pt',
    numeralLocale: 'pt-br',
    name: 'português',
  },
  de: {
    lang: 'de',
    numeralLocale: 'de',
    name: 'deutsch',
  },
  es: {
    lang: 'es',
    numeralLocale: 'es',
    name: 'español',
  },
  pl: {
    lang: 'pl',
    name: 'polski',
  },
}

export default langs

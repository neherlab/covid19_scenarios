/* eslint-disable only-ascii/only-ascii */
export type Lang = {
  lang: string
  name: string
}

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
  de: {
    lang: 'de',
    name: 'deutsch',
  },
  es: {
    lang: 'es',
    name: 'español',
  },
  pl: {
    lang: 'pl',
    name: 'polski',
  },
}

export default langs

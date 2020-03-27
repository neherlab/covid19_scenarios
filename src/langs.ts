export type LangType = {
  lang: string
  name: string
}

const langs: { [key: string]: LangType } = {
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
}

export default langs

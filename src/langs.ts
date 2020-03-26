import { FormatLocaleDefinition } from 'd3-format'
import enLocale from 'd3-format/locale/en-US.json'
import frLocale from 'd3-format/locale/fr-FR.json'
import ptLocale from 'd3-format/locale/pt-BR.json'
import deLocale from 'd3-format/locale/de-DE.json'
import esLocale from 'd3-format/locale/es-ES.json'

export type Lang = {
  lang: string
  name: string
  d3Locale: FormatLocaleDefinition
}

const langs: { [key: string]: Lang } = {
  en: {
    lang: 'en',
    name: 'english',
    d3Locale: enLocale as FormatLocaleDefinition,
  },
  fr: {
    lang: 'fr',
    name: 'français',
    d3Locale: frLocale as FormatLocaleDefinition,
  },
  pt: {
    lang: 'pt',
    name: 'português',
    d3Locale: ptLocale as FormatLocaleDefinition,
  },
  de: {
    lang: 'de',
    name: 'deutsch',
    d3Locale: deLocale as FormatLocaleDefinition,
  },
  es: {
    lang: 'es',
    name: 'español',
    d3Locale: esLocale as FormatLocaleDefinition,
  },
}

export default langs

import en from './en'
import pt from './pt'
import fr from './fr'

// inject a set of common keys to each language
import common from './common'

const languages = { en, pt, fr }

export default Object.keys(languages).reduce(
  (acc, lang) => ({
    ...acc,
    [lang]: {
      translation: {
        ...common.translation,
        ...languages[lang].transation,
      },
    },
  }),
  {},
)

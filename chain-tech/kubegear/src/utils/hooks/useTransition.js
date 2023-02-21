import { useLocalStorage } from "./useStorage"
import * as translations from "./translation"

function getNestedTranslation(language, keys) {
  return keys.reduce((obj, key) => {
    return obj?.[key]
  }, translations[language])
}

export const useTranslation = () => {
  const [language, setLanguage] = useLocalStorage('language', 'en')
  const [fallBackLanguage, setFallBackLanguage] = useLocalStorage(
    'fallBackLanguage',
    'en'
  )

  const translate = key => {
    const keys = key.split('.');

    return (
      getNestedTranslation(language, keys) ?? 
      getNestedTranslation(fallBackLanguage, keys) ?? 
      key
    )
  }

  return {
    language,
    setLanguage,
    fallbackLanguage,
    setFallBackLanguage,
    t: translate
  }
}

export default useTranslation
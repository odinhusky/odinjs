import { defineStore } from "pinia"
import { availableLanguages } from "../i18n/language-utils"

export const useLanguageStore = defineStore({
  id: "language",
  state: () => ({
    currentLanguage: getInitialLanguage() as any
  }),
  actions: {
    setLanguage(newLanguage: any) {
      this.currentLanguage = newLanguage
      localStorage.setItem("lang", newLanguage)
    }
  },
  getters: {
    languageOptions: (state): any[] => availableLanguages,
    currentLanguageOption: (state): any => {
      return availableLanguages.find((lang) => lang.value === state.currentLanguage) || availableLanguages[0]
    }
  }
})

function getInitialLanguage(): any | null {
  const storedLang = localStorage.getItem("lang")
  return isLanguage(storedLang) ? (storedLang as any) : "en"
}

function isLanguage(lang: string | null): lang is any {
  return !!lang && availableLanguages.some((language) => language.value === lang)
}

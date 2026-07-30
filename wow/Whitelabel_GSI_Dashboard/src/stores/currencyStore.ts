import { defineStore } from "pinia"

export const useCurrencyStore = defineStore({
  id: "currency",
  state: () => ({
    currentCurrency: getInitialCurrency() as any
  }),
  actions: {
    setCurrency(newCurrency: any) {
      this.currentCurrency = newCurrency
      localStorage.setItem("currency", newCurrency)
    }
  },
  getters: {
    currentCurrencyValue: (state) => state.currentCurrency
  }
})

function getInitialCurrency(): any | null {
  const storeCurrency = localStorage.getItem("currency")
  return storeCurrency ? storeCurrency : 0
}

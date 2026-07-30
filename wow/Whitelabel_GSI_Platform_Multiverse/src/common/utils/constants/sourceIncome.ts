import { computed } from "vue"

export enum Enums {
  // Source of Income Types
  SALARY = "salary",
  BUSINESS = "business",
  INHERITANCE = "inheritance",
  INVESTMENT = "investment",
  PENSION = "pension",
  SAVINGS = "savings",
  DIVIDENDS = "dividends",
  OTHERS = "others"
}

export const FrontendLabel: Record<string, string> = {
  [Enums.SALARY]: "Salary",
  [Enums.BUSINESS]: "Business",
  [Enums.INHERITANCE]: "Inheritance",
  [Enums.INVESTMENT]: "Investment",
  [Enums.PENSION]: "Pension",
  [Enums.SAVINGS]: "Savings",
  [Enums.DIVIDENDS]: "Dividends",
  [Enums.OTHERS]: "Others"
}

export const Dropdown = computed(() => {
  return Object.keys(Enums).map((key) => ({
    label: FrontendLabel[Enums[key as keyof typeof Enums]],
    value: Enums[key as keyof typeof Enums]
  }))
})

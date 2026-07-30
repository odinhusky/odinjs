import { computed } from "vue"

export enum SOURCE_INCOME_ENUMS {
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

export const SOURCE_INCOME_FRONTEND_LABEL: Record<SOURCE_INCOME_ENUMS, string> = {
  [SOURCE_INCOME_ENUMS.SALARY]: "Salary",
  [SOURCE_INCOME_ENUMS.BUSINESS]: "Business",
  [SOURCE_INCOME_ENUMS.INHERITANCE]: "Inheritance",
  [SOURCE_INCOME_ENUMS.INVESTMENT]: "Investment",
  [SOURCE_INCOME_ENUMS.PENSION]: "Pension",
  [SOURCE_INCOME_ENUMS.SAVINGS]: "Savings",
  [SOURCE_INCOME_ENUMS.DIVIDENDS]: "Dividends",
  [SOURCE_INCOME_ENUMS.OTHERS]: "Others"
}

export const SOURCE_INCOME_DROPDOWN = computed(() => {
  return Object.keys(SOURCE_INCOME_ENUMS).map((key) => ({
    label: SOURCE_INCOME_FRONTEND_LABEL[SOURCE_INCOME_ENUMS[key as keyof typeof SOURCE_INCOME_ENUMS]],
    value: SOURCE_INCOME_ENUMS[key as keyof typeof SOURCE_INCOME_ENUMS]
  }))
})

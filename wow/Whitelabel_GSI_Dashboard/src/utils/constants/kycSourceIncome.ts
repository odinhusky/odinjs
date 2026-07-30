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

export const I18nKeys: Record<Enums, string> = {
  [Enums.SALARY]: "Salary",
  [Enums.BUSINESS]: "Business",
  [Enums.INHERITANCE]: "Inheritance",
  [Enums.INVESTMENT]: "Investment",
  [Enums.PENSION]: "Pension",
  [Enums.SAVINGS]: "Savings",
  [Enums.DIVIDENDS]: "Dividends",
  [Enums.OTHERS]: "Others"
}

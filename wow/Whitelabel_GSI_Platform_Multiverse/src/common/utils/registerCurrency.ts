import type { BaseListType, RegistInputCustomList } from "src/api/response.type"

export function getSingleRegisterCurrencyValue(columns: RegistInputCustomList): BaseListType["value"] | undefined {
  const currencyColumn = columns.find((column) => column.column_name === "currency")

  if (!currencyColumn || currencyColumn.values.length !== 1) {
    return undefined
  }

  return currencyColumn.values[0].value
}

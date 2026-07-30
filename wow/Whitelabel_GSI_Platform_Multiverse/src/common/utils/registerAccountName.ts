import type { RegistInputCustomList } from "src/api/response.type"

export interface NormalizedRegisterAccountNameColumns {
  columns: RegistInputCustomList
  shouldMirrorAccountName: boolean
}

const FULLNAME_COLUMN = "fullname"
const ACCOUNT_NAME_COLUMN = "account_name"

export function normalizeDuplicateRegisterAccountNameColumns(
  columns: RegistInputCustomList
): NormalizedRegisterAccountNameColumns {
  const fullnameColumn = columns.find((column) => column.column_name === FULLNAME_COLUMN)
  const accountNameColumn = columns.find((column) => column.column_name === ACCOUNT_NAME_COLUMN)

  if (!fullnameColumn || !accountNameColumn) {
    return {
      columns: [...columns],
      shouldMirrorAccountName: false,
    }
  }

  return {
    columns: columns
      .filter((column) => column.column_name !== ACCOUNT_NAME_COLUMN)
      .map((column) =>
        column.column_name === FULLNAME_COLUMN
          ? {
              ...column,
              required: column.required || accountNameColumn.required,
            }
          : column
      ),
    shouldMirrorAccountName: true,
  }
}

export function copyFullnameToRegisterAccountName<Payload extends object>(
  payload: Payload
): Payload & { account_name?: string } {
  const fullname = (payload as { fullname?: unknown }).fullname

  if (fullname === undefined || fullname === null) {
    return { ...payload }
  }

  if (typeof fullname !== "string") {
    throw new TypeError(
      `Cannot copy register fullname to account_name: expected fullname to be a string, received ${typeof fullname}`
    )
  }

  return {
    ...payload,
    account_name: fullname,
  }
}

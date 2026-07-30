import * as Response from "src/api/response.type"

function isRegisterColumn(value: unknown): value is Response.RegistInputCustom {
  if (value === null || typeof value !== "object") {
    return false
  }

  return typeof (value as { column_name?: unknown }).column_name === "string"
}

function getNumericOrderKey(key: string): number {
  const order = Number(key)

  if (Number.isFinite(order)) {
    return order
  }

  throw new Error(`Invalid register column order key: ${key}`)
}

function isDataEnvelope(input: object): input is { data: unknown } {
  return "data" in input
}

export function normalizeRegisterColumns(input: unknown): Response.RegistInputCustomList {
  if (Array.isArray(input)) {
    return input.filter(isRegisterColumn)
  }

  if (input === null || typeof input !== "object") {
    return []
  }

  if (isDataEnvelope(input)) {
    return normalizeRegisterColumns(input.data)
  }

  return Object.entries(input)
    .sort(([leftKey], [rightKey]) => getNumericOrderKey(leftKey) - getNumericOrderKey(rightKey))
    .map(([, value]) => value)
    .filter(isRegisterColumn)
}

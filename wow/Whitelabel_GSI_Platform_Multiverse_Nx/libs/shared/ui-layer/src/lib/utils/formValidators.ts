export const isRequiredFilled = (value: unknown) => String(value ?? "").trim().length > 0

export const isEmailValid = (value: string) => {
  const normalized = value.trim()
  if (!normalized) return false

  // RFC 5322 的實務簡化版本，足夠前端表單格式檢查使用
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)
}

export const isPasswordValid = (value: string) => value.trim().length >= 6

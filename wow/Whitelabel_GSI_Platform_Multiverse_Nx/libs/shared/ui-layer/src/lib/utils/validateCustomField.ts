import type { RegisterInputCustomItem } from "@shared-lib/api/apiFunctions/auth_registerCustomInput"

export interface ValidateFieldParams {
  value: any
  field: RegisterInputCustomItem
}

export const validateField = ({ value, field }: ValidateFieldParams): { invalid: boolean; message: string } => {
  const valStr = String(value || "")
  const isPasswordField = field.column_name === "password"
  const hasCustomMinLength =
    typeof field.column_rule?.minLength === "number" && Number.isFinite(field.column_rule.minLength)
  const hasCustomMaxLength =
    typeof field.column_rule?.maxLength === "number" && Number.isFinite(field.column_rule.maxLength)
  const minLength = isPasswordField ? (hasCustomMinLength ? Number(field.column_rule?.minLength) : 8) : undefined
  const maxLength = isPasswordField ? (hasCustomMaxLength ? Number(field.column_rule?.maxLength) : 20) : undefined

  if (field.required && valStr.trim() === "") {
    return { invalid: true, message: "此欄位為必填" }
  }

  if (isPasswordField) {
    if (typeof minLength === "number" && valStr.length < minLength) {
      return { invalid: true, message: `長度不能小於 ${minLength} 個字元` }
    }
    if (typeof maxLength === "number" && valStr.length > maxLength) {
      return { invalid: true, message: `長度不能超過 ${maxLength} 個字元` }
    }
  }

  if (!field.column_rule || !field.column_rule.enabled) {
    return { invalid: false, message: "" }
  }

  const rule = field.column_rule

  if (rule.minLength && valStr.length < rule.minLength) {
    return { invalid: true, message: `長度不能小於 ${rule.minLength} 個字元` }
  }
  if (rule.maxLength && valStr.length > rule.maxLength) {
    return { invalid: true, message: `長度不能超過 ${rule.maxLength} 個字元` }
  }

  if (rule.requireNumber && !/\d/.test(valStr)) {
    return { invalid: true, message: "必須包含數字" }
  }
  if (rule.requireUpperLowerCase && !/(?=.*[a-z])(?=.*[A-Z])/.test(valStr)) {
    return { invalid: true, message: "必須包含大寫與小寫英文字母" }
  }
  if (rule.requireSpecialChar && !/[!@#$%^&*(),.?":{}|<>]/.test(valStr)) {
    return { invalid: true, message: "必須包含特殊字元" }
  }

  return { invalid: false, message: "" }
}

export const getColumnRulePlaceholder = (field: RegisterInputCustomItem): string => {
  const rule = field.column_rule
  if (!rule?.enabled) return "請輸入..."

  const hints: string[] = []
  if (rule.minLength) hints.push(`至少 ${rule.minLength} 字元`)
  if (rule.maxLength) hints.push(`最多 ${rule.maxLength} 字元`)
  if (rule.requireNumber) hints.push("含數字")
  if (rule.requireUpperLowerCase) hints.push("含大小寫")
  if (rule.requireSpecialChar) hints.push("含特殊字元")

  return hints.length ? hints.join("、") : "請輸入..."
}
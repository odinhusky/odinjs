import { useI18n } from "vue-i18n"

/**
 * 共用的表單驗證規則
 * 參照 go-playground/validator/v10 命名規範
 */
export function useValidationRules() {
  const { t } = useI18n()

  /**
   * 必填驗證
   * @param columnName - 欄位名稱（i18n key 或直接文字）
   */
  const required = (columnName?: string) => {
    return (val: any) => {
      const isValid = val !== null && val !== undefined && val !== ""
      if (isValid) return true

      if (columnName) {
        // 如果有提供欄位名稱，嘗試翻譯
        const translatedColumn = columnName.includes(".") ? t(columnName) : columnName
        return t("validation.required", { column: translatedColumn })
      }

      return t("validation.required", { column: t("common.field") || "欄位" })
    }
  }

  /**
   * 大於驗證（gt, greater than）
   */
  const gt = (compareValue = 0) => {
    return (val: any) => {
      const num = Number(val)
      return (!isNaN(num) && num > compareValue) || t("validation.gt", { value: compareValue })
    }
  }

  /**
   * 大於等於驗證（gte, greater than or equal）
   */
  const gte = (compareValue = 0) => {
    return (val: any) => {
      const num = Number(val)
      return (!isNaN(num) && num >= compareValue) || t("validation.gte", { value: compareValue })
    }
  }

  /**
   * 小於驗證（lt, less than）
   */
  const lt = (compareValue: number) => {
    return (val: any) => {
      const num = Number(val)
      return (!isNaN(num) && num < compareValue) || t("validation.lt", { value: compareValue })
    }
  }

  /**
   * 小於等於驗證（lte, less than or equal）
   */
  const lte = (compareValue: number) => {
    return (val: any) => {
      const num = Number(val)
      return (!isNaN(num) && num <= compareValue) || t("validation.lte", { value: compareValue })
    }
  }

  /**
   * 數字驗證（numeric）
   */
  const numeric = () => {
    return (val: any) => {
      return !isNaN(Number(val)) || t("validation.numeric")
    }
  }

  /**
   * 電子郵件驗證
   */
  const email = () => {
    return (val: any) => {
      const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
      return !val || pattern.test(val) || t("validation.email")
    }
  }

  return {
    required,
    gt,
    gte,
    lt,
    lte,
    numeric,
    email
  }
}

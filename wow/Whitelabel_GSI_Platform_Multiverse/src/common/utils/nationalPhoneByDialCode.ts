import { computed, nextTick, ref, unref, watch, type ComputedRef, type Ref } from "vue"

/**
 * 國碼（不含 +）對應的國內號碼規則，僅前端 hard code。
 * 未在 NATIONAL_PHONE_BY_DIAL_CODE 列出的國碼：驗證僅「必填／非空」，不檢查長度與 pattern。
 */
export interface NationalPhoneProfile {
  maxLength: number
  /** 最終格式（通常為滿碼），blur／滿碼時使用 */
  pattern?: RegExp
  /**
   * 輸入過程（not-lazy、且尚未 blur 要求滿碼時）允許的前綴，例如肯亞 /^7\d*$/。
   * 需搭配 pattern、validateOnInput 與 useNationalPhoneBlurFullGate。
   */
  partialPattern?: RegExp
  /**
   * true：model 每次變更即跑 rules（對應 Quasar `lazy-rules=false`），搭配 partialPattern 只做前綴檢查。
   * blur 時透過 gate 再要求滿碼與 pattern。
   */
  validateOnInput?: boolean
}

const NATIONAL_PHONE_BY_DIAL_CODE: Record<string, NationalPhoneProfile> = {
  /** 肯亞：輸入中 7 或 1 + 任意位數；滿 9 碼或離開欄位須符合 7 或 1 + 8 位數字 */
  "254": {
    maxLength: 9,
    partialPattern: /^[71]\d*$/,
    pattern: /^[71]\d{8}$/,
    validateOnInput: true
  }
}

/**
 * 無專屬規則時，sanitize 仍只留數字並截斷於此上限（對齊 E.164 常見長度，避免異常輸入）。
 * 不作為「格式正確」判準；格式僅由表內國碼的 maxLength／pattern 負責。
 */
export const LOOSE_NATIONAL_PHONE_MAX_DIGITS = 15

function normalizeDialCodeDigits(s: string): string {
  const digits = s.replace(/\D/g, "")
  if (!digits) return ""
  return digits.replace(/^0+/, "") || digits
}

/**
 * 從 q-select 選值（字串、數字或 { value } 等）取出國碼數字鍵，例如 "254"。
 */
export function resolveDialCodeKey(countrySelection: unknown): string {
  if (countrySelection == null || countrySelection === "") return ""
  if (typeof countrySelection === "string" || typeof countrySelection === "number") {
    return normalizeDialCodeDigits(String(countrySelection))
  }
  if (typeof countrySelection === "object" && countrySelection !== null) {
    const o = countrySelection as Record<string, unknown>
    const candidates = [o.value, o.country_code, o.code, o.dial_code, o.dialCode]
    for (const c of candidates) {
      if (c !== undefined && c !== null && c !== "") {
        const key = resolveDialCodeKey(c)
        if (key) return key
      }
    }
  }
  return ""
}

export function getStrictNationalPhoneProfile(countrySelection: unknown): NationalPhoneProfile | null {
  const key = resolveDialCodeKey(countrySelection)
  if (!key) return null
  return NATIONAL_PHONE_BY_DIAL_CODE[key] ?? null
}

export function sanitizeNationalPhoneByCountrySelection(val: unknown, countrySelection: unknown): string {
  const digits = String(val ?? "").replace(/\D/g, "")
  const strict = getStrictNationalPhoneProfile(countrySelection)
  if (strict) {
    const sanitized = digits.slice(0, strict.maxLength)
    // For dual-phase profiles (e.g. +254), block input immediately when prefix is invalid.
    if (isDualPhaseProfile(strict) && strict.partialPattern && sanitized && !strict.partialPattern.test(sanitized)) {
      return ""
    }
    return sanitized
  }
  return digits.slice(0, LOOSE_NATIONAL_PHONE_MAX_DIGITS)
}

export type NationalPhoneValidationFailure = "empty" | "length" | "pattern"

function isDualPhaseProfile(strict: NationalPhoneProfile): boolean {
  return Boolean(strict.validateOnInput && strict.partialPattern && strict.pattern)
}

export function validateNationalPhoneNationalPart(
  val: unknown,
  countrySelection: unknown,
  requireFullNationalNumber = false
): true | NationalPhoneValidationFailure {
  const strict = getStrictNationalPhoneProfile(countrySelection)
  const s = sanitizeNationalPhoneByCountrySelection(val, countrySelection)
  if (!s) return "empty"
  if (!strict) return true

  if (!isDualPhaseProfile(strict)) {
    if (s.length !== strict.maxLength) return "length"
    if (strict.pattern && !strict.pattern.test(s)) return "pattern"
    return true
  }

  const fullPattern = strict.pattern
  const prefixPattern = strict.partialPattern

  if (s.length === strict.maxLength) {
    if (fullPattern && !fullPattern.test(s)) return "pattern"
    return true
  }

  if (requireFullNationalNumber) {
    return "length"
  }

  if (prefixPattern && !prefixPattern.test(s)) return "pattern"
  return true
}

/** 有專屬規則時回傳 maxLength，供 input maxlength；否則 undefined（不限制欄位長度） */
export function getNationalPhoneInputMaxLength(countrySelection: unknown): number | undefined {
  return getStrictNationalPhoneProfile(countrySelection)?.maxLength
}

/**
 * 給 Quasar `lazy-rules` 用：true = 延後驗證（blur）；false = model 變更即驗證。
 */
export function getNationalPhoneLazyRules(countrySelection: unknown): boolean {
  const strict = getStrictNationalPhoneProfile(countrySelection)
  if (!strict?.validateOnInput) return true
  return false
}

type QFieldLike = {
  resetValidation?: () => void
  validate?: (value?: string) => boolean | Promise<boolean>
}

export type NationalPhoneBlurFieldRef = Ref<QFieldLike | null | undefined>

/**
 * 雙階段國碼（如 +254）：輸入中只驗 partialPattern；blur 後若未滿碼則報錯。
 * 請在對應 q-input 加上 @blur="onNationalPhoneBlur" @focus="onNationalPhoneFocus"。
 */
export function useNationalPhoneBlurFullGate(
  phoneFieldRef: NationalPhoneBlurFieldRef,
  countrySelection: Ref<unknown> | ComputedRef<unknown>
) {
  const requireFullNationalNumber = ref(false)

  const isDualMode = computed(() => {
    const strict = getStrictNationalPhoneProfile(unref(countrySelection))
    return strict != null && isDualPhaseProfile(strict)
  })

  watch(
    () => unref(countrySelection),
    () => {
      requireFullNationalNumber.value = false
    }
  )

  function onNationalPhoneBlur() {
    if (!isDualMode.value) return
    requireFullNationalNumber.value = true
    nextTick(() => phoneFieldRef.value?.validate?.())
  }

  function onNationalPhoneFocus() {
    requireFullNationalNumber.value = false
  }

  return { requireFullNationalNumber, onNationalPhoneBlur, onNationalPhoneFocus }
}

/**
 * 國碼變更時重新檢查手機欄（Quasar lazy-rules 預設不會因 rules 依賴變更而立刻重跑）。
 */
export function useNationalPhoneRevalidateOnDialCodeChange(
  countrySelectionSource: Ref<unknown> | (() => unknown),
  phoneInputRefs: Ref<QFieldLike | null | undefined> | Array<Ref<QFieldLike | null | undefined>>
) {
  watch(
    () => (typeof countrySelectionSource === "function" ? countrySelectionSource() : countrySelectionSource.value),
    () => {
      nextTick(() => {
        const list = Array.isArray(phoneInputRefs) ? phoneInputRefs : [phoneInputRefs]
        for (const r of list) {
          const q = r.value
          if (!q) continue
          q.resetValidation?.()
          void q.validate?.()
        }
      })
    }
  )
}

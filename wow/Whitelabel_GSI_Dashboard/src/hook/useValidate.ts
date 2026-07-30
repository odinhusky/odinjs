// import { ref } from "vue"
// import { useVuelidate } from "@vuelidate/core"
// import { minLength, maxLength, required, alphaNum, helpers } from "@vuelidate/validators"
interface LimitOptions {
  min: number
  max: number
  step?: number
}

export function useValidate() {
  /*
  const maxNameLength = ref(10) // 限制字數不得超過10位數用
  const minNameLength = ref(2) // 限制字數不得超過2位數用
  const maxDescriptionLength = ref(100) // 限制字數不得超過100位數用

  const alphabetAndChinese = (value: any) => {
    const re = /^[A-Za-z0-9\u4e00-\u9fa5]+$/
    return re.test(value)
  }

  const alphabetAndDash = (value: any) => {
    const re = /^[A-Za-z0-9-]+$/
    return re.test(value)
  }

  // 擴充客製化的驗證可新增於此
  const rules = {
    required: {
      required: helpers.withMessage("不得為空", required)
    },
    name: {
      required: helpers.withMessage("不得為空", required),
      maxLength: helpers.withMessage(`限制長度不得超過${maxNameLength.value}位`, maxLength(maxNameLength)),
      minLength: helpers.withMessage(`限制長度不得少於${minNameLength.value}位`, minLength(minNameLength)),
      alphabetAndChinese: helpers.withMessage(`僅能輸入中文，英文與數字`, alphabetAndChinese)
    },
    type: {
      alphabetAndDash: helpers.withMessage(`限制只能英文與數字與${' "-" 符號'}`, alphabetAndDash),
      required: helpers.withMessage("不得為空", required),
      maxLength: helpers.withMessage(`限制長度不得超過${maxNameLength.value}位`, maxLength(maxNameLength)),
      $lazy: true
    },
    description: {
      maxLength: helpers.withMessage(`限制長度不得超過${maxDescriptionLength.value}位`, maxLength(maxDescriptionLength))
    }
  }

    const v$: any = useVuelidate()
*/
  const validatePassword = (value: string) => {
    const re = /^.{8,50}$/
    return re.test(value)
  }

  interface LimitOptions {
    min: number
    max: number
    step?: number
  }

  /**
   * 只允許數字與 .，並套用 min/max + step
   */
  function validateValue(value: string | number, opts: LimitOptions): number {
    // 1. 轉成字串處理非法字元
    let str = String(value)

    // 只保留 0-9 和 .
    str = str.replace(/[^\d.]/g, "")

    // 只保留第一個 .，後面的全部砍掉
    const firstDot = str.indexOf(".")
    if (firstDot !== -1) {
      const before = str.slice(0, firstDot + 1)
      const after = str.slice(firstDot + 1).replace(/\./g, "")
      str = before + after
    }

    // 2. 轉成數字
    let v = parseFloat(str)

    // 如果整個字串都不是有效數字，就用 min 當預設
    if (Number.isNaN(v)) {
      v = opts.min
    }

    // 3. 先 clamp min / max
    if (v < opts.min) v = opts.min
    if (v > opts.max) v = opts.max

    // 4. 若有 step，則做 step 對齊
    if (opts.step) {
      const step = opts.step
      const steps = Math.round((v - opts.min) / step)
      v = opts.min + steps * step

      // 再保險 clamp 一次
      if (v < opts.min) v = opts.min
      if (v > opts.max) v = opts.max
    }

    // 避免 0.300000000004 之類的浮點誤差
    return Number(v.toFixed(10))
  }

  /**
   * 點擊 - 按鍵
   */
  function handleMinus(current: number, opts: LimitOptions): number {
    const { min, step = 1 } = opts
    const next = current - step

    if (next < min) return current // 超過 min，不動
    return Number(next.toFixed(10))
  }

  /**
   * 點擊 + 按鍵
   */
  function handleAdd(current: number, opts: LimitOptions): number {
    const { max, step = 1 } = opts
    const next = current + step

    if (next > max) return current // 超過 max，不動
    return Number(next.toFixed(10))
  }

  return {
    // rules,
    // v$
    validatePassword,
    validateValue,
    handleMinus,
    handleAdd
  }
}

// utils/useQSelectFilter.ts
import { isRef, type Ref } from "vue"

type Option = {
  label: string
  value: string
  [key: string]: any
}

export function useQSelectFilter() {
  /**
   * 建立專用於某一組 QSelect 的 filter 函數
   * @param sourceOptions 原始完整 options（不會被改動）
   * @param targetOptions 綁在 <q-select :options> 的 ref
   * @param keys 要搜尋的欄位，預設 ['label', 'value']
   */
  function createFilterFn(
    sourceOptions: Option[] | Ref<Option[]>,
    targetOptions: Ref<Option[]>,
    keys: (keyof Option)[] = ["label", "value"]
  ) {
    return (val: string, update: (fn: () => void) => void) => {
      const source = isRef(sourceOptions) ? sourceOptions.value : sourceOptions

      update(() => {
        if (!val) {
          // 沒輸入 → 顯示全部
          targetOptions.value = source
          return
        }

        const needle = val.toLowerCase()

        targetOptions.value = source.filter((opt) =>
          keys.some((k) =>
            String(opt[k] ?? "")
              .toLowerCase()
              .includes(needle)
          )
        )
      })
    }
  }

  return { createFilterFn }
}

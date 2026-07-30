import type { CSSProperties } from "vue"
import type { CustomColumnRuleType } from "src/common/hooks/useRule"

export type ThirdPartyLoginTheme = "dark" | "light"

export interface ThirdPartyLoginContainerProps {
  labelProps?: {
    labelText: string
    labelContainerClass?: string
    labelStyle?: CSSProperties
    labelTextClass?: string
    isRequired?: boolean
    labelStarClass?: string
    tooltipProps?: {
      columnName: string
      columnRule?: CustomColumnRuleType
      tooltipText?: string // 可選：直接傳入文字,優先級高於規則計算
      iconClass?: string // 可選：自定義 icon 樣式
      iconName?: string // 可選：自定義 icon 名稱,預設 'help'
      tooltipClass?: string // 可選：tooltip 容器樣式
      tooltipTextClass?: string // 可選：tooltip 文字樣式
    }
  }
  containerClass?: string
  containerStyle?: CSSProperties
  theme?: ThirdPartyLoginTheme
}

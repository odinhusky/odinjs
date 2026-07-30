import type { CmsEntranceItem } from "@shared-lib/api/commonTypes/cmsTypes"
import { GAME_TYPE_ENUMS } from "@shared-lib/constants/enums/gameType"

export interface SideMenuItem {
  key: string
  label: string
  icon: string
  iconSrc?: string
  to?: string
  did?: string
  gameType?: GAME_TYPE_ENUMS
  entrance?: CmsEntranceItem
}

export interface SideMenuNavigationTarget {
  to: string
  isExternal: boolean
}

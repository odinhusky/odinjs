import type * as Response from "src/api/response.type"
import { Enums as BannerPosition } from "src/common/utils/constants/bannerPosition"
import { Enums as GameType } from "src/common/utils/constants/gameType"

export interface BannerContext {
  position: BannerPosition
  gameType?: GameType
  productCode?: number
}

export function bannerMatchesContext(banner: Response.Banner, context: BannerContext): boolean {
  if (context.position !== BannerPosition.All && banner.position !== context.position) {
    return false
  }

  if (context.gameType !== undefined && banner.game_type !== context.gameType) {
    return false
  }

  if (context.productCode !== undefined && banner.product_code !== context.productCode) {
    return false
  }

  return true
}

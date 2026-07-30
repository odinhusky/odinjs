import casinoPremiumBanner from "src/common/assets/images/gameLobbyDefaultBanner/casino-premium.png"
import cockfightBanner from "src/common/assets/images/gameLobbyDefaultBanner/cockfight.png"
import esportsBanner from "src/common/assets/images/gameLobbyDefaultBanner/esports.png"
import fishingBanner from "src/common/assets/images/gameLobbyDefaultBanner/fishing.png"
import liveCasinoBanner from "src/common/assets/images/gameLobbyDefaultBanner/live-casino.png"
import lotteryBanner from "src/common/assets/images/gameLobbyDefaultBanner/lottery.png"
import otherBanner from "src/common/assets/images/gameLobbyDefaultBanner/other.png"
import p2pBanner from "src/common/assets/images/gameLobbyDefaultBanner/p2p.png"
import slotBanner from "src/common/assets/images/gameLobbyDefaultBanner/slot.png"
import sportBanner from "src/common/assets/images/gameLobbyDefaultBanner/sport.png"
import tableGamesBanner from "src/common/assets/images/gameLobbyDefaultBanner/table-games.png"
import virtualSportBanner from "src/common/assets/images/gameLobbyDefaultBanner/virtual-sport.png"
import { Enums as GameType } from "src/common/utils/constants/gameType"

const defaultBannerByGameType: Record<GameType, string> = {
  [GameType.SLOT]: slotBanner,
  [GameType.LIVECASINO]: liveCasinoBanner,
  [GameType.SPORTBOOK]: sportBanner,
  [GameType.VIRTUALSPORT]: virtualSportBanner,
  [GameType.LOTTERY]: lotteryBanner,
  [GameType.CARDBOARD]: tableGamesBanner,
  [GameType.P2P]: p2pBanner,
  [GameType.FISHING]: fishingBanner,
  [GameType.OTHER]: otherBanner,
  [GameType.COCKFIGHTING]: cockfightBanner,
  [GameType.ESPORT]: esportsBanner,
  [GameType.POKER]: tableGamesBanner,
  [GameType.CASINO_PREMIUM]: casinoPremiumBanner,
}

export function getGameLobbyDefaultBanner(gameType: GameType): string {
  return defaultBannerByGameType[gameType]
}

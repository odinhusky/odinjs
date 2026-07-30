import { STATISTICS } from "@/utils/constants"
import { ENV_MODE_ENUM, useEnv } from "src/hook/useEnv"
import gameDefaultImg from "@/assets/images/default/game.webp"

import productDefaultImg from "@/assets/images/default/product.webp"

export function useImage() {
  const { envData } = useEnv()
  const { VITE_APP_STATIC_RESOURCE_URL } = envData()

  const statisticsImg = (label: STATISTICS.Enums) => {
    switch (label) {
      case STATISTICS.Enums.TodayBetting:
        return new URL(`../assets/images/common/icon-card-bet.svg`, import.meta.url).href
      case STATISTICS.Enums.TodayWinloss:
        return new URL(`../assets/images/common/icon-card-profit-and-loss.svg`, import.meta.url).href
      case STATISTICS.Enums.YesterdayBetting:
        return new URL(`../assets/images/common/icon-card-yesterday-bet.svg`, import.meta.url).href
      case STATISTICS.Enums.YesterdayWinloss:
        return new URL(`../assets/images/common/icon-card-yesterday-profit-and-loss.svg`, import.meta.url).href
      case STATISTICS.Enums.TodayViewer:
        return new URL(`../assets/images/common/icon-viewer.svg`, import.meta.url).href
      case STATISTICS.Enums.TodayLogin:
        return new URL(`../assets/images/common/icon-people-logged-in.svg`, import.meta.url).href
      case STATISTICS.Enums.TodayBettingNumber:
        return new URL(`../assets/images/common/card_Number of bettors.svg`, import.meta.url).href
      case STATISTICS.Enums.TodayDeposit:
        return new URL(`../assets/images/common/card_deposit.svg`, import.meta.url).href
      case STATISTICS.Enums.TodayWithdraw:
        return new URL(`../assets/images/common/card_dispensing.svg`, import.meta.url).href
      case STATISTICS.Enums.TodayWinlose:
        return new URL(`../assets/images/common/card_Profit and loss.svg`, import.meta.url).href
      default:
        return ""
    }
  }

  const logoImg = () => new URL(`../assets/logo.gif`, import.meta.url).href

  const loginLogoImgBlack = (mode: ENV_MODE_ENUM) => {
    switch (mode) {
      case ENV_MODE_ENUM.ADMIN:
        return new URL(/* @vite-ignore */ `../assets/images/login/admin-logo-black.png`, import.meta.url).href
      case ENV_MODE_ENUM.GENERAL_AGENT:
        return new URL(`../assets/images/login/general-agent-logo-black.webp`, import.meta.url).href
      case ENV_MODE_ENUM.AGENT:
      case ENV_MODE_ENUM.ANIBET_AGENT:
      case ENV_MODE_ENUM.AMUSEVIP:
        return new URL(`../assets/images/login/agent-logo-black.webp`, import.meta.url).href
      default:
        return ""
    }
  }

  const successIcon = () => new URL(`../assets/images/common/success.webp`, import.meta.url).href

  const promotionEventBanner = () =>
    new URL(`../assets/images/common/promotion-event-banner.webp`, import.meta.url).href
  const addPaymentLogoDefault = () =>
    new URL(`../assets/images/common/add-payment-logo-default.webp`, import.meta.url).href
  const addQrcodeDefault = () => new URL(`../assets/images/common/add-qrcode-default.webp`, import.meta.url).href
  const addAvatarDefault = () => new URL(`../assets/images/common/add-avatar-default.webp`, import.meta.url).href
  const websiteHomeBannerDefault = () =>
    new URL(`../assets/images/common/website-home-banner-default.webp`, import.meta.url).href

  const productEntranceMapDefault = () =>
    new URL(`../assets/images/common/product-entrance-setting-default.webp`, import.meta.url).href

  /*
    import BannerPc from "@/assets/images/common/banner-home-desktop.webp"
  import BannerMobile from "@/assets/images/common/banner-home-mobile.webp"

  */
  const bannerHomeDesktop = () => new URL(`../assets/images/common/banner-home-desktop.webp`, import.meta.url).href
  const bannerHomeMobile = () => new URL(`../assets/images/common/banner-home-mobile.webp`, import.meta.url).href
  const bannerProductLobby = () => new URL(`../assets/images/common/banner-product-lobby.webp`, import.meta.url).href
  const bannerGameLobby = () => new URL(`../assets/images/common/banner-game-lobby.webp`, import.meta.url).href

  const addKycDefault = () => new URL(`../assets/images/common/kyc-default.webp`, import.meta.url).href
  const addLogoDefault = () => new URL(`../assets/images/common/homeLogo-default.webp`, import.meta.url).href

  const cmsIconDefault = () => new URL(`../assets/images/common/cms-icon-default.webp`, import.meta.url).href
  const cmsIconUploadDefault = () =>
    new URL(`../assets/images/common/cms-icon-upload-default.webp`, import.meta.url).href
  const btnSort = () => new URL(`../assets/images/common/btn-sort.webp`, import.meta.url).href
  const btnTrash = () => new URL(`../assets/images/common/btn-trash.webp`, import.meta.url).href
  const btnAdd = () => new URL(`../assets/images/common/btn-add.webp`, import.meta.url).href

  const cmsCustomPage = (fileName: string) => {
    const normalizedFileName = fileName.includes(".") ? fileName : `${fileName}.webp`
    return new URL(`../assets/images/cms/custom-page/${normalizedFileName}`, import.meta.url).href
  }

  const recommendCardImages = import.meta.glob("../assets/images/cms/custom-page/recommendTemplate/cards/*.webp", {
    eager: true,
    query: "?url",
    import: "default"
  }) as Record<string, string>

  const cmsRecommendCard = (id: number | string) =>
    recommendCardImages[`../assets/images/cms/custom-page/recommendTemplate/cards/${id}.webp`]
  const addProductCustomTabDefault = () =>
    new URL(`../assets/images/common/add-product-custom-tab-default.webp`, import.meta.url).href
  const addProductCustomSquareDefault = () =>
    new URL(`../assets/images/common/add-product-custom-square-default.webp`, import.meta.url).href
  const addProductCustomWideDefault = () =>
    new URL(`../assets/images/common/add-product-custom-wide-default.webp`, import.meta.url).href
  const addGameCustomDefault = () =>
    new URL(`../assets/images/common/add-game-custom-default.webp`, import.meta.url).href

  const setGameDefaultImg = (e: Event) => {
    const imageElement = e.target as HTMLImageElement
    imageElement.src = new URL(`../assets/images/common/default/game.webp`, import.meta.url).href
  }
  function getProductImg(gameType: string, productCode: number, siteKey = "okbet"): string {
    return `${VITE_APP_STATIC_RESOURCE_URL}/images/products/${siteKey}/${gameType}/${productCode}.png`
  }
  function getGametImg(gameType: string, productCode: number, gameCode: string): string {
    return `${VITE_APP_STATIC_RESOURCE_URL}/images/games/${productCode}/${gameType}/${gameCode}.png`
  }
  function getGamePublicImg(
    integrationId: number,
    gameType: string,
    productCode: number,
    gameCode: number | string
  ): string {
    return `${VITE_APP_STATIC_RESOURCE_URL}/publics/images/games/${integrationId}/${productCode}/${gameType}/${gameCode}.png`
  }
  function getProductPublicImg(item: {
    integrationId?: number
    gameType: string
    productCode: number
    siteKey?: string
    imgType?: string
  }): string {
    if (item.siteKey) {
      return `${VITE_APP_STATIC_RESOURCE_URL}/images/products/${item.siteKey}/${item.gameType}/${item.productCode}.${
        item.imgType ? item.imgType : "png"
      }`
    }
    return `${VITE_APP_STATIC_RESOURCE_URL}/images/products/${item.gameType}/${item.productCode}.png`
  }
  const dashboardImg = () => new URL(`../assets/images/common/dashboard.webp`, import.meta.url).href
  const svgImg = (file: string) => new URL(`../assets/svg/${file}.svg`, import.meta.url).href
  const commonImg = (file: string) => new URL(`../assets/images/common/${file}`, import.meta.url).href
  const aiImg = (file: string) => new URL(`../assets/images/ai/${file}`, import.meta.url).href

  const noDataImg = (file: string) => new URL(`../assets/images/noData/${file}`, import.meta.url).href

  const adminLogo = () => new URL(`../assets/images/common/aurora_logo.webp`, import.meta.url).href
  const adminFav = () => new URL(`../assets/images/common/aurora.ico`, import.meta.url).href

  const aiKolPost = () => new URL(`../assets/images/common/ai-kol-post.webp`, import.meta.url).href

  function setDefaultProductImg(e: Event) {
    const image = e.target as HTMLImageElement
    image.src = productDefaultImg
  }

  function setDefaultGameImg(e: Event) {
    const image = e.target as HTMLImageElement
    image.src = gameDefaultImg
  }

  return {
    statisticsImg,
    logoImg,
    loginLogoImgBlack,
    successIcon,
    promotionEventBanner,
    addPaymentLogoDefault,
    addQrcodeDefault,
    addAvatarDefault,
    websiteHomeBannerDefault,
    bannerHomeDesktop,
    bannerHomeMobile,
    bannerProductLobby,
    bannerGameLobby,
    productEntranceMapDefault,
    addKycDefault,
    addLogoDefault,
    cmsIconDefault,
    cmsIconUploadDefault,
    btnSort,
    btnTrash,
    btnAdd,
    cmsCustomPage,
    cmsRecommendCard,
    addProductCustomTabDefault,
    addProductCustomSquareDefault,
    addProductCustomWideDefault,
    addGameCustomDefault,
    setGameDefaultImg,
    getGametImg,
    getProductImg,
    dashboardImg,
    svgImg,
    commonImg,
    aiImg,
    noDataImg,
    adminLogo,
    adminFav,
    getGamePublicImg,
    getProductPublicImg,
    aiKolPost,

    /** 設定產品預設圖 */
    setDefaultProductImg,

    /** 設定遊戲預設圖 */
    setDefaultGameImg
  }
}

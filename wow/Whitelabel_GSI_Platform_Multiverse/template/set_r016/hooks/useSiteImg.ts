import { useGame } from "src/common/composables/useGame"
import { useEnv } from "src/common/hooks/useEnv"

export function useSiteImg() {
  const launchGameDefaultImg = new URL("../assets/images/default/game.png", import.meta.url).href
  const productDefaultImg = new URL("../assets/images/default/product.png", import.meta.url).href
  const productTabDefaultImg = new URL("../assets/images/default/tab.png", import.meta.url).href
  const { gameTypeState } = useGame()
  const { envData } = useEnv()
  const { VITE_APP_STATIC_RESOURCE_URL } = envData()
  const imageModules = import.meta.globEagerDefault("../assets/images/**/*.{png,jpg,jpeg,webp,svg,gif}") as Record<string, string>
  const promotionModules = import.meta.globEagerDefault("../assets/promotions/**/*.{png,jpg,jpeg,webp,svg,gif}") as Record<string, string>
  const imagePromotionModules = import.meta.globEagerDefault("../assets/images/promotions/**/*.{png,jpg,jpeg,webp,svg,gif}") as Record<string, string>

  const getAsset = (modules: Record<string, string>, key: string) => modules[key] || ""
  const result = (url: string) => getAsset(imageModules, `../assets/images/${url}`)
  const resultImages = (url: string) => getAsset(imageModules, `../assets/images/${url}`)
  const resultPromotions = (url: string) =>
    getAsset(promotionModules, `../assets/promotions/${url}`) ||
    getAsset(imagePromotionModules, `../assets/images/promotions/${url}`)

  /** menu */
  const logoImg = resultImages("logo.png")
  const svgIcon = (iconName: string) => resultImages(`svg/${iconName}.svg`)

  //禮金
  const claimGiftImg = (name: string) => resultPromotions(name)

  //首次存款弹窗
  const firstDepositLayout = resultImages("firstDepositLayout.png")
  const firstDepositBottom = resultImages("firstDepositBottom.png")
  /** content 區塊 */
  function menuTabImg(name: string | undefined, active: boolean): string {
    return resultImages(`menu/${name}.png`)
  }
  const homeImg = (url: string) => resultImages(`home/${url}.png`)
  const lobbyGameImg = (num: number) => resultImages(`content/Lobby/lobbyGame${num}.png`)
  const downloadImg = resultImages("home/download.png")
  const downloadPageImg = resultImages("content/Download/DesktopDownload.png")
  const mDownloadPageImg = resultImages("content/Download/MobileDownload.png")
  const mDownloadPageImg2 = resultImages("content/Download/MobileDownload2.png")
  const promotionImg = resultPromotions("promo-1.png")
  const hotTagImg = resultImages("tags/hottag.png")
  const newTagImg = resultImages("tags/newtag.png")

  // 會員中心icon
  const memberCenterIconImage = (file: string) => resultImages(`member-center/icons/${file}.png`)
  const memberCenterImage = (file: string) => resultImages(`member-center/${file}.png`)

  /** vip 圖片 */
  const vipImg = (file: string) => resultImages(`vip/${file}`)

  //代理
  const proxyImg = (name: string) => resultImages(`proxy/${name}`)

  // 浮動圖
  const liveChatImg = () => resultImages("float/live-chat.png")

  // footer 區塊
  const contactImg = resultImages("footer/contact.png")
  const contactDetailImg = resultImages("footer/contact-detail.png")

  const footerSvg = (name: string) => resultImages(`footer/${name}.svg`)
  const footerImg = (name: string) => resultImages(`footer/${name}.png`)

  const leftHandImg = resultImages("footer/left-hand.png")
  const rightHandImg = resultImages("footer/right-hand.png")

  // 彈窗類
  const loginTitleImg = resultImages("modal/modal-title-login.png")
  const registerTitleImg = resultImages("modal/modal-title-register.png")
  const loginImg = (file: string) => resultImages(`login/${file}`)
  const registerImg = (file: string) => resultImages(`register/${file}`)

  // 遊戲
  const playBtnImg = resultImages("btns/play.png")

  // 提款 KYC 驗證提示
  const withdrawalKycImg = resultImages("withdrawal/withdrawal-kyc.png")

  // Shareholder Platform(合營股東)
  const shareholderLogo = resultImages("shareholder-platform/shareholder-logo.png")
  const shareholderTabImg = (name: string) => resultImages(`shareholder-platform/${name}.png`)

  function setDefaultProductTabImg(e: Event) {
    const image = e.target as HTMLImageElement
    image.src = productTabDefaultImg
  }

  function setDefaultProductImg(e: Event) {
    const image = e.target as HTMLImageElement
    image.src = productDefaultImg
  }

  function setDefaultGameImg(e: Event) {
    const image = e.target as HTMLImageElement
    image.src = launchGameDefaultImg
  }

  function getSiteProductImg(gameTypeId: number, productCode: number): string {
    const gameType = gameTypeState.map[gameTypeId]?.game_type
    if (!gameType) return productDefaultImg
    return `${VITE_APP_STATIC_RESOURCE_URL}/images/products/set_r016/${gameType}/${productCode}.png`
  }

  return {
    /** logo */
    logoImg,
    svgIcon,
    loginImg,
    registerImg,

    /** menu tab */
    menuTabImg,

    /** 遊戲圖片 */
    homeImg,

    /** lobby 遊戲圖片 */
    lobbyGameImg,

    /** 下載頁圖片 */
    downloadImg,
    downloadPageImg,
    mDownloadPageImg,
    mDownloadPageImg2,

    /** 優惠圖片 */
    promotionImg,

    /** 會員中心icon */
    memberCenterIconImage,
    memberCenterImage,

    /** vip 圖片 */
    vipImg,

    /** 站內信icon */
    liveChatImg,
    contactImg,
    contactDetailImg,
    loginTitleImg,
    registerTitleImg,

    /** 遊戲 */
    playBtnImg,
    setDefaultProductImg,
    setDefaultGameImg,
    setDefaultProductTabImg,

    /** 提款 KYC 驗證提示 */
    withdrawalKycImg,

    /*footer*/
    footerSvg,
    footerImg,

    getSiteProductImg,
    resultImages,
    result,

    /** Shareholder Platform(合營股東) */
    shareholderLogo,
    shareholderTabImg,
    /** 代理 */
    proxyImg,

    claimGiftImg,
    firstDepositBottom,
    firstDepositLayout,

    hotTagImg,
    newTagImg,

    leftHandImg,
    rightHandImg
  }
}

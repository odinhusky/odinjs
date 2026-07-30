export function useSiteImg() {
  const productTabDefaultImg = new URL("../assets/images/tabs/default.png", import.meta.url).href
  const imageModules = import.meta.globEagerDefault("../assets/images/**/*.{png,jpg,jpeg,webp,svg,gif}") as Record<
    string,
    string
  >
  const promotionModules = import.meta.globEagerDefault(
    "../assets/promotions/**/*.{png,jpg,jpeg,webp,svg,gif}"
  ) as Record<string, string>

  const getAsset = (modules: Record<string, string>, key: string) => modules[key] || ""
  const resultImages = (url: string) => getAsset(imageModules, `../assets/images/${url}`)
  const resultPromotions = (url: string) => getAsset(promotionModules, `../assets/promotions/${url}`)

  /** 遊戲tag圖片 */
  const hotTagImg = resultImages("tags/hottag.png")
  const newTagImg = resultImages("tags/newtag.png")

  /** AI 圖片 */
  const aiIcon = (iconName: string) => resultImages(`ai/${iconName}.png`)

  const svgIcon = (iconName: string) => resultImages(`svg/${iconName}.svg`)
  const pngIcon = (iconName: string) => resultImages(`svg/${iconName}.png`)
  const proxyImg = (file: string) => resultImages(`proxy/${file}`)

  const menuIcon = (iconName: string, folder: "normal" | "active" = "normal") => {
    if (folder === "active") {
      return resultImages(`svg/active/${iconName}.svg`)
    } else {
      return resultImages(`svg/${iconName}.svg`)
    }
  }

  const loginImg = (file: string) => resultImages(`login/${file}`)
  const backBtnImg = resultImages("back-btn.png")
  const successImg = resultImages("success.png")

  // Referral 頁面（從 set_r033 帶過來）
  const mobileBackBtnImg = resultImages("mobile-back-btn.png")
  const mobileExpansionDetailImg = resultImages("mobile-expansion-detail.png")
  const referralBannerImg = resultImages("referral-banner.jpg")
  const referralEditIcon = resultImages("referral-edit.png")

  // Rank board
  const rankIcon = () => resultImages("rankBoard/rank_icon.png")
  const betDetailIcon = () => resultImages("rankBoard/icon_bet_detail.png")

  // 提款 KYC 驗證提示
  const withdrawalKycImg = resultImages("withdrawal/withdrawal-kyc.png")

  // ai agent
  const aiAgentBalanceImg = resultImages("aiAgent/balance.png")
  const aiAgentImg = (iconName: string) => resultImages(`aiAgent/${iconName}.png`)
  const aiAgentDesktopTitleImg = resultImages("aiAgent/desktop_title.png")
  const claimGiftImg = (name: string) => resultPromotions(name)

  function setDefaultProductTabImg(e: Event) {
    const image = e.target as HTMLImageElement
    image.src = productTabDefaultImg
  }

  return {
    /** 遊戲tag圖片 */
    hotTagImg,
    newTagImg,

    /** ai 圖片 */
    aiIcon,

    /** ai agent 圖片 */
    aiAgentBalanceImg,
    aiAgentImg,
    aiAgentDesktopTitleImg,
    claimGiftImg,
    /** svg 圖片 */
    svgIcon,
    pngIcon,

    /** 代理詳情入口 */
    proxyImg,

    /** 左側選單icon */
    menuIcon,

    /** login 圖片 */
    loginImg,
    backBtnImg,
    successImg,

    /** Rank board */
    rankIcon,
    betDetailIcon,

    setDefaultProductTabImg,

    withdrawalKycImg,

    /** Referral 頁面 */
    mobileBackBtnImg,
    mobileExpansionDetailImg,
    referralBannerImg,
    referralEditIcon,
  }
}

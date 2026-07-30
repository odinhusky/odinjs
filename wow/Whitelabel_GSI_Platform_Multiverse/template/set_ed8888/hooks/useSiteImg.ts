export function useSiteImg() {
  const productTabDefaultImg = new URL("../assets/images/Default/tab.png", import.meta.url).href
  const productDefaultImg = new URL("../assets/images/Default/product.png", import.meta.url).href

  const imageModules = import.meta.globEagerDefault("../assets/images/**/*.{png,jpg,jpeg,webp,svg,gif}") as Record<string, string>
  const resultImages = (url: string) => imageModules[`../assets/images/${url}`] || ""
  const svgIcon = (iconName: string) => resultImages(`svg/${iconName}.svg`)

  // Header
  const headerLogo = resultImages("Header/logo.png")
  const headerChat = resultImages("Header/chat.png")
  const headerLoginBg = resultImages("Header/login-bg.png")
  const avatarIcon = resultImages("Header/avatar.png")
  const headerMobileUser = resultImages("Header/user.png")

  // Promotion
  const promotionIcon = resultImages("Promotion/promotion.png")

  /** vip 圖片 */
  const vipImg = (file: string) => resultImages(`vip/${file}`)

  // Product Default Image
  const setDefaultProductImg = (e: Event) => {
    const image = e.target as HTMLImageElement
    image.src = productDefaultImg
  }

  // Product Default Image
  const setDefaultProductTabImg = (e: Event) => {
    const image = e.target as HTMLImageElement
    image.src = productTabDefaultImg
  }

  const hotTagImg = resultImages("Tags/hottag.png")
  const newTagImg = resultImages("Tags/newtag.png")

  const gameTitleIcon = (gameType: number) => {
    switch (gameType) {
      case 1:
        return resultImages("GameTitleIcon/slots.png")
      case 2:
        return resultImages("GameTitleIcon/casino.png")
      case 3:
        return resultImages("GameTitleIcon/sports.png")
      case 4:
        return resultImages("GameTitleIcon/cricket.png")
      case 7:
        return resultImages("GameTitleIcon/p2p.png")
      case 8:
        return resultImages("GameTitleIcon/fish.png")
      case 9:
        return resultImages("GameTitleIcon/other.png")
      case 11:
        return resultImages("GameTitleIcon/esports.png")
      case 12:
        return resultImages("GameTitleIcon/poker.png")
      default:
        return resultImages("GameTitleIcon/1.png")
    }
  }

  return {
    setDefaultProductTabImg,
    setDefaultProductImg,
    svgIcon,
    gameTitleIcon,
    headerLogo,
    headerChat,
    headerLoginBg,
    avatarIcon,
    headerMobileUser,
    promotionIcon,
    hotTagImg,
    newTagImg,
    vipImg
  }
}

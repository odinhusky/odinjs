import { useEnv } from "src/common/hooks/useEnv"
import { useGame } from "src/common/composables/useGame"

export function useSiteImg() {
  const productTabDefaultImg = new URL("../assets/images/tabs/default.png", import.meta.url).href
  const { envData } = useEnv()
  const { VITE_APP_STATIC_RESOURCE_URL } = envData()
  const { gameTypeState } = useGame()
  const imageModules = import.meta.globEagerDefault("../assets/images/**/*.{png,jpg,jpeg,webp,svg,gif}") as Record<string, string>
  const result = (url: string) => imageModules[`../assets/images/${url}`] || ""

  const iconPng = (iconName: string) => result(`common/icons/icon-${iconName}.png`)
  const iconSvg = (iconName: string) => result(`common/icons/icon-${iconName}.svg`)
  const iconHome = (iconName: string) => result(`icon/home/${iconName}.png`)
  const iconHeart = (iconName: string) => result(`favorite/${iconName}.png`)
  /** history */
  function historyImg(iconName: string): string {
    const langList = ["CN", "EN", "THAI", "TW", "VN"]
    let img = ""
    if (langList.includes(iconName)) {
      img = iconName
    } else {
      img = "EN"
    }
    return result(`common/flag/flag-${img}.png`)
  }
  function getSiteProductImg(gameTypeId: number, productCode: number): string {
    const gameType = gameTypeState.map[gameTypeId]?.game_type
    if (!gameType) return ""
    return `${VITE_APP_STATIC_RESOURCE_URL}/images/products/set_amuse/${gameType}/${productCode}.png`
  }
  function setDefaultProductTabImg(e: Event) {
    const image = e.target as HTMLImageElement
    image.src = productTabDefaultImg
  }

  function menuTabImg(name: string | undefined): string {
    return result(`mobile/icon-${name}.png`)
  }

  const footerSvg = (name: string) => result(`footer/${name}.svg`)
  const footerImg = (name: string) => result(`footer/${name}.png`)

  function getCommonSvg(name: string): string {
    return result(`common/${name}.svg`)
  }

  const setVipCommonImg = () => result(`vip/vip-background.jpeg.jpeg`)

  const successImg = () => result("success.png")
  const betDetailIcon = () => result("rankBoard/icon_bet_detail.png")
  return {
    iconPng,
    iconSvg,
    iconHome,
    getSiteProductImg,
    setDefaultProductTabImg,
    historyImg,
    getCommonSvg,
    menuTabImg,
    footerSvg,
    footerImg,
    setVipCommonImg,
    iconHeart,
    successImg,
    betDetailIcon
  }
}

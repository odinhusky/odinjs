export function useSiteImg() {
  const productDefaultImg = new URL("../assets/images/default/product.png", import.meta.url).href
  const imageModules = import.meta.globEagerDefault("../assets/images/**/*.{png,jpg,jpeg,webp,svg,gif}") as Record<string, string>
  const resultImages = (url: string) => imageModules[`../assets/images/${url}`] || ""

  /** menu */
  const svgIcon = (iconName: string) => resultImages(`svg/${iconName}.svg`)
  const headerImg = (iconName: string) => resultImages(`header/${iconName}.png`)

  const collaborationImg = (name: string) => resultImages(`collaboration/${name}.png`)

  const footerImg = (name: string) => resultImages(`footer/${name}.png`)

  // VIP Icon
  const vipIcon = (level: number) => resultImages(`vip/badge-${level}.png`)
  //代理
  const proxyImg = (name: string) => resultImages(`proxy/${name}`)

  function setDefaultProductImg(e: Event) {
    const image = e.target as HTMLImageElement
    image.src = productDefaultImg
  }

  return {
    /** logo */
    svgIcon,
    headerImg,

    /** 遊戲 */
    setDefaultProductImg,

    /** VIP */
    vipIcon,

    proxyImg,

    /*footer*/
    footerImg,

    /** collaboration */
    collaborationImg
  }
}

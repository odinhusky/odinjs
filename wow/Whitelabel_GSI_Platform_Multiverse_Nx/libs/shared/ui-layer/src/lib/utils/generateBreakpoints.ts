// 將 breakpoints 物件轉換為 Tailwind 的 screens 格式
export function generateMaxWidthScreens(breakpoints: Record<string, number>) {
  const screens: Record<string, { max: string }> = {}

  for (const [key, value] of Object.entries(breakpoints)) {
    screens[key] = { max: `${value}px` }
  }

  return screens
}

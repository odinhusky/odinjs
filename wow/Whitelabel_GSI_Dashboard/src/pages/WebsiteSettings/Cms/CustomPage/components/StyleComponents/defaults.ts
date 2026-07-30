import { CMS_PAGE_COMPONENT_TYPE } from "src/utils/constants"

export const defaultStyles: Record<number, Record<string, any>> = {
  [CMS_PAGE_COMPONENT_TYPE.Enums.ANNOUNCEMENT]: {
    icon: "",
    iconFileName: "",
    borderStyle: "rounded",
    textColor: "#409eff",
    backgroundColor: "#EFF7FF",
    marginBottom: 0
  },
  [CMS_PAGE_COMPONENT_TYPE.Enums.NAVBAR]: {
    displayCount: 4,
    backgroundColor: "#FFFFFF",
    textColor: "#7983a2",
    selectedTextColor: "#ffffff",
    selectedBackgroundColor: "#025be8",
    marginBottom: 0
  },
  [CMS_PAGE_COMPONENT_TYPE.Enums.LEADERBOARD]: {
    icon: "",
    iconFileName: "",
    backgroundColor: "#fcfcfc",
    titleColor: "#626263",
    textColor: "#7983a2",
    textSelectedColor: "#000000",
    buttonColor: "#e8ecf8",
    buttonSelectedColor: "#bad5ff",
    underlineSelectedColor: "#025be8",
    marginBottom: 24
  },
  [CMS_PAGE_COMPONENT_TYPE.Enums.GAME_ENTRANCE]: {
    backgroundColor: "",
    textColor: "#131313",
    padding: 24
  },
  [CMS_PAGE_COMPONENT_TYPE.Enums.IMAGE]: {
    displayStyle: "horizontal",
    rowShow: 1,
    displayCount: 1,
    borderStyle: "rounded",
    backgroundColor: "",
    primaryColor: "",
    secondaryColor: "",
    marginBottom: 24
  },
  [CMS_PAGE_COMPONENT_TYPE.Enums.SLIDER]: {
    carouselStyle: "dots",
    borderStyle: "rounded",
    autoPlaySeconds: 3,
    backgroundColor: "",
    primaryColor: "",
    secondaryColor: "",
    marginBottom: 24
  },
  [CMS_PAGE_COMPONENT_TYPE.Enums.TEXT]: {
    backgroundColor: "",
    textColor: "#131313",
    padding: 24
  }
}

export const getDefaultStyle = (type: number) => ({ ...(defaultStyles[type] || {}) })

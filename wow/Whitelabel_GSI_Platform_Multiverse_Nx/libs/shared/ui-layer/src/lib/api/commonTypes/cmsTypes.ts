import { CMS_ARRANGEMENT_ENUMS } from "@shared-lib/constants/enums/cmsArrangement";
import { CMS_DISPLAY_DEVICE_ENUMS } from "@shared-lib/constants/enums/cmsDisplayDevice";
import { CMS_DISPLAY_LOGIN_ENUMS } from "@shared-lib/constants/enums/cmsDisplayLogin";
import { CMS_ENTRANCE_SORT_ENUMS } from "@shared-lib/constants/enums/cmsEntranceSort";
import { CMS_ENTRANCE_TYPE_ENUMS } from "@shared-lib/constants/enums/cmsEntranceType";
import { CMS_OPENING_METHOD_ENUMS } from "@shared-lib/constants/enums/cmsOpeningMethod";
import { CMS_PAGE_COMPONENT_TYPE_ENUMS } from "@shared-lib/constants/enums/cmsPageComponentType";
import { CMS_TYPE_ENUMS } from "@shared-lib/constants/enums/cmsType";
import { CUSTOMER_SERVICES_ENUMS } from "@shared-lib/constants/enums/customerServices";
import { GAME_TYPE_ENUMS } from "@shared-lib/constants/enums/gameType";
import { LANGUAGE_TYPE_ENUMS } from "@shared-lib/constants/enums/languageType";

export type CmsLangTitle = Partial<Record<LANGUAGE_TYPE_ENUMS, string>>

export type CmsSettingItem = {
  lang: CmsLangTitle
  comfirm_button_lang: CmsLangTitle
  reject_button_lang: CmsLangTitle
  icon_path: string
  img_lang: {
    [key: string]: string
  }
  icon_lang: {
    [key: string]: string
  }
  contact_lang: {
    [key: string]: string
  }
  contact_img_lang: {
    [key: string]: string
  }
  selected_icon_path: string
  payload: {
    arrangement: CMS_ARRANGEMENT_ENUMS
    entrance_sort: CMS_ENTRANCE_SORT_ENUMS
    display_login: CMS_DISPLAY_LOGIN_ENUMS
    display_device: CMS_DISPLAY_DEVICE_ENUMS
    opening_method: CMS_OPENING_METHOD_ENUMS
    row_show_mob?: number
    row_show_pc?: number
    view_all?: number
    arrangement_row_pc: number
    arrangement_row_mob: number
    product_integration_id?: number
    product_entrance_type?: number
  }
  logo_sort: string[]
  pop_up_img: string[]
  updated_time: number
}

export type CmsEntranceItem = {
  lang: CmsLangTitle
  type: CMS_ENTRANCE_TYPE_ENUMS | CMS_PAGE_COMPONENT_TYPE_ENUMS
  sort: number
  payload: {
    integration_id: number
    product_code?: number
    game_code?: string
    game_name?: string
    game_favorite_count?: number
    game_id?: number
    game_type?: GAME_TYPE_ENUMS
    link?: string
    opening_method?: CMS_OPENING_METHOD_ENUMS
    link_id?: CMS_ENTRANCE_TYPE_ENUMS | CUSTOMER_SERVICES_ENUMS
    game_hot?: number
    game_newly?: number
    did?: string
    appID?: string
    compID?: string
    product_integration_id?: number
  }
  img_path: string
  updated_time: number
}

export type CmsPageItem = {
  lang: LANGUAGE_TYPE_ENUMS
  title: string
  content: string
}

export type CmsItem = {
  id: number
  url_id: number
  Setting: CmsSettingItem
  Entrance: CmsEntranceItem[]
  Page: CmsPageItem[]
}

export type CmsList = CmsItem[]

export interface GetCmsParams {
  type: CMS_TYPE_ENUMS
}

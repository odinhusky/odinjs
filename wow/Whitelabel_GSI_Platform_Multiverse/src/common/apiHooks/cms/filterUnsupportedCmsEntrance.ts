import type * as Response from "../../../api/response.type"
import * as CMS_ENTRANCE_TYPE from "../../utils/constants/cmsEntranceType"

const UNSUPPORTED_FREEGAME_PAGE_DID = "freegame_page"
const UNSUPPORTED_FREEGAME_PAGE_LINK_ID = 36

type CmsEntranceLike = {
  type?: number
  payload?: {
    did?: string
    link_id?: number | string
    nested_entrance?: CmsEntranceLike[]
    [key: string]: unknown
  }
  [key: string]: unknown
}

export function isUnsupportedFreegameEntrance(entrance?: CmsEntranceLike) {
  const payload = entrance?.payload
  if (!payload || entrance?.type !== CMS_ENTRANCE_TYPE.Enums.INTERNAL_PAGE) return false

  return payload.did === UNSUPPORTED_FREEGAME_PAGE_DID || Number(payload.link_id) === UNSUPPORTED_FREEGAME_PAGE_LINK_ID
}

function filterUnsupportedEntrance<T extends CmsEntranceLike>(entrance: T): T | null {
  if (isUnsupportedFreegameEntrance(entrance)) {
    return null
  }

  const nestedEntrance = entrance.payload?.nested_entrance
  if (!Array.isArray(nestedEntrance)) {
    return entrance
  }

  const filteredNestedEntrance = filterUnsupportedEntranceList(nestedEntrance)
  if (nestedEntrance.length > 0 && filteredNestedEntrance.length === 0) {
    return null
  }

  if (
    filteredNestedEntrance.length === nestedEntrance.length &&
    filteredNestedEntrance.every((nestedItem, index) => nestedItem === nestedEntrance[index])
  ) {
    return entrance
  }

  return {
    ...entrance,
    payload: {
      ...entrance.payload,
      nested_entrance: filteredNestedEntrance,
    },
  }
}

export function filterUnsupportedEntranceList<T extends CmsEntranceLike>(entranceList: T[] = []) {
  return entranceList.reduce<T[]>((list, entrance) => {
    const filteredEntrance = filterUnsupportedEntrance(entrance)
    if (filteredEntrance) {
      list.push(filteredEntrance)
    }
    return list
  }, [])
}

export function filterUnsupportedCmsItem(cmsItem: Response.CmsItem): Response.CmsItem | null {
  if (!Array.isArray(cmsItem.Entrance) || cmsItem.Entrance.length === 0) {
    return cmsItem
  }

  const filteredEntrance = filterUnsupportedEntranceList(cmsItem.Entrance)
  if (filteredEntrance.length === 0) {
    return null
  }

  if (
    filteredEntrance.length === cmsItem.Entrance.length &&
    filteredEntrance.every((entrance, index) => entrance === cmsItem.Entrance[index])
  ) {
    return cmsItem
  }

  return {
    ...cmsItem,
    Entrance: filteredEntrance,
  }
}

export function filterUnsupportedCmsItems(cmsItems: Response.CmsItem[]) {
  return cmsItems.reduce<Response.CmsItem[]>((list, cmsItem) => {
    const filteredCmsItem = filterUnsupportedCmsItem(cmsItem)
    if (filteredCmsItem) {
      list.push(filteredCmsItem)
    }
    return list
  }, [])
}

import { CMS_TYPE } from "src/common/utils/constants"

export const QUERY_KEY = {
  CMS_LIST: "cmsList",
  CMS_DETAIL: "cmsDetail",
  CMS_SPECIFIC_DETAIL: (type: CMS_TYPE.Enums | number) => `detail/${type}`,
  RESPONSIBILITY_CLAUSE: (position: "login" | "register") => ["player", "responsibility-clause", position],
  USER_BASIC_INFO: ["player", "center", "basic", "info"] as const,
}

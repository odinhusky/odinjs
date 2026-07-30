import { CMS_TYPE_ENUMS } from "../../api/apiFunctions/cms"

// CMS
export const TANSTACK_QUERY_KEY_CMS_DETAIL = "cmsDetail"

export const TANSTACK_QUERY_KEY_CMS_SPECIFIC_DETAIL = (type: CMS_TYPE_ENUMS | number) => `detail/${type}`

import { PENDING_SEARCH_TYPE_ENUMS } from "@shared-lib/constants/enums/pendingSearchType"

export const usePendingOrderDetail = () => {
  const getRemarkByOrderType = async (orderType: PENDING_SEARCH_TYPE_ENUMS, transCode: string) => {
    if (orderType === PENDING_SEARCH_TYPE_ENUMS.DEPOSIT) {
      return await depositRemark(transCode)
    }

    return await withdrawalRemark(transCode)
  }

  const uploadDetailByOrderType = async (
    orderType: PENDING_SEARCH_TYPE_ENUMS,
    payload: { trans_code: string; images: string[] }
  ) => {
    if (orderType === PENDING_SEARCH_TYPE_ENUMS.DEPOSIT) {
      return await depositDetailUpload(payload)
    }

    return await withdrawalDetailUpload(payload)
  }

  return {
    getRemarkByOrderType,
    uploadDetailByOrderType
  }
}

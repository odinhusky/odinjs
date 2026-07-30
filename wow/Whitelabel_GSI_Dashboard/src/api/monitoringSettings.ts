import type * as Request from "@/api/request.type"
import type * as Response from "@/api/response.type"
import { MONITORING_TYPE, MONITORING_CYCLE } from "@/utils/constants"
import { get, post, put, deleteData } from "@/utils/request"
import { useCommon } from "@/hook/useCommon"

export const getMonitoringSettingList = async (params: Request.GetMonitoringSettingList) => {
  const { id, offset, size } = params

  let fakeList: Response.GetMonitoringSettingList = [
    {
      id: 1,
      monitoring_type: MONITORING_TYPE.Enums.MemberProfitAbnormality,
      monitoring_cycle: MONITORING_CYCLE.Enums.RealTimeDetection,
      time: "2023-01-01 21:45:25",
      enable_disable: 1
    },
    {
      id: 2,
      monitoring_type: MONITORING_TYPE.Enums.MemberHistoryProfitAbnormality,
      monitoring_cycle: MONITORING_CYCLE.Enums.RealTimeDetection,
      time: "2023-01-01 21:45:25",
      enable_disable: 1
    },
    {
      id: 3,
      monitoring_type: MONITORING_TYPE.Enums.ProductWinLoseAbnormality,
      monitoring_cycle: MONITORING_CYCLE.Enums.RealTimeDetection,
      time: "2023-01-01 21:45:25",
      enable_disable: 1
    },
    {
      id: 4,
      monitoring_type: MONITORING_TYPE.Enums.ProductHistoryWinLoseAbnormality,
      monitoring_cycle: MONITORING_CYCLE.Enums.RealTimeDetection,
      time: "2023-01-01 21:45:25",
      enable_disable: 0
    },
    {
      id: 5,
      monitoring_type: MONITORING_TYPE.Enums.ProductInsufficientBalance,
      monitoring_cycle: MONITORING_CYCLE.Enums.RealTimeDetection,
      time: "2023-01-01 21:45:25",
      enable_disable: 1
    },
    {
      id: 6,
      monitoring_type: MONITORING_TYPE.Enums.WithdrawalWarning,
      monitoring_cycle: MONITORING_CYCLE.Enums.RealTimeDetection,
      time: "2023-01-01 21:45:25",
      enable_disable: 1
    }
  ]

  const fakeRes: Response.BaseResponse<Response.GetMonitoringSettingList> = {
    code: 0,
    msg: "",
    data: [],
    pagination: {
      size: size,
      offset: offset === 0 ? 1 : offset,
      total: 0
    }
  }

  const startCount = ((fakeRes.pagination?.offset ?? 1) - 1) * size
  const endCount = (fakeRes.pagination?.offset ?? 1) * size

  fakeRes.pagination!.total = fakeList.length

  fakeRes.data = fakeList.slice(startCount, endCount)
  return await fakeRes
}
//通知紀錄 列表
export const getNotificationRecordList = (params: Request.GetNotificationRecordList) => {
  const payload = {
    monitoring_type: params.monitoringType,
    start_date: params.start,
    end_date: params.end,
    keyword: params.keyword,
    offset: params.offset,
    size: params.size
  }
  return get<Response.GetNotificationRecordList>("/notification/list", payload, {
    name: "getNotificationRecordList"
  })
}
//通知紀錄詳情
export const getNotificationRecordDetail = (id: number) =>
  get<Response.GetNotificationRecordList>(
    `/notification/${id}`,
    {},
    {
      name: "getNotificationRecordDetail"
    }
  )
//匯出
export const getNotificationRecordExport = async (params: Request.GetNotificationRecordList) => {
  const payload = {
    monitoring_type: params.monitoringType,
    start_date: params.start,
    end_date: params.end,
    keyword: params.keyword,
    offset: params.offset,
    size: params.size
  }
  const response = await get<any>("/notification/export", payload, {
    name: "getNotificationRecordExport",
    responseType: "blob"
  })
  return response
}
//假資料
export const getNotificationRecordListFake = async (params: Request.GetNotificationRecordList) => {
  const { offset, size } = params

  let fakeList: Response.GetNotificationRecordList = [
    {
      id: 2023081000001,
      monitoring_type: MONITORING_TYPE.Enums.MemberProfitAbnormality,
      warning_message: "帳號:OOOO 盈利異常，[P2P_AG Gaming_38%],[P2P_PS Gaming_38%],[Live Casino_MG LIVE_27%]",
      time: "2023-08-10 13:59:01"
    },
    {
      id: 2023081000002,
      monitoring_type: MONITORING_TYPE.Enums.MemberHistoryProfitAbnormality,
      warning_message: "帳號:OOOO  近7天   盈利異常，[P2P_AG Gaming_38%],[P2P_PS Gaming_38%],[Live Casino_MG LIVE_27%]",
      time: "2023-08-10 13:59:01"
    },
    {
      id: 2023081000003,
      monitoring_type: MONITORING_TYPE.Enums.ProductWinLoseAbnormality,
      warning_message: "產品虧損異常[P2P_AG Gaming_38%],[P2P_PS Gaming_38%],[Live Casino_MG LIVE_27%]",
      time: "2023-08-10 13:59:01"
    },
    {
      id: 2023081000004,
      monitoring_type: MONITORING_TYPE.Enums.ProductHistoryWinLoseAbnormality,
      warning_message: "近7天  虧損異常產品[P2P_AG Gaming_38%],[P2P_PS Gaming_38%],[Live Casino_MG LIVE_27%]",
      time: "2023-08-10 13:59:01"
    },
    {
      id: 2023081000005,
      monitoring_type: MONITORING_TYPE.Enums.ProductInsufficientBalance,
      warning_message:
        "產品額度不足，請盡速聯繫客服上分[P2P_AG Gaming_PHP],[P2P_PS Gaming_USD],[Live Casino_MG LIVE_KVND]",
      time: "2023-08-10 13:59:01"
    },
    {
      id: 2023081000006,
      monitoring_type: MONITORING_TYPE.Enums.WithdrawalWarning,
      warning_message: "帳號:OOOO 當天出款已達 5筆",
      time: "2023-08-10 13:59:01"
    },
    {
      id: 2023081000007,
      monitoring_type: MONITORING_TYPE.Enums.MemberProfitAbnormality,
      warning_message: "帳號:OOOO 大量出款 CNY 235,411",
      time: "2023-08-10 13:59:01"
    }
  ]

  const fakeRes: Response.BaseResponse<Response.GetNotificationRecordList> = {
    code: 0,
    msg: "",
    data: [],
    pagination: {
      size: size,
      offset: offset === 0 ? 1 : offset,
      total: 0
    }
  }

  const startCount = ((fakeRes.pagination?.offset ?? 1) - 1) * size
  const endCount = (fakeRes.pagination?.offset ?? 1) * size

  fakeRes.pagination!.total = fakeList.length

  fakeRes.data = fakeList.slice(startCount, endCount)
  return await fakeRes
}

import { get, put, post } from "@/utils/request"
import type * as Request from "@/api/request.type"
import type * as Response from "@/api/response.type"
import { useEnv, ENV_MODE_ENUM } from "src/hook/useEnv"
import { queryClient } from "@/query/queryClient"

export const getCurrencyList = () =>
  queryClient.fetchQuery({
    queryKey: ["payment", "currency"],
    queryFn: () =>
      get<Response.GetCurrencyList>("/payment/currency", undefined, {
        name: "getCurrencyList"
      })
  })

/*取得語系列表*/
export const getLanSettingList = async () => {
  return get<{ name: string; code: string }[]>("/options/languages", {}, { name: "getLanSettingList" })
}

/** 取得語系設定 */
export const getLanSettings = async (type: string) => {
  //會員端
  if (type === "member") {
    return get<Response.GetLanSettings>("/language/member", {}, { name: "getLanSettings" })
  } else {
    return get<Response.GetLanSettings>("/language/panel", {}, { name: "getLanSettings" })
  }
}
/** 更新語系設定 */
export const putLanSettings = async (
  payload: { languages: Response.CmsLangTitle[]; default_language: string },
  type: string
) => {
  //會員端
  if (type === "member") {
    return put("/language/member", payload, { name: "putLanSettings" })
  } else {
    return put("/language/panel", payload, { name: "putLanSettings" })
  }
}

/** 取得網站設定 */
export const getSettings = () =>
  get<Response.GetSettings>("/settings", undefined, {
    name: "getSettings"
  })

/** 更新網站設定 */
export const putSettings = async (payload: Request.PutSettings) => {
  return put<Response.GetSettings>("settings", payload, { name: "putSettings" })
}

/** 取得網站設定 */
export const getAvailableTypeSettings = () =>
  get<Response.GetSettings>("/payment/available_type/setting", undefined, {
    name: "getAvailableTypeSettings"
  })

/** 更新網站設定 */
export const putAvailableTypeSettings = async (payload: Request.PutSettings) => {
  return put("payment/available_type/setting", payload, { name: "putAvailableTypeSettings" })
}

/** 取得客服連結列表 */
export const getCustomerServiceList = async () => {
  return get<Response.CustomerServiceLinkList>("customer_service/dropdown", {}, { name: "getCustomerServiceList" })
}

export const getAdminAccountPermission = (params: Request.GetAdminAccountPermission) =>
  get<Response.GetAdminAccountPermission & { list: [] }>("/permission/role/list", undefined, {
    name: "getAdminAccountPermission",
    needToken: true
  })

// admin
export const getAdminAgentList = () =>
  get<Response.BaseList<Response.GetAdminAgentList>>(
    "/master/list",
    { size: 100000 },
    {
      name: "getAdminAgentList"
    }
  )

// generalAgent
export const getGeneralAgentList = () =>
  get<Response.BaseList<Response.GetGeneralAgentList>>(
    "/agent/list",
    { size: 100000 },
    {
      name: "getGeneralAgentList"
    }
  )

export const getPaymentTypeList = () =>
  get<Response.GetPaymentTypeList>("payment/type", undefined, {
    name: "getPaymentTypeList"
  })

export const getDashboard = (params: Request.GetDashboard) =>
  get<Response.GetDashboard>("/dashboard", params, {
    name: "getDashboard"
  })

export const addEditImg = async (params: { image: string | ArrayBuffer | null }) => {
  return post<Response.AddEditImg>(`/images`, params, { name: "addEditImg" })
}

export const getExportExcel = async (params: { uuid: string }) => {
  return await get<Response.exportItem>(
    `/export/process_check/${params.uuid}`,
    {},
    {
      name: "getExportExcel"
    }
  )
}
//總代
export const getAgentExportExcel = async (params: { uuid: string }) => {
  const payload = {
    export_id: params.uuid
  }
  return await get<Response.exportItem>(`/export/status`, payload, {
    usePlatform: true
  })
}

/*代理取得後台LOGO*/
export const getSiteLogo = async () => {
  const { envData } = useEnv()
  let api = "/user/master/white_label_settings"
  if (envData().VITE_APP_MODE !== ENV_MODE_ENUM.AGENT) {
    api = "/white_label_settings"
  }
  return await get<{ bo_logo: string; bo_ico: string; title: string; updated_time: string }>(
    api,
    {},
    {
      name: "getAgentLogo"
    }
  )
}

/*取得出入款推播*/
export const getPendingTransactions = () =>
  get<Response.GetPendingTransactions>("/dashboard/pending_transactions", undefined, {
    name: "getPendingTransactions"
  })

export const getWhiteIpAuthWithAgent = () =>
  get("/white_ip/auth_with_agent", undefined, {
    name: "getWhiteIpAuthWithAgent"
  })

export const getGscpBalance = (params: Request.GetGscpBalance) =>
  get<Response.GetGscpBalance>("/gscp/balance", params, {
    name: "getGscpBalance",
    usePlatform: true
  })

// 代理端 dashboard 假資料
// export const getDashboard = (params: Request.GetDashboard) => ({
//   code: 0,
//   msg: "success",
//   data: {
//     chart: [
//       {
//         date: "2024-03-18",
//         bet_amount: "33",
//         profit: "22",
//         profit_rate: "66.66666667"
//       },
//       {
//         date: "2024-03-17",
//         bet_amount: "111111",
//         profit: "-11111",
//         profit_rate: "-9.99991"
//       },
//       {
//         date: "2024-03-15",
//         bet_amount: "333",
//         profit: "222",
//         profit_rate: "66.66666667"
//       }
//     ],
//     traffic_data: [
//       {
//         view_count: 99,
//         login_count: 0,
//         bet_count: 6
//       }
//     ],
//     cash_data: [
//       {
//         deposit: "990",
//         profit: "150"
//       }
//     ],
//     product_data: []
//   }
// })

// 總代端 dashboard 假資料
// export const getDashboard = (params: Request.GetDashboard) => ({
//   code: 0,
//   msg: "success",
//   data: {
//     chart: [
//       {
//         date: "2024-03-18",
//         bet_amount: "33",
//         profit: "22",
//         profit_rate: "66.66666667"
//       },
//       {
//         date: "2024-03-17",
//         bet_amount: "111111",
//         profit: "-11111",
//         profit_rate: "-9.99991"
//       },
//       {
//         date: "2024-03-15",
//         bet_amount: "333",
//         profit: "222",
//         profit_rate: "66.66666667"
//       }
//     ],
//     traffic_rank: [
//       {
//         agent_id: 2,
//         agent_code: "",
//         agent_title: "test2",
//         view_count: 2,
//         login_count: 65,
//         bet_count: 888
//       },
//       {
//         agent_id: 2002,
//         agent_code: "",
//         agent_title: "test2002",
//         view_count: 112,
//         login_count: 52,
//         bet_count: 78232
//       },
//       {
//         agent_id: 2003,
//         agent_code: "",
//         agent_title: "test2003",
//         view_count: 166,
//         login_count: 754,
//         bet_count: 123474
//       },
//       {
//         agent_id: 2004,
//         agent_code: "",
//         agent_title: "test2004",
//         view_count: 1823,
//         login_count: 1231,
//         bet_count: 971209
//       },
//       {
//         agent_id: 2005,
//         agent_code: "",
//         agent_title: "test2005",
//         view_count: 1225,
//         login_count: 669,
//         bet_count: 11098
//       },
//       {
//         agent_id: 2006,
//         agent_code: "",
//         agent_title: "test2006",
//         view_count: 19225,
//         login_count: 12045,
//         bet_count: 57782124
//       },
//       {
//         agent_id: 2007,
//         agent_code: "",
//         agent_title: "test2007",
//         view_count: 62098,
//         login_count: 34712,
//         bet_count: 102985
//       },
//       {
//         agent_id: 2008,
//         agent_code: "",
//         agent_title: "test2008",
//         view_count: 143231,
//         login_count: 57190,
//         bet_count: 2098732
//       },
//       {
//         agent_id: 2009,
//         agent_code: "",
//         agent_title: "test2009",
//         view_count: 59578,
//         login_count: 20395,
//         bet_count: 1209854
//       },
//       {
//         agent_id: 2011,
//         agent_code: "",
//         agent_title: "test2011",
//         view_count: 259871,
//         login_count: 12098,
//         bet_count: 3589011
//       },
//       {
//         agent_id: 2012,
//         agent_code: "",
//         agent_title: "test2012",
//         view_count: 5098112,
//         login_count: 309812,
//         bet_count: 509812094
//       },
//       {
//         agent_id: 2013,
//         agent_code: "",
//         agent_title: "test2013",
//         view_count: 559781,
//         login_count: 89514,
//         bet_count: 5982348
//       }
//     ],
//     cash_rank: [
//       {
//         agent_id: 2002,
//         agent_code: "",
//         agent_title: "test2002",
//         deposit: "1598092",
//         profit: "498712"
//       },
//       {
//         agent_id: 2013,
//         agent_code: "",
//         agent_title: "test2013",
//         deposit: "509871",
//         profit: "6591872"
//       }
//     ],
//     bet_rank: [],
//     product_rank: []
//   }
// })

// 總控端 dashboard 假資料
// export const getDashboard = (params: Request.GetDashboard) => ({
//   code: 0,
//   msg: "success",
//   data: {
//     chart: [
//       {
//         date: "2024-03-18",
//         bet_amount: "33",
//         profit: "22",
//         profit_rate: "66.66666667"
//       },
//       {
//         date: "2024-03-17",
//         bet_amount: "111111",
//         profit: "-11111",
//         profit_rate: "-9.99991"
//       },
//       {
//         date: "2024-03-15",
//         bet_amount: "333",
//         profit: "222",
//         profit_rate: "66.66666667"
//       }
//     ],
//     traffic_rank: [
//       {
//         agent_id: 2,
//         agent_code: "",
//         agent_title: "test2",
//         view_count: 2,
//         login_count: 65,
//         bet_count: 888
//       },
//       {
//         agent_id: 2002,
//         agent_code: "",
//         agent_title: "test2002",
//         view_count: 112,
//         login_count: 52,
//         bet_count: 78232
//       },
//       {
//         agent_id: 2003,
//         agent_code: "",
//         agent_title: "test2003",
//         view_count: 166,
//         login_count: 754,
//         bet_count: 123474
//       },
//       {
//         agent_id: 2004,
//         agent_code: "",
//         agent_title: "test2004",
//         view_count: 1823,
//         login_count: 1231,
//         bet_count: 971209
//       },
//       {
//         agent_id: 2005,
//         agent_code: "",
//         agent_title: "test2005",
//         view_count: 1225,
//         login_count: 669,
//         bet_count: 11098
//       },
//       {
//         agent_id: 2006,
//         agent_code: "",
//         agent_title: "test2006",
//         view_count: 19225,
//         login_count: 12045,
//         bet_count: 57782124
//       },
//       {
//         agent_id: 2007,
//         agent_code: "",
//         agent_title: "test2007",
//         view_count: 62098,
//         login_count: 34712,
//         bet_count: 102985
//       },
//       {
//         agent_id: 2008,
//         agent_code: "",
//         agent_title: "test2008",
//         view_count: 143231,
//         login_count: 57190,
//         bet_count: 2098732
//       },
//       {
//         agent_id: 2009,
//         agent_code: "",
//         agent_title: "test2009",
//         view_count: 59578,
//         login_count: 20395,
//         bet_count: 1209854
//       },
//       {
//         agent_id: 2011,
//         agent_code: "",
//         agent_title: "test2011",
//         view_count: 259871,
//         login_count: 12098,
//         bet_count: 3589011
//       },
//       {
//         agent_id: 2012,
//         agent_code: "",
//         agent_title: "test2012",
//         view_count: 5098112,
//         login_count: 309812,
//         bet_count: 509812094
//       },
//       {
//         agent_id: 2013,
//         agent_code: "",
//         agent_title: "test2013",
//         view_count: 559781,
//         login_count: 89514,
//         bet_count: 5982348
//       }
//     ],
//     cash_rank: [
//       {
//         agent_id: 2002,
//         agent_code: "",
//         agent_title: "test2002",
//         deposit: "1598092",
//         profit: "498712"
//       },
//       {
//         agent_id: 2013,
//         agent_code: "",
//         agent_title: "test2013",
//         deposit: "509871",
//         profit: "6591872"
//       }
//     ],
//     bet_rank: [
//       {
//         agent_id: 2,
//         agent_code: "XXXX",
//         agent_title: "XXXX",
//         valid_bet_amount: "0",
//         profit: "0"
//       },
//       {
//         agent_id: 2002,
//         agent_code: "NGSI",
//         agent_title: "NGSI",
//         valid_bet_amount: "0",
//         profit: "0"
//       },
//       {
//         agent_id: 2003,
//         agent_code: "SA05",
//         agent_title: "SIRIUS5",
//         valid_bet_amount: "0",
//         profit: "0"
//       },
//       {
//         agent_id: 2004,
//         agent_code: "test",
//         agent_title: "jack2",
//         valid_bet_amount: "0",
//         profit: "0"
//       },
//       {
//         agent_id: 2005,
//         agent_code: "SA04",
//         agent_title: "eric",
//         valid_bet_amount: "0",
//         profit: "0"
//       },
//       {
//         agent_id: 2006,
//         agent_code: "SA06",
//         agent_title: "sam",
//         valid_bet_amount: "0",
//         profit: "0"
//       },
//       {
//         agent_id: 2007,
//         agent_code: "SA07",
//         agent_title: "sa07",
//         valid_bet_amount: "0",
//         profit: "0"
//       },
//       {
//         agent_id: 2008,
//         agent_code: "SA99",
//         agent_title: "SIRIUS5",
//         valid_bet_amount: "0",
//         profit: "0"
//       },
//       {
//         agent_id: 2009,
//         agent_code: "JISD",
//         agent_title: "jisdomagent01",
//         valid_bet_amount: "0",
//         profit: "0"
//       },
//       {
//         agent_id: 2011,
//         agent_code: "otii",
//         agent_title: "oti02",
//         valid_bet_amount: "0",
//         profit: "0"
//       }
//     ],
//     product_rank: [
//       {
//         product_code: 1006,
//         product_title: "pragmatic_play",
//         player_count: 0,
//         valid_bet_amount: "0",
//         profit: "0"
//       },
//       {
//         product_code: 1011,
//         product_title: "play_tech",
//         player_count: 0,
//         valid_bet_amount: "0",
//         profit: "0"
//       },
//       {
//         product_code: 1016,
//         product_title: "yee_bet",
//         player_count: 0,
//         valid_bet_amount: "0",
//         profit: "0"
//       },
//       {
//         product_code: 1049,
//         product_title: "evoplay",
//         player_count: 0,
//         valid_bet_amount: "0",
//         profit: "0"
//       },
//       {
//         product_code: 1055,
//         product_title: "mrslotty",
//         player_count: 0,
//         valid_bet_amount: "0",
//         profit: "0"
//       },
//       {
//         product_code: 1056,
//         product_title: "truelab",
//         player_count: 0,
//         valid_bet_amount: "0",
//         profit: "0"
//       },
//       {
//         product_code: 1058,
//         product_title: "bgaming",
//         player_count: 0,
//         valid_bet_amount: "0",
//         profit: "0"
//       },
//       {
//         product_code: 1060,
//         product_title: "wazdan",
//         player_count: 0,
//         valid_bet_amount: "0",
//         profit: "0"
//       },
//       {
//         product_code: 1062,
//         product_title: "fazi",
//         player_count: 0,
//         valid_bet_amount: "0",
//         profit: "0"
//       },
//       {
//         product_code: 1064,
//         product_title: "netgame",
//         player_count: 0,
//         valid_bet_amount: "0",
//         profit: "0"
//       }
//     ]
//   }
// })

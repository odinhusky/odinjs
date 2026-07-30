import type * as Request from "@/api/request.type"
import type * as Response from "@/api/response.type"

import { get, post } from "@/utils/request"

export const getFreeRound = (params: Request.GetFreeRound) => {
  const payload = {
    begin_date: params.begin_date,
    currency_id: params.currency_id,
    end_date: params.end_date,
    game_code: params.game_code,
    member_account: params.member_account,
    offset: params.offset,
    product_code: params.product_code,
    size: params.size,
    status: params.status
  }

  return get<Response.GetFreeRound>("/free_round/list", payload, {
    name: "getFreeRound"
  })
}

export const getFreeRoundStatus = () => {
  return get<Response.GetFreeRoundStatus>(
    "/free_round/status",
    {},
    {
      name: "getFreeRoundStatus"
    }
  )
}

export const getFreeRoundProduct = (currency_id: number, product_code: number) => {
  return get<Response.GetFreeRoundProduct>(
    "/free_round/product",
    { currency_id, product_code },
    {
      name: "getFreeRoundProduct"
    }
  )
}

export const deleteFreeRound = (params: Request.CancelFreeRound) => {
  return post(
    `free_round/cancel`,
    {
      bonus_code: params.bonus_code,
      wallet_type: params.wallet_type
    },
    {
      name: "deleteFreeRound"
    }
  )
}

export const getFreeRoundGamesBetScales = (params: Request.GetFreeRoundGamesBetScales) => {
  return get<Response.GetFreeRoundGamesBetScales>(
    "/free_round/games_bet_scales",
    {
      product_code: params.product_code,
      game_code: params.game_code,
      currency_id: params.currency_id,
      wallet_type: params.wallet_type
    },
    {
      name: "getFreeRoundProduct"
    }
  )
}

export const addFreeRound = (params: Request.AddFreeRound) =>
  post("/free_round", params, {
    name: "addFreeRound"
  })

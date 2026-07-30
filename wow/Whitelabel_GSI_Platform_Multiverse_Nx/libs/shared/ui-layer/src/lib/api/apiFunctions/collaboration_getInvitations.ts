import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"
import { INVITATION_STATUS_ENUMS } from "@shared-lib/constants/enums/invitationStatus"
import { Pagination } from "@shared-lib/api/commonTypes"

export interface GetInvitationsParamsType {
  member_account?: string
  currency_id: number
  status?: INVITATION_STATUS_ENUMS
  offset: number
  size: number
}

export type GetInvitationsRequestType = GetInvitationsParamsType

export interface InvitationItem {
  member_id: number
  member_account: string
  deposit_count: number
  deposit_amount: number
  valid_bet_amount: number
  status: INVITATION_STATUS_ENUMS
  currency_id: number
  currency_code: string
}

export interface GetInvitationsResponseType {
  list: InvitationItem[]
  pagination: Pagination & { page: number }
}


export const getInvitations = (params: GetInvitationsParamsType) => {
  return requestFn<GetInvitationsRequestType, GetInvitationsResponseType>(ENDPOINT_PATHS.COLLABORATION.INVITATIONS, params, {
    name: "getInvitations",
    method: "get"
  })
}

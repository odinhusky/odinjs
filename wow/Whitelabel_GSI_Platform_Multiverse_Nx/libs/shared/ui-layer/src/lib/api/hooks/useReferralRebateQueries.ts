import { keepPreviousData, useQuery, type UseQueryOptions, type UseQueryReturnType } from "@tanstack/vue-query"
import { computed, toValue, type ComputedRef, type Ref } from "vue"
import {
  getReferralRebateEvents,
  type GetReferralRebateEventsParamsType,
  type GetReferralRebateEventsResponseType
} from "../apiFunctions/referralRebate_getReferralRebateEvents"
import {
  getReferralRebateEventsStatements,
  type GetReferralRebateEventsStatementsParamsType,
  type GetReferralRebateEventsStatementsResponseType
} from "../apiFunctions/referralRebate_getReferralRebateEventsStatements"
import {
  getReferralRebateGroup,
  type ReferralRebateGroupResponseType
} from "../apiFunctions/referralRebate_getReferralRebateGroup"
import {
  getReferralRebateStatement,
  type GetReferralRebateStatementsParamsType,
  type GetReferralRebateStatementsResponseType
} from "../apiFunctions/referralRebate_getReferralRebateStatement"
import {
  getReferralRebateSummary,
  type GetReferralRebateSummaryParamsType,
  type ReferralRebateSummaryResponseType
} from "../apiFunctions/referralRebate_getReferralRebateSummary"
import type { ApiResponse } from "../types"
import {
  TANSTACK_QUERY_KEY_REFERRAL_REBATE_EVENTS,
  TANSTACK_QUERY_KEY_REFERRAL_REBATE_EVENT_DETAIL,
  TANSTACK_QUERY_KEY_REFERRAL_REBATE_GROUP,
  TANSTACK_QUERY_KEY_REFERRAL_REBATE_STATEMENT,
  TANSTACK_QUERY_KEY_REFERRAL_REBATE_SUMMARY
} from "../../constants/tanstackQueryKeys"

type MaybeRefParams<T> = Ref<T> | ComputedRef<T>

const defaultStatementResponse: GetReferralRebateStatementsResponseType = {
  list: [],
  pagination: {
    page: 1,
    offset: 0,
    size: 20,
    total: 0
  }
}

const defaultEventsResponse: GetReferralRebateEventsResponseType = {
  list: [],
  pagination: {
    page: 1,
    offset: 0,
    size: 20,
    total: 0
  }
}

const assertApiSuccess = <T>(response: ApiResponse<T>) => {
  if (response.status === false) {
    throw new Error(response.msg || `API Error Code: ${response.code}`)
  }

  return response.data ?? null
}

export function useReferralRebateGroupQuery(
  options: Omit<
    UseQueryOptions<ApiResponse<ReferralRebateGroupResponseType>, Error, ReferralRebateGroupResponseType | null>,
    "queryKey" | "queryFn" | "select"
  > = {}
): UseQueryReturnType<ReferralRebateGroupResponseType | null, Error> {
  return useQuery<ApiResponse<ReferralRebateGroupResponseType>, Error, ReferralRebateGroupResponseType | null>({
    queryKey: [TANSTACK_QUERY_KEY_REFERRAL_REBATE_GROUP],
    queryFn: async () => getReferralRebateGroup() as Promise<ApiResponse<ReferralRebateGroupResponseType>>,
    select: assertApiSuccess,
    staleTime: 30_000,
    ...options
  })
}

export function useReferralRebateSummaryQuery({
  params,
  options = {}
}: {
  params: MaybeRefParams<GetReferralRebateSummaryParamsType>
  options?: Omit<
    UseQueryOptions<ApiResponse<ReferralRebateSummaryResponseType>, Error, ReferralRebateSummaryResponseType | null>,
    "queryKey" | "queryFn" | "select"
  >
}): UseQueryReturnType<ReferralRebateSummaryResponseType | null, Error> {
  const queryKey = computed(() => [TANSTACK_QUERY_KEY_REFERRAL_REBATE_SUMMARY, toValue(params)])

  return useQuery<ApiResponse<ReferralRebateSummaryResponseType>, Error, ReferralRebateSummaryResponseType | null>({
    queryKey,
    queryFn: async () => getReferralRebateSummary({ ...toValue(params) }) as Promise<ApiResponse<ReferralRebateSummaryResponseType>>,
    select: assertApiSuccess,
    placeholderData: keepPreviousData,
    staleTime: 30_000,
    ...options
  })
}

export function useReferralRebateStatementQuery({
  params,
  options = {}
}: {
  params: MaybeRefParams<GetReferralRebateStatementsParamsType>
  options?: Omit<
    UseQueryOptions<ApiResponse<GetReferralRebateStatementsResponseType>, Error, GetReferralRebateStatementsResponseType>,
    "queryKey" | "queryFn" | "select"
  >
}): UseQueryReturnType<GetReferralRebateStatementsResponseType, Error> {
  const queryKey = computed(() => [TANSTACK_QUERY_KEY_REFERRAL_REBATE_STATEMENT, toValue(params)])

  return useQuery<ApiResponse<GetReferralRebateStatementsResponseType>, Error, GetReferralRebateStatementsResponseType>({
    queryKey,
    queryFn: async () => getReferralRebateStatement({ ...toValue(params) }) as Promise<ApiResponse<GetReferralRebateStatementsResponseType>>,
    select: (response) => assertApiSuccess(response) ?? defaultStatementResponse,
    placeholderData: keepPreviousData,
    staleTime: 30_000,
    ...options
  })
}

export function useReferralRebateEventsQuery({
  params,
  options = {}
}: {
  params: MaybeRefParams<GetReferralRebateEventsParamsType>
  options?: Omit<
    UseQueryOptions<ApiResponse<GetReferralRebateEventsResponseType>, Error, GetReferralRebateEventsResponseType>,
    "queryKey" | "queryFn" | "select"
  >
}): UseQueryReturnType<GetReferralRebateEventsResponseType, Error> {
  const queryKey = computed(() => [TANSTACK_QUERY_KEY_REFERRAL_REBATE_EVENTS, toValue(params)])

  return useQuery<ApiResponse<GetReferralRebateEventsResponseType>, Error, GetReferralRebateEventsResponseType>({
    queryKey,
    queryFn: async () => getReferralRebateEvents({ ...toValue(params) }) as Promise<ApiResponse<GetReferralRebateEventsResponseType>>,
    select: (response) => assertApiSuccess(response) ?? defaultEventsResponse,
    placeholderData: keepPreviousData,
    staleTime: 30_000,
    ...options
  })
}

export function useReferralRebateEventDetailQuery({
  eventId,
  params,
  options = {}
}: {
  eventId: Ref<number | null> | ComputedRef<number | null>
  params: MaybeRefParams<GetReferralRebateEventsStatementsParamsType>
  options?: Omit<
    UseQueryOptions<
      ApiResponse<GetReferralRebateEventsStatementsResponseType>,
      Error,
      GetReferralRebateEventsStatementsResponseType
    >,
    "queryKey" | "queryFn" | "select"
  >
}): UseQueryReturnType<GetReferralRebateEventsStatementsResponseType, Error> {
  const queryKey = computed(() => [TANSTACK_QUERY_KEY_REFERRAL_REBATE_EVENT_DETAIL, toValue(eventId), toValue(params)])

  return useQuery<
    ApiResponse<GetReferralRebateEventsStatementsResponseType>,
    Error,
    GetReferralRebateEventsStatementsResponseType
  >({
    queryKey,
    queryFn: async () => {
      const resolvedEventId = toValue(eventId)
      if (!resolvedEventId) throw new Error("Missing referral rebate event id")
      return getReferralRebateEventsStatements(resolvedEventId, {
        ...toValue(params)
      }) as Promise<ApiResponse<GetReferralRebateEventsStatementsResponseType>>
    },
    select: (response) => assertApiSuccess(response) ?? defaultStatementResponse,
    placeholderData: keepPreviousData,
    staleTime: 30_000,
    ...options
  })
}

import { GET_EVENT_TOKENS_URL } from '../../urls';
import { ExternalEndpoint } from '../../types';

export interface EventTokensRequest {
  packageName: string;
}

interface EventTokenInfoResponse {
  event?: string;
  token?: string;
}

export interface EventTokensResponse {
  packageName: string;
  eventToken?: EventTokenInfoResponse[];
}

export const GetEventTokensEndpoint = (builder: ExternalEndpoint) =>
  builder.query<EventTokensResult, EventTokensRequest>({
    query: (params) => ({
      method: 'get',
      url: GET_EVENT_TOKENS_URL,
      params: params,
    }),

    transformResponse,
  });

export type EventTokenInfoResult = {
  event: string;
  token: string;
};

export type EventTokensResult = {
  packageName: string;
  eventTokenList: EventTokenInfoResult[];
};

const defaultResult = {
  packageName: '',
  eventTokenList: [],
};

const transformResponse = (
  response: EventTokensResponse
): EventTokensResult => {
  const resp = response;

  if (resp) {
    return {
      packageName: resp.packageName,
      eventTokenList:
        resp.eventToken?.map((item) => ({
          event: item?.event || '',
          token: item?.token || '',
        })) || [],
    };
  }
  return defaultResult;
};

import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '@/gateway/axiosBaseQuery';
import { GetCampaignDetailEndpoint } from '@/external/api/endpoint/GetCampaignDetailEndpoint';
import { PostParticipateEndpoint } from '@/external/api/endpoint/PostParticipateEndpoint';

export const ActivityCenterAPI = createApi({
  reducerPath: 'ActivityCenterApi',
  baseQuery: axiosBaseQuery({
    baseUrl: '',
  }),
  refetchOnReconnect: true,
  refetchOnFocus: false,
  endpoints: (builder) => ({
    getCampaignDetail: GetCampaignDetailEndpoint(builder),
    postParticipateEndpoint: PostParticipateEndpoint(builder),
  }),
});

export const {
  useGetCampaignDetailMutation,
  usePostParticipateEndpointMutation,
} = {
  ...ActivityCenterAPI,
};

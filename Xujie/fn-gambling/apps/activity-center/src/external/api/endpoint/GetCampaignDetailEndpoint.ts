import { ExternalEndpoint } from '@mode2API/types';
import { GET_CAMPAIGN_DETAIL_URL } from '@/external/urls';

export type CampaignDetailResponse = {
  id: number;
  title: string;
  type: string;
  startTime: string;
  endTime: string;
  displayStartTime: string;
  displayEndTime: string;
  displayConfig: {
    distributeTimeRanges: { start: string; end: string }[];
  };
};
/**
 * for [IN]活动详情
 * @param builder
 * @constructor
 */
export const GetCampaignDetailEndpoint = (builder: ExternalEndpoint) =>
  builder.mutation<CampaignDetailResponse, { campaignId: number }>({
    query: (params) => {
      return {
        method: 'get',
        url: GET_CAMPAIGN_DETAIL_URL,
        params,
      };
    },
    transformResponse,
  });

const transformResponse = (
  response: CampaignDetailResponse
): CampaignDetailResponse => {
  //TODO mock yaleen
  if (response) {
    return {
      ...response,
      displayConfig: {
        distributeTimeRanges:
          response.displayConfig?.distributeTimeRanges.map((v) => {
            return {
              //去除秒数位
              start: v.start.slice(0, 5),
              end: v.end.slice(0, 5),
            };
          }) || [],
      },
    };
    // return {
    //   ...response,
    //   startTime: '2024-10-15T00:00:00',
    //   endTime: '2025-10-15T00:00:00',
    //   displayConfig: {
    //     distributeTimeRanges: [
    //       { start: '1:00', end: '12:00' },
    //       { start: '18:00', end: '19:00' },
    //       { start: '22:00', end: '21:00' },
    //     ],
    //   },
    // };
  } else {
    return {
      id: 0,
      title: '',
      type: '',
      startTime: '',
      endTime: '',
      displayStartTime: '',
      displayEndTime: '',
      displayConfig: {
        distributeTimeRanges: [],
      },
    };
  }
};

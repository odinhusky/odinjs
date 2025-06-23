import { POST_CAMPAIGN_LAUNCH_URL } from '../../urls';
import { ExternalEndpoint } from '../../types';
import { ResponseStructure } from '../ResponseStructure';

export enum ECampaignType {
  RED_ENVELOPE_RAIN = 'RED_ENVELOPE_RAIN',
}

export interface CampaignLaunchItem {
  detailUrl?: string;
  displayEndTime?: string;
  displayStartTime?: string;
  endTime?: string;
  id?: number;
  imageUrlOnHomeCarousel?: string;
  imageUrlOnHomePopup?: string;
  participateUrl?: string;
  showOnHomeCarousel?: boolean;
  showOnHomePopup?: boolean;
  startTime?: string;
  title?: string;
  type?: ECampaignType;
  displayConfig?: {
    distributeTimeRanges?: { start?: string; end?: string }[];
    maxRewardAmount?: number;
    rules?: {
      level?: number;
      account?: number;
      bonusOdds?: number;
    }[];
  };
}

export type CampaignLaunchResponse = CampaignLaunchItem[];

/** 活动列表 */
export const PostCampaignLaunchEndpoint = (builder: ExternalEndpoint) =>
  builder.mutation<CampaignLaunchResult, void>({
    query: (data) => ({
      method: 'post',
      url: POST_CAMPAIGN_LAUNCH_URL,
      data,
    }),
    transformResponse,
  });

export type CampaignLaunchItemResult = {
  detailUrl?: string;
  displayEndTime?: string;
  displayStartTime?: string;
  endTime?: string;
  id: number;
  imageUrlOnHomeCarousel?: string;
  imageUrlOnHomePopup?: string;
  participateUrl?: string;
  showOnHomeCarousel?: boolean;
  showOnHomePopup?: boolean;
  startTime?: string;
  title?: string;
  type?: ECampaignType;
  displayConfig: {
    distributeTimeRanges: { start: string; end: string }[];
    maxRewardAmount: number;
    rules: {
      level: number;
      account: number;
      bonusOdds: number;
    }[];
  };
};

const getRules = () => {
  return [
    {
      level: 1,
      account: 10,
      bonusOdds: 0.001,
    },
    {
      level: 2,
      account: 30,
      bonusOdds: 0.004,
    },
    {
      level: 3,
      account: 50,
      bonusOdds: 0.007,
    },
    {
      level: 4,
      account: 70,
      bonusOdds: 0.01,
    },
    {
      level: 5,
      account: 90,
      bonusOdds: 0.013,
    },
    {
      level: 6,
      account: 110,
      bonusOdds: 0.016,
    },
    {
      level: 7,
      account: 130,
      bonusOdds: 0.019,
    },
    {
      level: 8,
      account: 150,
      bonusOdds: 0.022,
    },
    {
      level: 9,
      account: 170,
      bonusOdds: 0.025,
    },
    {
      level: 10,
      account: 300,
      bonusOdds: 0.03,
    },
    {
      level: 11,
      account: 500,
      bonusOdds: 0.07,
    },
    {
      level: 12,
      account: 700,
      bonusOdds: 0.11,
    },

    {
      level: 13,
      account: 900,
      bonusOdds: 0.15,
    },
    {
      level: 14,
      account: 1100,
      bonusOdds: 0.19,
    },
    {
      level: 15,
      account: 1300,
      bonusOdds: 0.23,
    },
    {
      level: 16,
      account: 1500,
      bonusOdds: 0.37,
    },
    {
      level: 17,
      account: 1700,
      bonusOdds: 0.51,
    },
    {
      level: 18,
      account: 1900,
      bonusOdds: 0.65,
    },
    {
      level: 19,
      account: 2100,
      bonusOdds: 0.79,
    },
    {
      level: 20,
      account: 2300,
      bonusOdds: 0.93,
    },
    {
      level: 21,
      account: 2600,
      bonusOdds: 1.07,
    },
    {
      level: 22,
      account: 2900,
      bonusOdds: 1.21,
    },
    {
      level: 23,
      account: 3200,
      bonusOdds: 1.35,
    },
    {
      level: 24,
      account: 3500,
      bonusOdds: 1.49,
    },
    {
      level: 25,
      account: 3800,
      bonusOdds: 1.63,
    },
    {
      level: 26,
      account: 4100,
      bonusOdds: 1.78,
    },
    {
      level: 27,
      account: 4400,
      bonusOdds: 1.93,
    },
    {
      level: 28,
      account: 4700,
      bonusOdds: 2.08,
    },
    {
      level: 29,
      account: 5000,
      bonusOdds: 2.23,
    },
    {
      level: 30,
      account: 5300,
      bonusOdds: 2.38,
    },
  ];
};

export type CampaignLaunchResult = CampaignLaunchItemResult[];

// 数组去重，活动类型相同 只保留第一个
const deduplicateByType = (array: CampaignLaunchResult) => {
  return array.reduce(
    (accumulator, current) => {
      if (current.type && !accumulator.seen[current.type]) {
        accumulator.result.push(current);
        accumulator.seen[current.type] = true;
      }
      return accumulator;
    },
    {
      result: [] as CampaignLaunchResult,
      seen: {} as Record<ECampaignType, boolean>,
    }
  ).result;
};
const transformResponse = (
  response: ResponseStructure<CampaignLaunchResponse>
): CampaignLaunchResult => {
  return deduplicateByType(
    response.Body?.map((item) => {
      //TODO mock yaleen
      // if (item.type === ECampaignType.RED_ENVELOPE_RAIN) {
      //   item.showOnHomePopup = true;
      //   item.displayConfig = {
      //     distributeTimeRanges: [
      //       { start: '14:34', end: '14:35' },
      //       // { start: '18:00', end: '20:00' },
      //       { start: '14:36', end: '21:00' },
      //     ],
      //   };
      //   if (import.meta.env.DEV) {
      //     const params = item.participateUrl?.split('?')[1];
      //     item.participateUrl =
      //       `https://${window.location.hostname}:4300/red_envelope_rain?` +
      //       params;
      //   }
      // }

      return {
        ...item,
        id: item?.id || 1,
        showOnHomePopup: true,
        displayConfig: {
          distributeTimeRanges:
            item.displayConfig?.distributeTimeRanges?.map((v) => {
              return {
                //去除秒数位
                start: v?.start?.slice(0, 5) || '',
                end: v?.end?.slice(0, 5) || '',
              };
            }) || [],
          // maxRewardAmount: item.displayConfig?.maxRewardAmount || 0,
          maxRewardAmount: 888888, // TODO Evan 第一階段都先 mock data
          rules: getRules(),
        },
      };
    }) || []
  );
};

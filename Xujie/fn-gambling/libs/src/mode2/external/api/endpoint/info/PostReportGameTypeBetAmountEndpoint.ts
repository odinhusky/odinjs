import { POST_REPORT_GAME_TYPE_BET_AMOUNT_URL } from '../../urls';
import { ExternalEndpoint } from '../../types';
import { ResponseStructure } from '../ResponseStructure';
import { RecordPageReportTimeTabs } from '@mode2/zustand/page/recordPageStore';
import {
  getTodayTimestamp,
  getYesterdayTimestamp,
  getHasPassedWeekTimestamp,
  getHasPassedMonthTimestamp,
} from '@mode2/utils/index';

export interface UIReportGameTypeBetAmountRequest {
  intervalType: RecordPageReportTimeTabs;
}

export interface ApiReportGameTypeBetAmountRequest {
  startDate: number; // 1726243199,
  endDate: number; // 1726156800
}

enum BetGameTypeId {
  CASINO = 1,
  SLOTS = 2,
  SPORTS = 3,
  GAME = 4,
  FISHING = 5,
  ORIGINAL = 6,
}

export enum BetGameTypeName {
  CASINO = 'casino',
  SLOTS = 'slots',
  SPORTS = 'sports',
  GAME = 'game',
  FISHING = 'fishing',
  ORIGINAL = 'original',
}

interface ReportGameTypeBetAmountItemResponse {
  betAmount?: number; //46.20000076293945
  type?: BetGameTypeId;
}

export type ReportGameTypeBetAmountResponse =
  ReportGameTypeBetAmountItemResponse[];

/** 遊戲類別下注總金額在不同時間段的統計 */
export const PostReportGameTypeBetAmountEndpoint = (
  builder: ExternalEndpoint
) =>
  builder.mutation<
    ReportGameTypeBetAmountResult,
    UIReportGameTypeBetAmountRequest
  >({
    query: (data: UIReportGameTypeBetAmountRequest) => {
      let interval = [0, 0];
      if (data.intervalType === RecordPageReportTimeTabs.TODAY) {
        interval = getTodayTimestamp();
      } else if (data.intervalType === RecordPageReportTimeTabs.YESTERDAY) {
        interval = getYesterdayTimestamp();
      } else if (data.intervalType === RecordPageReportTimeTabs.A_WEEK) {
        interval = getHasPassedWeekTimestamp();
      } else if (data.intervalType === RecordPageReportTimeTabs.A_MONTH) {
        interval = getHasPassedMonthTimestamp();
      }

      const reqData: ApiReportGameTypeBetAmountRequest = {
        startDate: interval[0],
        endDate: interval[1],
      };
      return {
        method: 'post',
        url: POST_REPORT_GAME_TYPE_BET_AMOUNT_URL,
        data: {
          reqData,
        },
      };
    },

    transformResponse,
  });

type ReportGameTypeBetAmountResult = {
  totalBetAmount: number;
  betAmountByGameType: {
    [name in BetGameTypeName]: number;
  };
};

const defaultResult = {
  totalBetAmount: 0,
  betAmountByGameType: {
    [BetGameTypeName.CASINO]: 0,
    [BetGameTypeName.SLOTS]: 0,
    [BetGameTypeName.SPORTS]: 0,
    [BetGameTypeName.GAME]: 0,
    [BetGameTypeName.FISHING]: 0,
    [BetGameTypeName.ORIGINAL]: 0,
  },
};

const transformResponse = (
  response: ResponseStructure<ReportGameTypeBetAmountResponse>
): ReportGameTypeBetAmountResult => {
  const resp = response?.Body;
  if (resp) {
    const mapBetGameNameByType = {
      [BetGameTypeId.CASINO]: BetGameTypeName.CASINO,
      [BetGameTypeId.SLOTS]: BetGameTypeName.SLOTS,
      [BetGameTypeId.SPORTS]: BetGameTypeName.SPORTS,
      [BetGameTypeId.GAME]: BetGameTypeName.GAME,
      [BetGameTypeId.FISHING]: BetGameTypeName.FISHING,
      [BetGameTypeId.ORIGINAL]: BetGameTypeName.ORIGINAL,
    };

    let totalBetAmount = 0;
    const betAmountByGameType = { ...defaultResult.betAmountByGameType };

    resp.forEach((item) => {
      totalBetAmount += item?.betAmount || 0;
      if (item?.type) {
        const gameName = mapBetGameNameByType[item.type];
        if (gameName) {
          betAmountByGameType[gameName] = item?.betAmount || 0;
        }
      }
    });

    return {
      totalBetAmount,
      betAmountByGameType,
    };
  }
  return defaultResult;
};

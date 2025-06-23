import {
  CampaignLaunchItemResult,
  ECampaignType,
} from '@libs/mode2/external/api/endpoint/campaign/PostCampaignLaunchEndpoint';
import sdkUtils from '@libs/mode2/utils/sdk';
import { AppLocalStorageKey } from '@libs/mode2/utils/sdk/persistant/storageKey';
import { Dayjs } from 'dayjs';
import dayjs from '@commonUtils/localizedDayjs';
import { create } from 'zustand';

export enum ERedEnvelopRainStatus {
  TWO_HOUR_BEFORE_START = 'TWO_HOUR_BEFORE_START',
  ONE_HOUR_BEFORE_START = 'ONE_HOUR_BEFORE_START',
  HALF_HOUR_BEFORE_START = 'HALF_HOUR_BEFORE_START',
  IN_PROGRESS = 'IN_PROGRESS',
  NULL = 'NULL',
}

export interface IRedEnvelopeRainResult extends CampaignLaunchItemResult {
  id: number;
  type: ECampaignType.RED_ENVELOPE_RAIN;
  status: ERedEnvelopRainStatus;
  maxRewardAmount: number;
  countdown?: number;
  hidden?: boolean;
  times: number;
  nextTimes?: {
    start: Dayjs;
    end: Dayjs;
  };
  isAutoOpen: boolean;
}

interface IActivityTest2 extends CampaignLaunchItemResult {
  id: number;
  test: number;
}

export type ICurrentActivityData =
  | IRedEnvelopeRainResult
  | IActivityTest2
  | null;

const getEnvelopeRainResult = (item: CampaignLaunchItemResult) => {
  const distributeTimeRanges = item.displayConfig?.distributeTimeRanges || [];
  let result: Pick<IRedEnvelopeRainResult, 'status' | 'nextTimes'> = {
    status: ERedEnvelopRainStatus.NULL,
  };
  const now = dayjs();
  let isAutoOpen = false;
  // STEP 是否在活动时间内
  if (now > dayjs(item.startTime) && now < dayjs(item.endTime)) {
    // STEP 筛选出最近的活动时间段
    for (const range of distributeTimeRanges) {
      const startTime = dayjs(`${now.format('YYYY-MM-DD')} ${range.start}`);
      const endTime = dayjs(`${now.format('YYYY-MM-DD')} ${range.end}`);

      const twoHoursBeforeStart = startTime.subtract(120, 'minute');
      const oneHourBeforeStart = startTime.subtract(60, 'minute');
      const thirtyMinutesBeforeStart = startTime.subtract(30, 'minute');
      const nextTimes = {
        start: startTime,
        end: endTime,
      };
      if (now < twoHoursBeforeStart) {
        // 如果当前时间距离活动开始还有超过2小时，则不显示任何信息
        continue;
      } else if (now >= twoHoursBeforeStart && now < oneHourBeforeStart) {
        result = {
          status: ERedEnvelopRainStatus.TWO_HOUR_BEFORE_START,
          nextTimes,
        };
        break;
      } else if (now >= oneHourBeforeStart && now < thirtyMinutesBeforeStart) {
        result = {
          status: ERedEnvelopRainStatus.ONE_HOUR_BEFORE_START,
          nextTimes,
        };
        break;
      } else if (now >= thirtyMinutesBeforeStart && now < startTime) {
        result = {
          status: ERedEnvelopRainStatus.HALF_HOUR_BEFORE_START,
          nextTimes,
        };
        break;
      } else if (now >= startTime && now <= endTime) {
        result = {
          status: ERedEnvelopRainStatus.IN_PROGRESS,
          nextTimes,
        };
        break;
      }
    }

    // STEP 是否自动打开红包雨
    if (result.status === ERedEnvelopRainStatus.IN_PROGRESS) {
      const userId = sdkUtils.getStorage(AppLocalStorageKey.USER_ID);
      if (userId) {
        const data = JSON.parse(
          sdkUtils.getStorage(AppLocalStorageKey.RED_ENVELOPE_RAIN_DATA) ||
            'null'
        )?.[userId];

        const nextTimes = result.nextTimes;
        if (data) {
          if (nextTimes) {
            // 上一次打开时间在这个时间段内，不再自动打开
            isAutoOpen = !(
              dayjs(data.lastOpenTime) >= dayjs(nextTimes.start) &&
              dayjs(data.lastOpenTime) < dayjs(nextTimes.end)
            );
          }
        } else {
          isAutoOpen = true;
        }
      }
    }
  }

  return {
    ...item,
    ...result,
    isAutoOpen,
    type: ECampaignType.RED_ENVELOPE_RAIN,
    times: item.displayConfig?.distributeTimeRanges?.length ?? 0,
    maxRewardAmount: item.displayConfig?.maxRewardAmount ?? 0,
  };
};

export const useActivityCenterStore = create<{
  isShowActivityCenterModal: boolean;
  setShowActivityCenterModal: (show: boolean) => void;
  isShowActivityDescriptionModal: boolean;
  setShowActivityDescriptionModal: (show: boolean) => void;

  campaignList: CampaignLaunchItemResult[];
  setCampaignList: (list: CampaignLaunchItemResult[]) => void;
  activeOnHomeList: CampaignLaunchItemResult[];
  setActiveOnHomeList: (list: CampaignLaunchItemResult[]) => void;

  currentActivityData: ICurrentActivityData;
  setCurrentActivityData: (type: ECampaignType | null) => void;

  redEnvelopeRainResult: IRedEnvelopeRainResult | null;
  refreshActivityResult: (type: ECampaignType) => void;
  hiddenActivityButton: (type: ECampaignType) => void;
  refreshCampaignListCount: number;
  refreshCampaignList: () => void;
}>((set, get) => {
  return {
    isShowActivityCenterModal: false,
    setShowActivityCenterModal: (isShowActivityCenterModal) =>
      set((state) => {
        if (isShowActivityCenterModal) {
          const userId = sdkUtils.getStorage(AppLocalStorageKey.USER_ID);
          if (userId) {
            const data = JSON.parse(
              sdkUtils.getStorage(AppLocalStorageKey.RED_ENVELOPE_RAIN_DATA) ||
                '{}'
            );
            data[userId] = {
              ...data?.[userId],
              lastOpenTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
            };

            sdkUtils.setStorage(
              AppLocalStorageKey.RED_ENVELOPE_RAIN_DATA,
              JSON.stringify(data)
            );
          }
        }

        if (state.redEnvelopeRainResult) {
          // modal打开过，isAutoOpen重置为false
          state.redEnvelopeRainResult.isAutoOpen = false;
        }

        return { isShowActivityCenterModal };
      }),
    isShowActivityDescriptionModal: false,
    setShowActivityDescriptionModal: (isShowActivityDescriptionModal) =>
      set(() => ({ isShowActivityDescriptionModal })),
    isNavActivityRulesPage: false,
    campaignList: [],
    activeOnHomeList: [],
    setActiveOnHomeList: (activeOnHomeList) =>
      set(() => ({ activeOnHomeList })),
    setCampaignList: (campaignList) =>
      set((state) => {
        campaignList.forEach((item) => {
          switch (item.type) {
            case ECampaignType.RED_ENVELOPE_RAIN: {
              state.redEnvelopeRainResult = getEnvelopeRainResult(item);
            }
          }
        });

        return { campaignList };
      }),
    currentActivityData: null,
    setCurrentActivityData: (type) =>
      set((state) => {
        switch (type) {
          case ECampaignType.RED_ENVELOPE_RAIN:
            return { currentActivityData: state.redEnvelopeRainResult };

          default:
            return { currentActivityData: null };
        }
      }),

    redEnvelopeRainResult: null,
    refreshActivityResult: (type) =>
      set((state) => {
        const item = state.campaignList.find((v) => v.type === type);
        switch (type) {
          case ECampaignType.RED_ENVELOPE_RAIN: {
            return {
              redEnvelopeRainResult: item ? getEnvelopeRainResult(item) : null,
            };
          }
          default:
            return {};
        }
      }),
    hiddenActivityButton: (type) =>
      set((state) => {
        switch (type) {
          case ECampaignType.RED_ENVELOPE_RAIN:
            return state.redEnvelopeRainResult
              ? {
                  redEnvelopeRainResult: {
                    ...state.redEnvelopeRainResult,
                    hidden: true,
                  },
                }
              : {};
          default:
            return {};
        }
      }),
    refreshCampaignListCount: 0,
    refreshCampaignList: () =>
      set(() => ({
        refreshCampaignListCount: get().refreshCampaignListCount + 1,
      })),
  };
});

export default useActivityCenterStore;

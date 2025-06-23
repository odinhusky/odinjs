import { HandleClickProps } from '@mode2/action/common/handleClickProps';
import {
  handleActivityCenterClose,
  handleActivityDescriptionClose,
  handleFloatActivityOnHomClick,
  handleFloatActivityOnHomClose,
} from '@mode2/action/actionTypes';
import { ActionClickObjType } from '@mode2/action/common/actionClickObjetType';
import handleGlobalClick from '@mode2/action/handleGlobalClick';
import handleAction from '@mode2/action/common/handleAction';
import { useNavPageClick } from '@mode2/usecase/useNavPageClick';

import useActivityCenterStore, {
  ERedEnvelopRainStatus,
} from '@libs/mode2/zustand/components/activityCenterStore';
import { ECampaignType } from '@libs/mode2/external/api/endpoint/campaign/PostCampaignLaunchEndpoint';
import sdkUtils from '@mode2/utils/sdk';
import { ActivityRulesContentTypes } from '@mode2/zustand/page/activityRulesPageStore';

type ActionClickPayloadMap = {
  // [handleFloatActivityOnHomClick]: ECampaignType;
  // [handleFloatActivityOnHomClose]: ECampaignType;
  [handleFloatActivityOnHomClick]: { type: ECampaignType };
  [handleFloatActivityOnHomClose]: { type: ECampaignType };
  [handleActivityDescriptionClose]: number;
  [handleActivityCenterClose]: number;
};

export interface HandleActivityCenterOnEventProps<
  T extends keyof ActionClickPayloadMap
> extends HandleClickProps<T, ActionClickPayloadMap> {}

const useActivityCenterAction = () => {
  const { navToLoginPage, navToActivityRulePage } = useNavPageClick();
  const {
    redEnvelopeRainResult,
    setCurrentActivityData,
    hiddenActivityButton,
    setShowActivityCenterModal,
    setShowActivityDescriptionModal,
  } = useActivityCenterStore();
  const actionClickObj: ActionClickObjType<ActionClickPayloadMap> = {
    [handleFloatActivityOnHomClick]: ({ type }) => {
      handleGlobalClick({
        target: handleFloatActivityOnHomClick,
        payload: { type },
        callback: () => {
          // TODO Yaleen 進入紅包雨 或進入任何活動中心之前，需要判斷是否登入
          // 进入活动中心 活动前两小时-显示活动规则 活动前一小时-显示活动说明  活动中-显示活动中心
          if (!sdkUtils.isCurrentLogin()) {
            navToLoginPage(38);
            return;
          }
          setCurrentActivityData(type);
          switch (type) {
            case ECampaignType.RED_ENVELOPE_RAIN: {
              if (!redEnvelopeRainResult) return;
              if (
                redEnvelopeRainResult.status ===
                ERedEnvelopRainStatus.TWO_HOUR_BEFORE_START
              ) {
                navToActivityRulePage(`?campaignType=${type}`, {
                  state: {
                    tab: ActivityRulesContentTypes.RED_ENVELOPE_RAIN_RULES_CONTENT,
                  },
                });
              } else {
                redEnvelopeRainResult.status ===
                ERedEnvelopRainStatus.IN_PROGRESS
                  ? setShowActivityCenterModal(true)
                  : setShowActivityDescriptionModal(true);
              }
              break;
            }

            default:
              break;
          }
        },
      });
    },
    [handleFloatActivityOnHomClose]: ({ type }) => {
      handleGlobalClick({
        target: handleFloatActivityOnHomClose,
        callback: () => {
          hiddenActivityButton(type);
        },
      });
    },
    [handleActivityCenterClose]: () => {
      handleGlobalClick({
        target: handleActivityDescriptionClose,
        callback: () => {
          setCurrentActivityData(null);
          setShowActivityCenterModal(false);
        },
      });
    },
    [handleActivityDescriptionClose]: () => {
      handleGlobalClick({
        target: handleActivityDescriptionClose,
        callback: () => {
          setCurrentActivityData(null);
          setShowActivityDescriptionModal(false);
        },
      });
    },
  };

  const handleActivityCenterClick = <T extends keyof ActionClickPayloadMap>({
    actionName,
    payload,
  }: HandleActivityCenterOnEventProps<T>) => {
    // 共同邏輯抽出
    handleAction({
      actionName,
      payload,
      actionClickObj,
    });
  };

  return {
    actionClickObj,
    handleActivityCenterClick,
  };
};

export default useActivityCenterAction;

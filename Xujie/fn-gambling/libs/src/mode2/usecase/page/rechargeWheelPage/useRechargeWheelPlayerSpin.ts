import { useDeepEffect, useUpdateEffect } from '@libs/commonUtils';
import {
  RechargeWheelLevelType,
  rechargeWheelLevelToWheelLevelTypeMapping,
  rechargeWheelLevelTypeToNumberMapping,
} from '@libs/mode2/@types/rechargeWheelLevelTypes';
import { usePostWheelPlayerSpinMutation } from '@libs/mode2/external/api';
import { WheelSegmentCategoryResult } from '@libs/mode2/external/api/endpoint/wheel/PostWheelConfigEndpoint';
import { useRechargeWheelTabStore } from '@libs/mode2/zustand/components/rechargeWheelTabStore';
import useMode2RechargeWheelPageStore from '@libs/mode2/zustand/page/rechargeWheelPage';
import get from 'lodash/get';
import isArray from 'lodash/isArray';
import isEmpty from 'lodash/isEmpty';
import isNumber from 'lodash/isNumber';
import { useEffect } from 'react';

export const useRechargeWheelPlayerSpin = () => {
  const [
    triggerSpin,
    {
      data: playerSpinedData,
      isSuccess: isPostWheelPlayerSpinSuccess,
      isError: isPostWheelPlayerSpinError,
    },
  ] = usePostWheelPlayerSpinMutation();

  const spinWheelCount = useMode2RechargeWheelPageStore(
    (state) => state.spinWheelCount
  );

  const spinWheelLevel = useMode2RechargeWheelPageStore(
    (state) => state.spinWheelLevel
  );

  const wheelLevelConfigObj = useMode2RechargeWheelPageStore(
    (state) => state.wheelLevelConfigObj
  );

  const activeRechargeActiveTab = useRechargeWheelTabStore(
    (state) => state.activeRechargeActiveTab
  );

  const setSpinedRewardLevel = useMode2RechargeWheelPageStore(
    (state) => state.setSpinedRewardLevel
  );

  const setSpinedRewardIndex = useMode2RechargeWheelPageStore(
    (state) => state.setSpinedRewardIndex
  );

  const setSpinedRewardIsMoney = useMode2RechargeWheelPageStore(
    (state) => state.setSpinedRewardIsMoney
  );

  const setSpinedRewardValue = useMode2RechargeWheelPageStore(
    (state) => state.setSpinedRewardValue
  );

  const addSpinedAPIDoneCount = useMode2RechargeWheelPageStore(
    (state) => state.addSpinedAPIDoneCount
  );

  const setIsAnimatingObj = useMode2RechargeWheelPageStore(
    (state) => state.setIsAnimatingObj
  );

  const setIsCurrentWheelSlowSpin = useMode2RechargeWheelPageStore(
    (state) => state.setIsCurrentWheelSlowSpin
  );

  useUpdateEffect(() => {
    const level = rechargeWheelLevelTypeToNumberMapping[spinWheelLevel];

    triggerSpin({
      level,
    });
  }, [spinWheelCount, spinWheelLevel]);

  useDeepEffect(() => {
    if (
      isPostWheelPlayerSpinSuccess &&
      isPostWheelPlayerSpinSuccess &&
      !isEmpty(wheelLevelConfigObj)
    ) {
      const wheelLevel = get(
        playerSpinedData,
        'wheelLevel',
        RechargeWheelLevelType.TIER_SILVER
      );

      const rewardedLevelType =
        rechargeWheelLevelToWheelLevelTypeMapping[wheelLevel];

      setSpinedRewardLevel(rewardedLevelType);

      // 得獎的 Id 找出 對應的 index、isMoney、value

      const wheelSegmentId = get(playerSpinedData, 'wheelSegmentId');

      // handle missing wheelSegmentId error
      if (!isNumber(wheelSegmentId) && !wheelSegmentId) {
        console.error(
          'useRechargeWheelPlayerSpin is missing reward {{wheelSegmentId}}'
        );
        return;
      }

      const rewardedWheelSegments = get(
        wheelLevelConfigObj,
        `${rewardedLevelType}.wheelSegments`,
        []
      );

      if (isEmpty(rewardedWheelSegments)) {
        console.error(
          `useRechargeWheelPlayerSpin: Missing or invalid rewardedWheelSegments for level ${rewardedLevelType}`
        );
        return;
      }

      const rewardedSegmentIndex = rewardedWheelSegments.findIndex(
        (item) => item.id === wheelSegmentId
      );

      if (!isNumber(rewardedSegmentIndex) && !rewardedSegmentIndex) {
        console.error(
          `useRechargeWheelPlayerSpin can't find corresponded rewardedSegmentIndex through {{wheelSegmentId}} => ${wheelSegmentId}`
        );
        return;
      }

      const rewardedSegment = get(rewardedWheelSegments, rewardedSegmentIndex);

      if (!rewardedSegment) {
        console.error(
          `useRechargeWheelPlayerSpin can't find corresponded rewardedSegment through {{rewardedSegmentIndex}} => ${rewardedSegmentIndex}`
        );
        return;
      }

      const rewardedSegmentIsMoney =
        rewardedSegment.category === WheelSegmentCategoryResult.AMOUNT;

      const rewardedSegmentValue = !isArray(rewardedSegment.value)
        ? rewardedSegment.value
        : rewardedSegment.value[0] || -1;

      if (isArray(rewardedSegment.value)) {
        console.error(
          `useRechargeWheelPlayerSpin {{ rewardedSegment.value }} should be a number type, not array. {{rewardedSegment.value}} => ${rewardedSegment.value}`
        );
        return;
      }

      setSpinedRewardIndex(rewardedSegmentIndex);
      setSpinedRewardIsMoney(rewardedSegmentIsMoney);
      setSpinedRewardValue(rewardedSegmentValue);
      addSpinedAPIDoneCount();
    }
  }, [isPostWheelPlayerSpinSuccess, playerSpinedData, wheelLevelConfigObj]);

  // 如果失敗的話則讓他繼續轉動
  useEffect(() => {
    if (isPostWheelPlayerSpinError) {
      setIsAnimatingObj(activeRechargeActiveTab, false);
      setIsCurrentWheelSlowSpin(true);
    }
  }, [isPostWheelPlayerSpinError]);
};

export default useRechargeWheelPlayerSpin;

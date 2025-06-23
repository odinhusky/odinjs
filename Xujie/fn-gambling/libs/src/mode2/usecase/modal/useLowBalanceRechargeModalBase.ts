import { usePostPayBrokenConfigMutation } from '@libs/mode2/external/api';
import { BasePagePathObj } from '@libs/mode2/routerTypes/types';
import useLowBalanceRechargeModalStore from '@libs/mode2/zustand/modal/LowBalanceRechargeModal';
import { RechargeCard } from '@libs/mode2/zustand/page/WalletPage/useWalletPageRechargeCardStore';
import isEmpty from 'lodash/isEmpty';
import { useCallback, useEffect } from 'react';
import hallAdModelInvoker from '@mode2/usecase/announcement/command/HallAdModelInvoker';
import useModalLayoutStore, {
  HallAdModelCommandTypes,
} from '@libs/mode2/zustand/template/modalLayoutStore';
import { AnnouncementType } from '@libs/mode2/@types/announcementType';
import { SourceFrom } from '../announcement/command/HallAdModelCommand';
import dayjs from 'dayjs';
import { useLocationStore } from '@mode2/zustand/locationStore';

// const MAX_COUNTDOWN_DURATION = 5 * 60 * 1000; // 最大允許倒計時時間（單位：秒）

const WhitelistPage: string[] = [
  BasePagePathObj.HallPage,
  // BasePagePathObj.MoreGamePage,
];
/**
 * 彈窗出現時機：
 *   · 玩家退出遊戲、錢包小於₹30元時，3秒後跳出彈窗。(由後端控制推送)
 *   · 活動倒數5分鐘
 *   · 限時內關閉，首頁出現浮動按鈕
 *   · modal 關閉狀態，浮動按鈕持續顯示倒數, 點擊顯示modal
 *   · 倒數歸0，彈窗及浮動按鈕皆不可出現
 */
export const useLowBalanceRechargeModalBase = () => {
  const location = useLocationStore((state) => state.location);

  const hallAdModelCommandTypes = useModalLayoutStore(
    (state) => state.hallAdModelCommandTypes
  );

  const isShowLowBalanceRechargeModal = useLowBalanceRechargeModalStore(
    (state) => state.isShowLowBalanceRechargeModal
  );

  const lowBalanceRechargeLimitedOffersEndTime =
    useLowBalanceRechargeModalStore(
      (state) => state.lowBalanceRechargeLimitedOffersEndTime
    );
  const setShowLowBalanceRechargeModal = useLowBalanceRechargeModalStore(
    (state) => state.setShowLowBalanceRechargeModal
  );

  const setCurrentRecharge = useLowBalanceRechargeModalStore(
    (state) => state.setCurrentRecharge
  );

  const setRechargeOptions = useLowBalanceRechargeModalStore(
    (state) => state.setRechargeOptions
  );

  const currentPayChannel = useLowBalanceRechargeModalStore(
    (state) => state.currentPayChannel
  );

  const setCurrentPayChannel = useLowBalanceRechargeModalStore(
    (state) => state.setCurrentPayChannel
  );

  const setChannelOptions = useLowBalanceRechargeModalStore(
    (state) => state.setChannelOptions
  );

  const setCurrentRechargeCard = useLowBalanceRechargeModalStore(
    (state) => state.setCurrentRechargeCard
  );

  const [postPayBrokenConfig, { data, isSuccess }] =
    usePostPayBrokenConfigMutation();

  /**
   * useMobileExclusiveWalletPageOverride 中看到說：
   *  Evan [V6] 不分新老客，預設都勾選 Bonus
   */
  useEffect(() => {
    setCurrentRechargeCard(RechargeCard.TOP_UP_BONUS);

    if (isShowLowBalanceRechargeModal) {
      postPayBrokenConfig();
    }
  }, [isShowLowBalanceRechargeModal]);

  useEffect(() => {
    if (isSuccess && data?.payChannels.length) {
      setChannelOptions(data.payChannels);
      // 默认选中 isDefaultSelected 为 true 的支付渠道
      const defaultChannel = data.payChannels.find(
        (item) => item.isDefaultSelected
      );

      setCurrentPayChannel(defaultChannel ?? data.payChannels[0]);
    }
  }, [data, isSuccess]);

  // 支付通道改變
  useEffect(() => {
    if (!isEmpty(currentPayChannel)) {
      setRechargeOptions(currentPayChannel.options);
      if (currentPayChannel.options.length > 0) {
        setCurrentRecharge(currentPayChannel.options[0]);
      }
    }
  }, [currentPayChannel]);

  // NOTE Evan 出現時機只限於  [WEB_SOCKET or IMMEDIATE]
  const onLowBalanceRechargeShowAction = useCallback(
    (command: HallAdModelCommandTypes) => {
      // 如果是socket
      if (
        [SourceFrom.IMMEDIATE, SourceFrom.WEB_SOCKET].includes(command.from) &&
        lowBalanceRechargeLimitedOffersEndTime > dayjs().unix()
      ) {
        setShowLowBalanceRechargeModal(true);
        hallAdModelInvoker.removeCache(command.uniqueId);
      } else {
        useModalLayoutStore
          .getState()
          .verifyNextStep('LowBalanceRechargeShowAction');
      }
    },
    [lowBalanceRechargeLimitedOffersEndTime]
  );

  useEffect(() => {
    const isPass = WhitelistPage.includes(location?.pathname || '');
    if (
      isPass &&
      hallAdModelCommandTypes.type === AnnouncementType.LOW_BALANCE_RECHARGE
    ) {
      onLowBalanceRechargeShowAction(hallAdModelCommandTypes);
    }
  }, [location, hallAdModelCommandTypes]);
};

export default useLowBalanceRechargeModalBase;

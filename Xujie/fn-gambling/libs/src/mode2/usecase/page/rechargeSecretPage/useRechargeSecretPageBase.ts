import { usePostPayInboxConfigMutation } from '@libs/mode2/external/api';
import useRechargeSecretPageStore from '@libs/mode2/zustand/page/rechargeSecretPageStore';
import {
  RechargeCard,
  useWalletPageRechargeCardStore,
} from '@libs/mode2/zustand/page/WalletPage/useWalletPageRechargeCardStore';
import isEmpty from 'lodash/isEmpty';
import { useEffect } from 'react';
import { useUserProfileStore } from '@mode2/zustand/user/userProfileStore';
import { UserRoleType } from '@mode2/@types/userRoleTypes';

export const useRechargeSecretPageBase = () => {
  const setCurrentRecharge = useRechargeSecretPageStore(
    (state) => state.setCurrentRecharge
  );

  const setRechargeOptions = useRechargeSecretPageStore(
    (state) => state.setRechargeOptions
  );
  const setCurrentPayChannel = useRechargeSecretPageStore(
    (state) => state.setCurrentPayChannel
  );
  const setChannelOptions = useRechargeSecretPageStore(
    (state) => state.setChannelOptions
  );
  const setCurrentRechargeCard = useRechargeSecretPageStore(
    (state) => state.setCurrentRechargeCard
  );

  const currentPayChannel = useRechargeSecretPageStore(
    (state) => state.currentPayChannel
  );

  const upRechargeSecretLimitedOffersEndTime = useRechargeSecretPageStore(
    (state) => state.upRechargeSecretLimitedOffersEndTime
  );

  const setShowRechargeContent = useRechargeSecretPageStore(
    (state) => state.setShowRechargeContent
  );

  const userRole = useUserProfileStore((state) => state.userRole);

  const [postPayInboxConfig, { data, isSuccess }] =
    usePostPayInboxConfigMutation();

  useEffect(() => {
    if (isSuccess && !isEmpty(data)) {
      setChannelOptions(data.payChannels);
      upRechargeSecretLimitedOffersEndTime(data.limitedOfferEndTime);
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

  useEffect(() => {
    if (userRole === UserRoleType.USER) {
      postPayInboxConfig();
    }
  }, [userRole]);

  useEffect(() => {
    setShowRechargeContent(false);
    useWalletPageRechargeCardStore
      .getState()
      .setCurrentRechargeCard(RechargeCard.TOP_UP_BONUS);
    setCurrentRechargeCard(RechargeCard.TOP_UP_BONUS);
  }, []);
};

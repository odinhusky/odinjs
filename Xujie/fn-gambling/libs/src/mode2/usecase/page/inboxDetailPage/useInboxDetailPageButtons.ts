import useInboxDetailPageHeaderSettingOverride from './useInboxDetailPageHeaderSettingOverride';
import {
  handleFeedBackPageInBoxMessageDeleteBtnClick,
  handleFeedBackPageInBoxMessageModalGoNowBtnClick,
  handleFeedBackPageInBoxMessageModalToDepositBtnClick,
  handleFeedBackPageInBoxMessageReceiveBtnClick,
} from '@mode2/action/actionTypes';
import useFeedBackPageActions, {
  ActionClickPayloadMap,
} from '@libs/mode2/action/feedBackPageAction/useFeedBackPageActions';
import {
  MessageActionResult,
  MessageRewardClaimStatus,
} from '@libs/mode2/external/api/endpoint/message/PostMessageListEndpoint';
import { formatMoney } from '@libs/mode2/utils';
import useInboxDetailPageStore, { useMode2FeedBackPageInBoxStore } from '@libs/mode2/zustand/page/feedbackPageStore';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';

export const useInboxDetailPageButtons = () => {
  useInboxDetailPageHeaderSettingOverride();

  const { t } = useTranslation();
  const { handleFeedBackPageClick } = useFeedBackPageActions();

  const inboxDetail = useInboxDetailPageStore(
    (state) => state.inboxDetail
  );
  const isShowMessageModalGoNowBtn = useMode2FeedBackPageInBoxStore(
    (state) => state.isShowMessageModalGoNowBtn
  );
  const setButtonList = useMode2FeedBackPageInBoxStore(
    (state) => state.setButtonList
  );

  const getButtonActions = () => {
    const status = inboxDetail.isShowAttachments
      ? inboxDetail.status
      : undefined;
    const action = inboxDetail.action;
    console.log('@@@===> getButtonActions', status, inboxDetail);

    // status狀態行為
    const createAction = <T extends keyof ActionClickPayloadMap>(
      text: string,
      actionName: T,
      payload?: ActionClickPayloadMap[T] | undefined
    ) => ({
      text,
      onClick: () =>
        handleFeedBackPageClick({
          actionName,
          ...(payload && { payload }),
        }),
    });

    const mappingNavState: Record<MessageActionResult, string> = {
      CLOSE: '',
      FORWARD_RECHARGE: t('deposit_button'), // Deposit
      FORWARD_PERSONAL_INFO: '',
      FORWARD_BANK_CARD: '',
      FORWARD_SHARE_SPIN: t('deposit_wheel_spin_go'), // Go
      FORWARD_INBOX_RECHARGE: t('deposit_wheel_spin_go'), // Go
    };

    // 默認導向action行為
    const defaultActions = [
      createAction(
        t('inbox_delete_button'), // 'Delete'
        handleFeedBackPageInBoxMessageDeleteBtnClick,
        {
          ids: [inboxDetail.id],
        }
      ),
      isShowMessageModalGoNowBtn
        ? createAction(
            mappingNavState[action],
            handleFeedBackPageInBoxMessageModalGoNowBtnClick,
            { action }
          )
        : { text: '', onClick: () => {} },
    ];

    if (!status) {
      return defaultActions;
    }

    // [已到期 || 已領取] 都是刪除和充值
    if (inboxDetail.isExpired || inboxDetail.isClaim === 1) {
      return [
        createAction('Delete', handleFeedBackPageInBoxMessageDeleteBtnClick, {
          ids: [inboxDetail.id],
        }),
        isShowMessageModalGoNowBtn
          ? createAction(
              `${t('inbox_claim_button')} ${formatMoney({
                value: 1000,
                includeComma: false,
              })}`, // 'Claim',
              handleFeedBackPageInBoxMessageModalToDepositBtnClick
            )
          : { text: '', onClick: () => {} },
      ];
    }

    return [
      isShowMessageModalGoNowBtn
        ? createAction(
            `${t('inbox_claim_button')} ${formatMoney({
              value: 1000,
              includeComma: false,
            })}`, // 'Claim',
            handleFeedBackPageInBoxMessageModalToDepositBtnClick
          )
        : { text: '', onClick: () => {} },
      createAction(
        t('inbox_receive_button'), //'Receive',
        handleFeedBackPageInBoxMessageReceiveBtnClick,
        {
          ids:
            inboxDetail.status === MessageRewardClaimStatus.CLAIMABLE
              ? [inboxDetail.id]
              : [],

          totalReward: inboxDetail.reward,
        }
      ),
    ];
  };

  useEffect(() => {
    setButtonList(getButtonActions());
  }, [inboxDetail]);
};

export default useInboxDetailPageButtons;

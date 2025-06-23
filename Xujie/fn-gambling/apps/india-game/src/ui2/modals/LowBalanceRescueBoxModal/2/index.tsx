import BasePrimaryBtn from '@components/BasePrimaryBtn';
import { cx } from '@libs/commonUtils';
import BaseModal from '@libs/components/Modal';
import BaseCacheImg from '@libs/mode2/components/BaseCacheImg';
import { EResourceLevel, getImgUrl } from '@libs/mode2/utils';
import useLowBalanceRescueBoxModalBase from '@mode2/usecase/modal/useLowBalanceRescueBoxModalBase';
import { useFeatureFlagEnabled } from 'posthog-js/react';
import { PostHogFeatureTypes } from '@libs/mode2/utils/sdk/strategy/analytics/PostHogAnalytics';

import useLowBalanceRescueBoxModalActions from '@mode2/action/model/LowBalanceRescueBoxModalAction/useLowBalanceRescueBoxModalActions';
import {
  handleLowBalanceRescueBoxModalClaimBonusClick,
  handleLowBalanceRescueBoxModalCloseBtnClick,
} from '@libs/mode2/action/actionTypes';
import { DEBOUNCE_INTERVAL_500 } from '@libs/constant/debounce';
import useLowBalanceRescueBoxModalStore from '@libs/mode2/zustand/modal/LowBalanceRescueBoxModal';
import { FlipNumbersResType } from '@mode2/@types/flipNumbersResType';
import AnimationFlipNumbers from '@components/AnimationFlipNumbers';
import { useEffect } from 'react';
import {
  ScreenOrientationType,
  useTemplateLayoutStore,
} from '@mode2/zustand/template/templateLayoutStore';
import { CloseBtnUnit } from '@modals/BaseModalCloseButton';

export const LowBalanceRescueBoxModal = () => {
  useLowBalanceRescueBoxModalBase();

  const lowBalanceRescueBoxEnabled = useFeatureFlagEnabled(
    PostHogFeatureTypes.lowBalanceRescueBox.flag
  );

  const isShowLowBalanceRescueBoxModal = useLowBalanceRescueBoxModalStore(
    (state) => state.isShowLowBalanceRescueBoxModal
  );

  const lowBalanceRewardInfo = useLowBalanceRescueBoxModalStore(
    (state) => state.lowBalanceRewardInfo
  );

  const { handleLowBalanceRescueBoxModalClick } =
    useLowBalanceRescueBoxModalActions();

  const screenOrientation = useTemplateLayoutStore(
    (state) => state.screenOrientation
  );

  // 為了防止左右的滾動事件
  useEffect(() => {
    if (lowBalanceRescueBoxEnabled && isShowLowBalanceRescueBoxModal) {
      console.log('!! LowBalanceRescueBoxModal show');
      document.body.style.overflowX = 'hidden';
      document.body.style.overflowY = 'hidden';

      return () => {
        document.body.style.overflowX = '';
        document.body.style.overflowY = '';
      };
    }
  }, [lowBalanceRescueBoxEnabled, isShowLowBalanceRescueBoxModal]);

  return lowBalanceRescueBoxEnabled && isShowLowBalanceRescueBoxModal ? (
    <BaseModal
      className={cx('!bgi-[var(--transparent-gray-90)]', {
        '!justify-start pt-20':
          screenOrientation === ScreenOrientationType.Portrait,
      })}
    >
      <div
        className={cx({
          'px-6': screenOrientation === ScreenOrientationType.Portrait,
        })}
      >
        <div
          className={cx('relative', 'max-w-[432px] w-full h-fit', {
            'px-6': screenOrientation === ScreenOrientationType.Landscape,
          })}
        >
          <div className="w-full flex justify-end items-end mb-4 ">
            {/* 關閉按鈕 */}
            <CloseBtnUnit
              customClass="!border-none w-9 h-9 !p-0 rounded-none "
              onClose={() => {
                handleLowBalanceRescueBoxModalClick({
                  actionName: handleLowBalanceRescueBoxModalCloseBtnClick,
                });
              }}
            />
          </div>

          <BaseCacheImg
            className={''}
            src={getImgUrl(
              EResourceLevel.POPUP_BANNER,
              'popup_low_balance_rescue_box_modal_bg'
            )}
            alt="Low Balance Rescue Box Modal Background Image"
          />

          <div className="absolute top-[calc(50%-10px)] -translate-y-1/2 left-[calc(50%+4px)] -translate-x-1/2 ">
            <AnimationFlipNumbers
              hasDollarSign={false}
              numbers={`${lowBalanceRewardInfo.reward}`}
              height={40}
              resType={FlipNumbersResType.AMOUNT_NUMBER_V2}
            />
          </div>

          <BasePrimaryBtn
            className={cx('w-[172.8px] h-[38.79px] m-auto mt-5')}
            classNameText={cx('text-base')}
            children={'Claim Bonus'}
            onClick={() => {
              handleLowBalanceRescueBoxModalClick({
                actionName: handleLowBalanceRescueBoxModalClaimBonusClick,
              });
            }}
            debounceTimer={DEBOUNCE_INTERVAL_500}
          />

          {/* Claim Bonus */}
          {/*<div*/}
          {/*  className={cx(*/}
          {/*    'w-full',*/}
          {/*    FLEX_CENTER,*/}
          {/*    'absolute left-0',*/}
          {/*    '-bottom-[60px]'*/}
          {/*  )}*/}
          {/*>*/}
          {/*  <BasePrimaryBtn*/}
          {/*    className={cx('w-[172.8px] h-[38.79px]')}*/}
          {/*    classNameText={cx('text-base')}*/}
          {/*    children={'Claim Bonus'}*/}
          {/*    onClick={() => {*/}
          {/*      handleLowBalanceRescueBoxModalClick({*/}
          {/*        actionName: handleLowBalanceRescueBoxModalClaimBonusClick,*/}
          {/*      });*/}
          {/*    }}*/}
          {/*    debounceTimer={DEBOUNCE_INTERVAL_500}*/}
          {/*  />*/}
          {/*</div>*/}
        </div>
      </div>
    </BaseModal>
  ) : null;
};

export default LowBalanceRescueBoxModal;

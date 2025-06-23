import BaseModal from '@mode2/components/Modal';
import { EResourceLevel, getImgUrl } from '@mode2/utils';
import { useRebateRewardModalStore } from '@mode2/zustand/components/rebateRewardModalStore';
import useRebateRewardModalAction from '@mode2/action/rebateRewardModalAction/useRebateRewardModalAction';
import BaseCacheImg from '@libs/mode2/components/BaseCacheImg';
import { cx } from '@libs/commonUtils';
import { CloseBtnUnit } from '@modals/BaseModalCloseButton';
import BasePrimaryBtn from '@components/BasePrimaryBtn';
import { useMobileExclusiveMoneyBoxBase } from './useMobileExclusiveMoneyBoxBase';
import {
  handleCollectRewardBtnClick,
  handleCollectRewardCloseBtnClick,
} from '@mode2/action/actionTypes';
import AnimationFlipNumbers from '@components/AnimationFlipNumbers';
import { FlipNumbersResType } from '@mode2/@types/flipNumbersResType';
import {
  ScreenOrientationType,
  useTemplateLayoutStore,
} from '@libs/mode2/zustand/template/templateLayoutStore';

/** 存錢罐 */
export const MoneyBoxModal = () => {
  useMobileExclusiveMoneyBoxBase();
  const { handleRebateRewardModalClick } = useRebateRewardModalAction();

  const isShowRebateRewardModal = useRebateRewardModalStore(
    (state) => state.isShowRebateRewardModal
  );
  const currentCash = useRebateRewardModalStore((state) => state.currentCash);
  const screenOrientation = useTemplateLayoutStore(
    (state) => state.screenOrientation
  );

  return isShowRebateRewardModal ? (
    <BaseModal
      className={cx('!bgi-[var(--transparent-gray-90)]', {
        '!justify-start pt-20':
          screenOrientation === ScreenOrientationType.Portrait,
      })}
    >
      <div className={cx('w-[80%] max-w-[384px] relative')}>
        <div className="w-full flex justify-end items-end mb-4 ">
          <CloseBtnUnit
            customClass="!border-none w-9 h-9 !p-0 rounded-none"
            onClose={() => {
              handleRebateRewardModalClick({
                actionName: handleCollectRewardCloseBtnClick,
              });
            }}
          />
        </div>

        <div className="relative">
          <BaseCacheImg
            src={getImgUrl(
              EResourceLevel.POPUP_BANNER,
              'popup_daily_loss_rebate'
            )}
            imgName={'popup_daily_loss_rebate'}
          />
          <div
            className={cx(
              'absolute',
              'flex justify-center items-center',
              '-translate-y-1/2 top-1/2 left-1/2 -translate-x-1/2',
              ' mt-2 w-full px-9'
            )}
          >
            <AnimationFlipNumbers
              hasDollarSign={false}
              numbers={`${currentCash}`}
              height={36}
              resType={FlipNumbersResType.AMOUNT_NUMBER_V2}
            />
          </div>
        </div>

        <BasePrimaryBtn
          className="w-[196px] h-11 m-auto mt-5"
          classNameText="text-lg font-medium"
          children={'Collect'}
          onClick={() => {
            handleRebateRewardModalClick({
              actionName: handleCollectRewardBtnClick,
              payload: {
                currentCash: currentCash,
              },
            });
          }}
        />
      </div>
    </BaseModal>
  ) : null;
};

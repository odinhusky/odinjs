import SpinWheel from '@components/SpinWheel';
import { cx, useDeepEffect } from '@libs/commonUtils';
import { handleInviteWheelSpinButtonClick } from '@libs/mode2/action/inviteWheelPageAction/actionType';
import { useInviteWheelPageActions } from '@libs/mode2/action/inviteWheelPageAction/useInviteWheelPageActions';
import {
  useInviteWheelPageAnimateStore,
  useInviteWheelPageStoreStore,
} from '@libs/mode2/zustand/page/inviteWheelPageStore';
import { EResourceLevel, getImgUrl } from '@mode2/utils';
import { useRef } from 'react';
import { useToastStore } from '@mode2/zustand/components/toastStore';
import { useTranslation } from 'react-i18next';

const InvitationWheel = () => {
  const { t } = useTranslation();
  const { handleWheelSpinAnimation } = useInviteWheelPageActions();

  const inviteWheelRef = useRef<HTMLDivElement>(null);
  const { handleInviteWheelAction } = useInviteWheelPageActions();

  const isAnimating = useInviteWheelPageAnimateStore(
    (state) => state.isAnimating
  );

  const remindFreeSpin = useInviteWheelPageStoreStore(
    (state) => state.remindFreeSpin
  );
  const remindSpin = useInviteWheelPageStoreStore((state) => state.remindSpin);
  const inviteWheelPortalInfo = useInviteWheelPageStoreStore(
    (state) => state.inviteWheelPortalInfo
  );
  const spinedIndex = useInviteWheelPageStoreStore(
    (state) => state.spinedIndex
  );
  const spinedReward = useInviteWheelPageStoreStore(
    (state) => state.spinedReward
  );
  const spinFastTotate = useInviteWheelPageStoreStore(
    (state) => state.spinFastTotate
  );

  const showToast = useToastStore((state) => state.showToast);

  // 可以參與轉盤邏輯
  const isSpin =
    !inviteWheelPortalInfo.isWithdrawal && remindSpin + remindFreeSpin > 0;
  const tipsMessageI18n = inviteWheelPortalInfo.isWithdrawal
    ? 'spin_and_share_wheel_cash_out_before_spin_again_toast'
    : 'spin_and_share_wheel_zero_spin_toast';

  useDeepEffect(() => {
    if (isAnimating === false && spinFastTotate) {
      handleWheelSpinAnimation({
        ref: inviteWheelRef,
        selectedIdx: spinedIndex,
        rewardAmount: spinedReward,
      });
    }
  }, [isAnimating, spinedIndex, spinedReward, spinFastTotate]);

  return (
    <div className="w-full relative m-auto">
      <img
        className="w-full h-full object-contain "
        src={getImgUrl(EResourceLevel.V, 'bg_invite_wheel')}
        alt=""
      />

      <div
        className={cx(
          'overflow-hidden absolute top-0 left-0 right-0 bottom-0',
          'flex justify-center items-center',
          'p-[2.25rem] se:p-[2.5rem] phone:p-[4rem] mobile:p-[5rem]'
        )}
      >
        <SpinWheel
          category="invite"
          className="mx-auto"
          ref={inviteWheelRef}
          isAnimating={isAnimating}
          remindFreeSpin={remindFreeSpin}
          remainSpin={remindSpin}
          spinPartClassNameObj={{
            container: cx('', {
              'animate-wheel-prev-spin-infinitely': !isAnimating,
            }),
            rewardImageClass: cx(
              'w-[30px] h-[30px] mobile:w-[50px] mobile:h-[50px] mobile:ml-3'
            ),
            rewardTitleClass: cx('text-sm mobile:text-xl mobile:ml-3'),
          }}
          fixPartClassNameObj={{
            button: cx(
              'w-24 h-24 mobile:w-32 mobile:h-32 tablet:h-40 tablet:w-40'
            ),
          }}
          handleClickTrigger={() => {
            if (!isSpin) {
              showToast(t(tipsMessageI18n));
              return;
            }
            handleInviteWheelAction({
              actionName: handleInviteWheelSpinButtonClick,
              payload: { isSpin: true },
            });
          }}
          wheelSegments={inviteWheelPortalInfo.wheelSegments}
        />
      </div>

      <img
        className="absolute right-0 w-[25.6%] bottom-0 object-contain animate-up-baloon z-10"
        src={getImgUrl(EResourceLevel.V, 'img_god_wealth')}
        alt=""
      />
    </div>
  );
};

export default InvitationWheel;

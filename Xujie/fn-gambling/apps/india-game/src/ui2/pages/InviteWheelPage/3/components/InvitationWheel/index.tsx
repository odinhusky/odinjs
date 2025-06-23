import SpinWheel from '@components/SpinWheel';
import { cx, useDeepEffect } from '@libs/commonUtils';
import {
  handleInviteWheelPageNavToShareClickAction,
  handleInviteWheelSpinButtonClick,
} from '@mode2/action/actionTypes';
import { useInviteWheelPageActions } from '@libs/mode2/action/inviteWheelPageAction/useInviteWheelPageActions';
import {
  useInviteWheelPageAnimateStore,
  useInviteWheelPageStoreStore,
} from '@libs/mode2/zustand/page/inviteWheelPageStore';
import { EResourceLevel, getImgUrl } from '@mode2/utils';
import { useRef } from 'react';
import { useToastStore } from '@mode2/zustand/components/toastStore';
import { useTranslation } from 'react-i18next';
import useBindPlayerPhoneModalStore from '@libs/mode2/zustand/modal/BindPlayerPhoneModal';
import { useUserProfileStore } from '@libs/mode2/zustand/user/userProfileStore';
import { UserRoleType } from '@libs/mode2/@types/userRoleTypes';
import BaseCacheImg from '@libs/mode2/components/BaseCacheImg';

const InvitationWheel = () => {
  const { t } = useTranslation();
  const { handleWheelSpinAnimation } = useInviteWheelPageActions();

  const inviteWheelRef = useRef<HTMLDivElement>(null);
  const { handleInviteWheelAction } = useInviteWheelPageActions();

  const isAnimating = useInviteWheelPageAnimateStore(
    (state) => state.isAnimating
  );

  const prizeWheelIndex = useInviteWheelPageStoreStore(
    (state) => state.prizeWheelIndex
  );
  const remindFreeSpin = useInviteWheelPageStoreStore(
    (state) => state.remindFreeSpin
  );
  const spinFastTotate = useInviteWheelPageStoreStore(
    (state) => state.spinFastTotate
  );
  const spinedReward = useInviteWheelPageStoreStore(
    (state) => state.spinedReward
  );
  const remindSpin = useInviteWheelPageStoreStore((state) => state.remindSpin);
  const inviteWheelPortalInfo = useInviteWheelPageStoreStore(
    (state) => state.inviteWheelPortalInfo
  );

  const wheelSegments = inviteWheelPortalInfo.wheelSegments
    ? inviteWheelPortalInfo.wheelSegments.map((segment, index) => ({
        ...segment,
        icon: index + 14,
      }))
    : [];

  const showToast = useToastStore((state) => state.showToast);

  const setShowBindPlayerPhoneModal = useBindPlayerPhoneModalStore(
    (state) => state.setShowBindPlayerPhoneModal
  );

  const userRole = useUserProfileStore((state) => state.userRole);

  // 可以參與轉盤邏輯
  const isSpin =
    !inviteWheelPortalInfo.isWithdrawal &&
    remindSpin + remindFreeSpin > 0 &&
    inviteWheelPortalInfo.cumulativeReward <= 500;

  const tipsMessageI18n =
    inviteWheelPortalInfo.isWithdrawal ||
    inviteWheelPortalInfo.cumulativeReward >= 500
      ? 'spin_and_share_wheel_cash_out_before_spin_again_toast'
      : 'spin_and_share_wheel_zero_spin_toast';

  useDeepEffect(() => {
    if (isAnimating === false && spinFastTotate) {
      handleWheelSpinAnimation({
        ref: inviteWheelRef,
        selectedIdx: prizeWheelIndex,
        rewardAmount: spinedReward,
        rouletteRotateOffset: -22.5,
      });
    }
  }, [isAnimating, prizeWheelIndex, spinedReward, spinFastTotate]);

  return (
    <div className="w-full relative m-auto -mt-6">
      <BaseCacheImg
        className="w-full h-full object-contain "
        src={getImgUrl(EResourceLevel.V, 'bg_invite_wheel')}
        imgName="bg_invite_wheel"
        alt="bg_invite_wheel"
      />
      <BaseCacheImg
        className={cx('w-full h-full object-contain absolute top-0 left-0')}
        src={getImgUrl(EResourceLevel.V, 'invitation_wheel_background_light')}
        imgName="invitation_wheel_background_light"
        alt="invitation_wheel_background_light"
      />
      <BaseCacheImg
        className={cx('w-full h-full object-contain absolute top-0 left-0')}
        src={getImgUrl(EResourceLevel.V, 'invitation_wheel_background_light_1')}
        imgName="invitation_wheel_background_light_1"
        alt="invitation_wheel_background_light_1"
      />

      <div
        className={cx(
          'overflow-hidden absolute top-0 left-0 right-0 bottom-0',
          'flex justify-center items-center',
          'm-10'
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
            container: cx('container', {
              // 'animate-wheel-prev-spin-infinitely': !isAnimating,
            }),
            // surface: 'surface rotate-[20deg]',
            rewardImageClass: cx(
              'w-[64px] h-[64px] pb-[50%] -mt-2.5 ml-2.5 rewardImageClass'
            ),
            rewardTitleClass: cx(
              'text-xl mb-6 -mt-3 ml-4 rewardTitleClass rotate-[5deg]'
            ),
            rouletteRotateOffset: 22.5,
          }}
          fixPartClassNameObj={{
            button: cx('w-[200px] h-[200px] '),
            buttonSpinClass:
              '!text-[28px] bgi-text-[var(--base-1-60)] font-bold mt-4',
            buttonTextClass: '!text-lg bgi-text-[var(--base-1-60)] font-medium',
          }}
          extraPointerRender={() => {
            return (
              <BaseCacheImg
                className="absolute"
                alt={'invitation_wheel_pointer'}
                src={getImgUrl(EResourceLevel.V, 'invitation_wheel_pointer')}
                imgName="invitation_wheel_pointer"
              />
            );
          }}
          handleClickTrigger={() => {
            if (userRole === UserRoleType.PLAYER) {
              setShowBindPlayerPhoneModal(true);
              return;
            }

            if (!isSpin) {
              if (remindSpin + remindFreeSpin <= 0) {
                handleInviteWheelAction({
                  actionName: handleInviteWheelPageNavToShareClickAction,
                });
              }
              showToast(t(tipsMessageI18n));
              return;
            }

            handleInviteWheelAction({
              actionName: handleInviteWheelSpinButtonClick,
              payload: { isSpin: true },
            });
          }}
          wheelSegments={wheelSegments}
        />
      </div>

      {/* 上下跳動的動畫 animate-up-baloon */}
      <BaseCacheImg
        className="absolute right-0 w-[27.8%] bottom-8 object-contain z-10"
        src={getImgUrl(EResourceLevel.V, 'img_god_wealth')}
        imgName="img_god_wealth"
        alt="img_god_wealth"
      />
    </div>
  );
};

export default InvitationWheel;

import {
  handleInviteWheelClipboardReferralCodeClick,
  handleInviteWheelPageNavToShareClickAction,
} from '@mode2/action/inviteWheelPageAction/actionType';
import BasePrimaryBtn from '@components/BasePrimaryBtn';
import { useInviteWheelPageActions } from '@mode2/action/inviteWheelPageAction/useInviteWheelPageActions';
import { useTranslation } from 'react-i18next';
import AffixBottomWrapper from '@mode2/components/AffixBottomWrapper';
import { useMode2InviteEarnStore } from '@mode2/zustand/page/invitePageStore';
import { Icon } from '@components/Icon';
import cx from '@commonUtils/cx';
import { MOBILE_BREAK_POINT_MAX_WIDTH } from '@constant/style';

export const InviteWheelShareButton = () => {
  const { handleInviteWheelAction } = useInviteWheelPageActions();
  const { t } = useTranslation();

  const referralInfo = useMode2InviteEarnStore((state) => state.referralInfo);

  return (
    <div
      className={cx(
        'w-screen m-auto px-[48px]',
        MOBILE_BREAK_POINT_MAX_WIDTH,
        '-mt-6 z-10'
      )}
    >
      <div
        className={cx(
          'flex justify-center gap-2 items-center',
          'text-lg font-medium bgi-text-[var(--grayscale-100)]'
        )}
      >
        {/* TODO i18n*/}
        {t(`My Invitation Code: ${referralInfo.code}`)}
        <Icon
          className={'w-5 h-6 cursor-pointer'}
          name={'ic_copy_1'}
          onClick={() => {
            handleInviteWheelAction({
              actionName: handleInviteWheelClipboardReferralCodeClick,
              payload: { ...referralInfo },
            });
          }}
        />
      </div>

      <BasePrimaryBtn
        className="z-[1] w-full m-auto px-1 mt-1.5 rounded-full min-h-12 text-base font-medium"
        onClick={() => {
          handleInviteWheelAction({
            actionName: handleInviteWheelPageNavToShareClickAction,
          });
        }}
        children={t('earn_invite_rewards_invite_button')}
      />
    </div>
  );
  // return (
  //   <AffixBottomWrapper
  //     hasBottomNav
  //     offset={-3}
  //     rootClassName={'w-full'}
  //     notAffixContainerClass={'w-full -mt-2'}
  //     affixContainerClass=" -mx-4 p-4"
  //   >
  //     <div
  //       className={cx(
  //         'w-screen m-auto px-[48px]',
  //         MOBILE_BREAK_POINT_MAX_WIDTH
  //       )}
  //     >
  //       <div
  //         className={cx(
  //           'flex justify-center gap-2 items-center',
  //           'text-lg font-medium bgi-text-[var(--grayscale-100)]'
  //         )}
  //       >
  //         {/* TODO i18n*/}
  //         {t(`My Invitation Code: ${referralInfo.code}`)}
  //         <Icon
  //           className={'w-5 h-6 cursor-pointer'}
  //           name={'ic_copy_1'}
  //           onClick={() => {
  //             handleInviteWheelAction({
  //               actionName: handleInviteWheelClipboardReferralCodeClick,
  //               payload: { ...referralInfo },
  //             });
  //           }}
  //         />
  //       </div>
  //
  //       <BasePrimaryBtn
  //         className="z-[1] w-full m-auto px-1 mt-1.5 rounded-full"
  //         onClick={() => {
  //           handleInviteWheelAction({
  //             actionName: handleInviteWheelPageNavToShareClickAction,
  //           });
  //         }}
  //         children={t('earn_invite_rewards_invite_button')}
  //       />
  //     </div>
  //   </AffixBottomWrapper>
  // );
};

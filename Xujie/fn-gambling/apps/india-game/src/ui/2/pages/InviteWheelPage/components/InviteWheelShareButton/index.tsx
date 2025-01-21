import { handleInviteWheelPageNavToShareClickAction } from '@mode2/action/inviteWheelPageAction/actionType';
import BasePrimaryBtn from '@components/BasePrimaryBtn';
import { useInviteWheelPageActions } from '@mode2/action/inviteWheelPageAction/useInviteWheelPageActions';
import { useTranslation } from 'react-i18next';
import AffixBottomWrapper from '@mode2/components/AffixBottomWrapper';

export const InviteWheelShareButton = () => {
  const { handleInviteWheelAction } = useInviteWheelPageActions();
  const { t } = useTranslation();

  return (
    <AffixBottomWrapper
      hasBottomNav
      offset={-3}
      affixContainerClass=" -mx-4 p-4"
    >
      <BasePrimaryBtn
        className="z-[1] w-auto m-auto px-8"
        onClick={() => {
          handleInviteWheelAction({
            actionName: handleInviteWheelPageNavToShareClickAction,
          });
        }}
        children={t('earn_invite_rewards_invite_button')}
      />
    </AffixBottomWrapper>
  );
};

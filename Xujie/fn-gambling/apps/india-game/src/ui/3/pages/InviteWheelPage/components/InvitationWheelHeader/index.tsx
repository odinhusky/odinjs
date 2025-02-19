import cx from '@commonUtils/cx';
import InviteWheelMarquee from '@/ui/3/pages/InviteWheelPage/components/InviteWheelMarquee';
import {
  handleInviteWheelPageNavToRecordClickAction,
  handleInviteWheelPageOpenRuleModalClickAction,
} from '@mode2/action/inviteWheelPageAction/actionType';
import { Icon } from '@components/Icon';
import { useInviteWheelPageActions } from '@mode2/action/inviteWheelPageAction/useInviteWheelPageActions';

export const InvitationWheelHeader = () => {
  const { handleInviteWheelAction } = useInviteWheelPageActions();
  return (
    <div
      className={cx(
        'w-full absolute top-1/2 -translate-y-1/2 pl-[40px]',
        'flex justify-between items-center'
      )}
    >
      <InviteWheelMarquee />

      <div className="flex w-full justify-end items-end gap-4 ">
        <Icon
          className={cx('h-7 w-7 cursor-pointer')}
          name={'ic_tips'}
          onClick={() => {
            handleInviteWheelAction({
              actionName: handleInviteWheelPageOpenRuleModalClickAction,
            });
          }}
        />
        <Icon
          className={cx('h-7 w-7 cursor-pointer')}
          name={'ic_team_data'}
          onClick={() => {
            handleInviteWheelAction({
              actionName: handleInviteWheelPageNavToRecordClickAction,
            });
          }}
        />
      </div>
    </div>
  );
};

export default InvitationWheelHeader;

import { handleTeamClubWithDrawReceivedOKButtonClick } from '@mode2/action/actionTypes';
import { useTeamClubAction } from '@/action/teamClub/useTeamClubAction';
import { useTeamClubWithDrawStore } from '@libs/mode2/zustand/components/myRewardsContent';
import InfoModal from '@modals/InfoModal';
import { useTranslation } from 'react-i18next';

export const TeamClubWithdrawReceivedModal = () => {
  const { t } = useTranslation();
  const { handleTeamClubClick } = useTeamClubAction();

  const isShowReceivedModal = useTeamClubWithDrawStore(
    (state) => state.isShowReceivedModal
  );

  return isShowReceivedModal ? (
    <>
      {/* // TODO I18N 缺漏 */}
      <InfoModal
        isShow={true}
        title={'Congratulations!!'}
        content={'Your commission has already been withdrawn to your wallet.'}
        confirmBtnText={t(
          'balance_record_deposit_record_receipt_notice_popup_confirm_button'
        )}
        onConfirmClick={() => {
          handleTeamClubClick({
            actionName: handleTeamClubWithDrawReceivedOKButtonClick,
          });
        }}
      />
    </>
  ) : null;
};

export default TeamClubWithdrawReceivedModal;

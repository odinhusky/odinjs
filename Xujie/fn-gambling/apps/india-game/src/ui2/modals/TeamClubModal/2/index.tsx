import BaseModal from '@libs/components/Modal';
import { useTeamClubModalBase } from '@libs/mode2/usecase/modal/useTeamClubModalBase';
import { getImgUrl, EResourceLevel } from '@libs/mode2/utils';
import useTeamClubModalStore from '@libs/mode2/zustand/modal/TeamClubModal';
import { BaseCacheImg } from '@mode2/components/BaseCacheImg';
import { useTeamClubModalActions } from '@libs/mode2/action/model/TeamClubModalAction/useSurpriseRewardModalActions';
import {
  handleTeamClubModalBtnClickAction,
  handleTeamClubModalCloseClickAction,
} from '@mode2/action/actionTypes';
import { CloseBtnUnit } from '@modals/BaseModalCloseButton';
import {
  ScreenOrientationType,
  useTemplateLayoutStore,
} from '@libs/mode2/zustand/template/templateLayoutStore';
import { cx } from '@libs/commonUtils';

export const TeamClubModal = () => {
  useTeamClubModalBase();

  const { handleTeamClubModalClick } = useTeamClubModalActions();

  const isShowTeamClubModal = useTeamClubModalStore(
    (state) => state.isShowTeamClubModal
  );
  const screenOrientation = useTemplateLayoutStore(
    (state) => state.screenOrientation
  );

  return isShowTeamClubModal ? (
    <BaseModal
      className={cx('!bgi-[var(--transparent-gray-90)]', {
        '!justify-start pt-20':
          screenOrientation === ScreenOrientationType.Portrait,
      })}
    >
      <div className="w-96 ">
        <div className="w-full flex justify-end items-end mb-4 ">
          <CloseBtnUnit
            customClass="!border-none w-9 h-9 !p-0 rounded-none"
            onClose={() => {
              handleTeamClubModalClick({
                actionName: handleTeamClubModalCloseClickAction,
              });
            }}
          />
        </div>

        <BaseCacheImg
          className={'cursor-pointer object-contain'}
          src={getImgUrl(EResourceLevel.POPUP_BANNER, 'popup_club')}
          imgName="popup_club"
          alt={'popup_club'}
          onClick={() => {
            handleTeamClubModalClick({
              actionName: handleTeamClubModalBtnClickAction,
            });
          }}
          onLoad={() => {}}
          onError={(e) => {}}
        />
      </div>
    </BaseModal>
  ) : null;
};
export default TeamClubModal;

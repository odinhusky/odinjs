import { cx } from '@libs/commonUtils';
import BaseModal from '@libs/components/Modal';
import Checkbox from '@libs/mode2/components/Checkbox';
import { EResourceLevel, getImgUrl } from '@libs/mode2/utils';
import { useInviteWheelModalBase } from '@mode2/usecase/modal/useInviteWheelModalBase';
import { useTranslation } from 'react-i18next';
import { BaseCacheImg } from '@mode2/components/BaseCacheImg';
import useInviteWheelModalStore from '@libs/mode2/zustand/modal/InviteWheelModal';
import { useInviteWheelModalActions } from '@mode2/action/model/InviteWheelModalAction/useInviteWheelModalAction';
import {
  handleInviteWheelModalBtnClickAction,
  handleInviteWheelModalCheckBoxClickAction,
  handleInviteWheelModalCloseClickAction,
} from '@mode2/action/actionTypes';
import { CloseBtnUnit } from '@modals/BaseModalCloseButton';
import {
  ScreenOrientationType,
  useTemplateLayoutStore,
} from '@libs/mode2/zustand/template/templateLayoutStore';

export const InviteWheelModal = () => {
  const { t } = useTranslation();
  useInviteWheelModalBase();

  const { handleInviteWheelModalClick } = useInviteWheelModalActions();

  const isShowInviteWheelModal = useInviteWheelModalStore(
    (state) => state.isShowInviteWheelModal
  );
  const isNotShowToday = useInviteWheelModalStore(
    (state) => state.isNotShowToday
  );
  const screenOrientation = useTemplateLayoutStore(
    (state) => state.screenOrientation
  );

  return false ? (
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
              handleInviteWheelModalClick({
                actionName: handleInviteWheelModalCloseClickAction,
              });
            }}
          />
        </div>

        <BaseCacheImg
          className={'cursor-pointer object-contain'}
          src={getImgUrl(EResourceLevel.POPUP_BANNER, 'popup_invite_wheel')}
          imgName="popup_invite_wheel"
          alt={'popup_invite_wheel'}
          onClick={(e) => {
            e.stopPropagation();
            handleInviteWheelModalClick({
              actionName: handleInviteWheelModalBtnClickAction,
            });
          }}
          onLoad={() => {}}
          onError={(e) => {}}
        />

        <div className={cx('mt-5 flex justify-center')}>
          <Checkbox
            checked={isNotShowToday}
            checkName={getImgUrl(EResourceLevel.ICONS, 'ic_check_box')}
            uncheckName={getImgUrl(
              EResourceLevel.ICONS,
              'ic_check_box_unchecked'
            )}
            onChange={() => {
              handleInviteWheelModalClick({
                actionName: handleInviteWheelModalCheckBoxClickAction,
              });
            }}
            iconClassName="w-4 h-4"
            textClassName="text-xs ml-1"
            label={t('home_popup_donot_show_again')}
          />
        </div>
      </div>
    </BaseModal>
  ) : null;
};
export default InviteWheelModal;

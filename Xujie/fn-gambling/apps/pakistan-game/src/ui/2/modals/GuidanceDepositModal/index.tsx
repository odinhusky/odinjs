import BaseModal from '@libs/components/Modal';
import 'swiper/css';
import 'swiper/css/pagination';
import React from 'react';
import { EResourceLevel, getImgUrl } from '@mode2/utils';
import Icon from '@mode2/components/Icon';
import cx from '@commonUtils/cx';
import { useGuidanceDepositModalActions } from '@mode2/action/model/GuidanceDepositModal/useGuidanceDepositModalActions';
import {
  handleGuidanceDepositModalCloseClickAction,
  handleGuidanceDepositModalNavToWalletAction,
} from '@mode2/action/model/GuidanceDepositModal/actionType';
import { useGuidanceDepositModalStore } from '@mode2/zustand/modal/GuidanceDepositModal/useGuidanceDepositModalStore';

const GuidanceDepositModal = () => {
  const { handleGuidanceDepositModalActions } =
    useGuidanceDepositModalActions();
  const isShowGuidanceDepositModal = useGuidanceDepositModalStore(
    (state) => state.isShowGuidanceDepositModal
  );
  return isShowGuidanceDepositModal ? (
    <BaseModal>
      <div
        className={
          'm-auto flex flex-col justify-center items-center gap-2 relative'
        }
      >
        <Icon
          name="ic_close"
          color={'var(--transparent-white-70)'}
          className={cx(
            'hidden mobile:block',
            'w-8 h-8 p-1 cursor-pointer',
            'absolute top-2 right-2',
            'border border-[var(--transparent-white-70)] rounded-full',
            'hover:brightness-[1.15] active:brightness-[0.85]'
          )}
          onClick={() => {
            handleGuidanceDepositModalActions({
              actionName: handleGuidanceDepositModalCloseClickAction,
            });
          }}
        />
        <img
          className={cx(
            'w-[328px] max-h-[349px]',
            'mobile:w-[453px] mobile:max-h-[482px]',
            'object-contain cursor-pointer'
          )}
          alt={'recharge_popup'}
          src={getImgUrl(EResourceLevel.POPUP_BANNER, 'recharge_popup')}
          onClick={() => {
            handleGuidanceDepositModalActions({
              actionName: handleGuidanceDepositModalNavToWalletAction,
            });
          }}
        />
        <Icon
          name={'ic_close'}
          color={'var(--transparent-white-70)'}
          className={cx(
            'block mobile:hidden',
            'w-6 h-6 p-1 cursor-pointer',
            'border border-[var(--transparent-white-70)] rounded-full',
            'hover:brightness-[1.15] active:brightness-[0.85]'
          )}
          onClick={() => {
            handleGuidanceDepositModalActions({
              actionName: handleGuidanceDepositModalCloseClickAction,
            });
          }}
        />
      </div>
    </BaseModal>
  ) : null;
};
export default GuidanceDepositModal;

import Modal from '@/components/BaseModal/api';
import { IMyModifyModalProps } from './types';
import { useState } from 'react';
import { EResourceLevel, getImgUrl } from '@mode2/utils';
import cx from '@commonUtils/cx';
import BaseModal from '@libs/components/Modal';
import { useTranslation } from 'react-i18next';
import { useUserProfileStore } from '@libs/mode2/zustand/user/userProfileStore';
import { handleMyPageUserInfoAvatarSaveBtnClick } from '@libs/mode2/action/myPageAction/acitonType';
import Icon from '@components/Icon';
import BasePrimaryBtn from '@components/BasePrimaryBtn';
import { MOBILE_BREAK_POINT_MAX_WIDTH } from '@libs/constant/style';

export const MyModifyModal = (props: IMyModifyModalProps) => {
  const { t } = useTranslation();
  const heads = new Array(16).fill(1);
  const avatarOrder = useUserProfileStore((state) => state.avatarOrder);
  const [curAvatarSelectOrder, setCurAvatarSelectOrder] = useState<number>(
    Number(avatarOrder)
  );

  return (
    <BaseModal className="!bgi-[var(--background-middle)]">
      <div
        className={cx(
          MOBILE_BREAK_POINT_MAX_WIDTH,
          'flex flex-col h-full',
          'bgi-[var(--background-dark)]',
          'overflow-auto'
        )}
      >
        <div
          className={cx(
            MOBILE_BREAK_POINT_MAX_WIDTH,
            'fixed flex h-20 bgi-[var(--base-2-variant5)] z-[1] top-0 left-0 right-0 justify-center items-center'
          )}
        >
          <button
            className="absolute left-4"
            onClick={() => {
              Modal.hide();
            }}
          >
            <Icon className={'h-7 w-7'} name={'ic_back_header'} />
          </button>
          <div
            className={cx(
              'text-2xl font-medium text-center bgi-text-[var(--grayscale-100)]'
            )}
          >
            {/* TODO i18n  */}
            Choose the avatar you like
          </div>
        </div>

        <div className="flex flex-col gap-6 pt-10 px-8 mt-20 justify-center items-center">
          <div className="flex flex-wrap gap-16 justify-center items-center">
            {heads.map((_, index) => {
              const currentHeadOrder = index + 1;

              return (
                <div
                  key={index}
                  className={cx(
                    'relative w-24 h-24 flex-shrink-0 cursor-pointer'
                  )}
                  onClick={() => {
                    setCurAvatarSelectOrder(currentHeadOrder);
                  }}
                >
                  <img
                    className={cx('w-full h-full flex-shrink-0', {
                      'border-[2px] bgi-border-[var(--base-1-main)] rounded-full':
                        curAvatarSelectOrder === currentHeadOrder,
                    })}
                    src={getImgUrl(EResourceLevel.V, `avatar_${index + 1}`)}
                    alt="head"
                  />
                </div>
              );
            })}
          </div>

          {/* 儲存按鈕 */}
          <div className="w-full sticky bottom-0 bgi-[var(--bg-main)]">
            <BasePrimaryBtn
              className={cx(
                'py-2 px-4 text-lg',
                'shadow-[0px_4px_4px_0px_#cccccc40_inset,0px_-4px_4px_0px_#33333340_inset]',
                'mb-4'
              )}
              children={t('earn_money_earn_btn_save')}
              onClick={() => {
                if (props?.handleMyPageClick instanceof Function) {
                  props.handleMyPageClick({
                    actionName: handleMyPageUserInfoAvatarSaveBtnClick,
                    payload: {
                      selectedAvatarOrder: `${curAvatarSelectOrder}`,
                      selectedAvatarFrameOrder: `0`, // [IN][V6]不需要外邊框
                    },
                  });

                  Modal.hide();
                }
              }}
            />
          </div>
        </div>
      </div>
    </BaseModal>
  );
};

export const showMyModifyModal = (props?: IMyModifyModalProps) => {
  return Modal.show({
    content: (
      <MyModifyModal
        {...(props || {})}
        onClose={() => {
          Modal.hide();
          props?.onClose?.();
        }}
      />
    ),
  });
};

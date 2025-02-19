import Modal from '@/components/BaseModal/api';
import { IMyModifyModalProps } from './types';
import { useState } from 'react';
import { EResourceLevel, getImgUrl } from '@mode2/utils';
import cx from '@commonUtils/cx';
import BaseModal from '@libs/components/Modal';
import { useTranslation } from 'react-i18next';
import { useUserProfileStore } from '@libs/mode2/zustand/user/userProfileStore';
import {
  handleMyPageHomeBtnClick,
  handleMyPageUserInfoAvatarSaveBtnClick,
} from '@libs/mode2/action/myPageAction/acitonType';
import Icon from '@components/Icon';
import BasePrimaryBtn from '@components/BasePrimaryBtn';
import { getAvatarFrameOrder } from '@libs/commonUtils';

export const MyModifyModal = (props: IMyModifyModalProps) => {
  const { t } = useTranslation();
  const heads = new Array(16).fill(1);
  const headBorders = new Array(16).fill(1);
  const avatarOrder = useUserProfileStore((state) => state.avatarOrder);
  const avatarFrameOrder = useUserProfileStore(
    (state) => state.avatarFrameOrder
  );
  const [curAvatarSelectOrder, setCurAvatarSelectOrder] = useState<number>(
    Number(avatarOrder)
  );
  const [curAvatarFrameSelectOrder, setCurAvatarFrameSelectOrder] =
    useState<number>(Number(avatarFrameOrder));

  return (
    <BaseModal>
      <div
        className="flex flex-col w-full h-full bgi-text-[var(--grayscale-100)]
            bgi-[var(--bg-main)] rounded-lg
            border-[var(--grayscale-50)] mobile:border border-0
            shadow-[4px_4px_8px_0px_#00000040] overflow-auto
            mobile:max-w-[400px] mobile:h-[90%]"
      >
        <div
          className="relative w-full p-2 text-lg text-center font-semibold
              bgi-[var(--base-1-main)] mobile:block hidden mobile:sticky mobile:top-0 mobile:z-10"
        >
          {t('account_popup_avatar_head_modify_avatar')}
          <button
            className="absolute top-1/2 right-[18px] -translate-y-1/2"
            onClick={() => {
              Modal.hide();
            }}
          >
            <Icon className="w-6 h-6" name="ic_close" />
          </button>
        </div>

        <div
          className="fixed mobile:flex-none flex h-11 bgi-[var(--grayscale-00)] z-[1]
              top-0 left-0 right-0 p-2 justify-between items-center"
        >
          <button
            className="flex gap-2 justify-center items-center"
            onClick={() => {
              Modal.hide();
            }}
          >
            <Icon
              className={'h-5 w-5'}
              name={'ic_arrow_left_1'}
              color="var(--base-2-main)"
            />
            <span
              className={'text-sm font-medium bgi-text-[var(--base-2-main)]'}
            >
              {t('account_popup_avatar_head_modify_avatar')}
            </span>
          </button>
          <button
            onClick={() => {
              if (props?.handleMyPageClick instanceof Function) {
                props.handleMyPageClick({
                  actionName: handleMyPageHomeBtnClick,
                });

                Modal.hide();
              }
            }}
          >
            <Icon
              className={'h-5 w-5'}
              name={'ic_home'}
              color="var(--base-2-main)"
            />
          </button>
        </div>

        <div className="flex flex-col gap-6 p-6 mobile:mt-0 mt-11 justify-center items-center">
          <div className="grid grid-cols-4 gap-y-3 gap-x-4">
            {heads.map((data, index) => {
              const thisHeadOrder = index + 1;
              return (
                <div
                  className="relative w-[74px] h-[74px] cursor-pointer"
                  onClick={() => {
                    setCurAvatarSelectOrder(thisHeadOrder);
                  }}
                >
                  <img
                    className="w-[74px] h-[74px]"
                    src={getImgUrl(EResourceLevel.V, `avatar_${index + 1}`)}
                    alt="head"
                  />
                  {curAvatarSelectOrder === thisHeadOrder && (
                    <img
                      className="absolute w-[88px] h-[88px] max-w-none top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                      src={getImgUrl(EResourceLevel.V, `avatars_light`)}
                      alt="head"
                    />
                  )}
                </div>
              );
            })}
          </div>
          <div className="w-full h-[2px] bgi-[var(--linear-3)]" />
          <div className="grid grid-cols-4 gap-y-3 gap-x-4">
            {headBorders.map((data, index) => {
              const thisHeadBorderOrder = index + 1;
              return (
                <div
                  className={cx(
                    'relative flex w-[74px] h-[74px] rounded-full bgi-[var(--transparent-gray-70)]',
                    'justify-center items-center overflow-hidden cursor-pointer'
                  )}
                  onClick={() => {
                    setCurAvatarFrameSelectOrder(thisHeadBorderOrder);
                  }}
                  style={
                    curAvatarFrameSelectOrder === thisHeadBorderOrder
                      ? { background: 'var(--bg-main)' }
                      : {}
                  }
                >
                  <img
                    className="w-[60px] h-[60px]"
                    src={getImgUrl(
                      EResourceLevel.V,
                      `avatar_frame_${getAvatarFrameOrder(thisHeadBorderOrder)}`
                    )}
                    alt="head"
                  />
                  {curAvatarFrameSelectOrder !== index + 1 && (
                    <div className="absolute top-0 bottom-0 left-0 right-0 bgi-[var(--transparent-gray-70)]" />
                  )}
                </div>
              );
            })}
          </div>

          {/* 儲存按鈕 */}
          <div className="w-full sticky bottom-0 bgi-[var(--bg-main)]">
            <BasePrimaryBtn
              className={cx(
                'py-2 px-4',
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
                      selectedAvatarFrameOrder: `${curAvatarFrameSelectOrder}`,
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

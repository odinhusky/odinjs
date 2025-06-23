import React, { useCallback, useEffect } from 'react';
import cx from '@commonUtils/cx';
import BaseModal from '@mode2/components/Modal';
import { EResourceLevel, getImgUrl } from '@mode2/utils';
import sdkUtils from '@mode2/utils/sdk';
import useForceUpdateModalStore from '@libs/mode2/zustand/components/forceUpdateModalStore';
import useForceUpdateModalActions from '@libs/mode2/action/components/forceUpdateModalAction/useForceUpdateModalActions';
import { handleCloseForceUpdateModalBtnClick } from '@mode2/action/actionTypes';
import { AppLocalStorageKey } from '@libs/mode2/utils/sdk/persistant/storageKey';
import dayjs from '@commonUtils/localizedDayjs';
import { Icon } from '@components/Icon';

export const ForceUpdateModal = () => {
  const { handleForceUpdateModalClick } = useForceUpdateModalActions();

  const isShowForceUpdateModal = useForceUpdateModalStore(
    (state) => state.isShowForceUpdateModal
  );

  const isWeakUpdate = useForceUpdateModalStore((state) => state.isWeakUpdate);

  const setIsShowForceUpdateModal = useForceUpdateModalStore(
    (state) => state.setIsShowForceUpdateModal
  );

  const setIsWeakUpdate = useForceUpdateModalStore(
    (state) => state.setIsWeakUpdate
  );

  const onClose = useCallback(
    isWeakUpdate
      ? () => {
          setIsShowForceUpdateModal(false);
        }
      : () => {},
    [isWeakUpdate]
  );

  // 檢查是否有最新的版本可以更新(強更新)
  useEffect(() => {
    if (sdkUtils.availableNewVersionApk()) {
      setIsShowForceUpdateModal(true);
      setIsWeakUpdate(false);
    }
  }, []);

  // 檢查是否有最新的版本可以更新(強更新)
  useEffect(() => {
    if (sdkUtils.availableLazyNewVersionApk()) {
      // 改 date unix 後續擴展 Exp 才會方便
      // unix 為秒數
      const now = dayjs().unix();
      const expUnix = 60 * 60 * 6;
      const lastRun = Number(
        sdkUtils.getStorage(AppLocalStorageKey.LAST_WEAK_UPDATE_RUNTIME) || 0
      );

      if (lastRun + expUnix < now) {
        // 更新上次執行的日期為今天
        sdkUtils.setStorage(
          AppLocalStorageKey.LAST_WEAK_UPDATE_RUNTIME,
          `${now}`
        );
        setIsShowForceUpdateModal(true);
        setIsWeakUpdate(true);
      } else {
        setIsWeakUpdate(true);
      }
    }
  }, []);

  return isShowForceUpdateModal ? (
    <BaseModal onClick={onClose} className="!bgi-[var(--transparent-gray-90)]">
      <>
        <div className={cx('flex flex-col w-full text-center w-[372px]')}>
          {sdkUtils.availableLazyNewVersionApk() ? (
            <Icon
              className={'w-8 h-8 self-end cursor-pointer'}
              name={'ic_close'}
              onClick={onClose}
            />
          ) : null}

          <img
            className={'w-[372px] cursor-pointer object-contain'}
            src={getImgUrl(EResourceLevel.POPUP_BANNER, 'popup_update')}
            alt="Force update popup background image"
            onClick={() => {
              handleForceUpdateModalClick({
                actionName: handleCloseForceUpdateModalBtnClick,
              });
            }}
          />
        </div>
      </>
    </BaseModal>
  ) : null;
};

export default ForceUpdateModal;

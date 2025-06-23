import React, { useCallback, useEffect } from 'react';
import cx from '@commonUtils/cx';
import BaseModal from '@mode2/components/Modal';
import { EResourceLevel, getImgUrl } from '@mode2/utils';
import sdkUtils from '@mode2/utils/sdk';
import { useBreakPoint } from '@libs/commonUtils';
import useForceUpdateModalStore from '@libs/mode2/zustand/components/forceUpdateModalStore';
import { useTranslation } from 'react-i18next';
import { FLEX_CENTER } from '@libs/constant/style';
import useForceUpdateModalActions from '@libs/mode2/action/components/forceUpdateModalAction/useForceUpdateModalActions';
import { handleCloseForceUpdateModalBtnClick } from '@mode2/action/actionTypes';
import { AppLocalStorageKey } from '@libs/mode2/utils/sdk/persistant/storageKey';
import dayjs from '@commonUtils/localizedDayjs';
import BasePrimaryBtn from '@components/BasePrimaryBtn';

export const ForceUpdateModal = () => {
  const { isMobile, isDesktop, isTablet } = useBreakPoint();
  const { t, i18n } = useTranslation();

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
    <BaseModal onClick={onClose}>
      <>
        <div
          className={cx('relative w-full text-center', {
            'h-[312px] w-[328px]': isMobile,
            'h-[380px] w-[400px]': isTablet || isDesktop,
          })}
        >
          <img
            src={getImgUrl(
              EResourceLevel.POPUP_BANNER,
              'popup_update_' + i18n.language
            )}
            alt="Force update popup background image"
          />

          <div
            className={cx(
              'absolute left-[36px]',
              {
                'w-[256px] h-[80px] bottom-[34px] text-sm': isMobile,
                'w-[328px] h-[72px] bottom-[56px] text-base':
                  isTablet || isDesktop,
              },
              FLEX_CENTER,
              'text-center bgi-text-[var(--grayscale-100)]'
            )}
          >
            {t('popup_home_discover_exciting_new_features')}
          </div>
        </div>

        <BasePrimaryBtn
          className={cx(
            'w-[128px] mobile:w-[140px]',
            'px-4 py-1 mobile:py-2',
            'font-medium',
            'mt-4'
          )}
          onClick={() => {
            handleForceUpdateModalClick({
              actionName: handleCloseForceUpdateModalBtnClick,
            });
          }}
          children={t('popup_home_btn_update_now')}
        />
      </>
    </BaseModal>
  ) : null;
};

export default ForceUpdateModal;

import BasePrimaryBtn from '@components/BasePrimaryBtn';
import BaseSecondaryBtn from '@components/BaseSecondaryBtn';
import Icon from '@components/Icon';
import { cx } from '@libs/commonUtils';
import BaseModal from '@libs/components/Modal';
import { FLEX_ITEMS_CENTER } from '@libs/constant/style';
import useGlobalAnnouncementStore from '@mode2/zustand/modal/GlobalAnnouncementModal/index';
import { useTranslation } from 'react-i18next';
import useGlobalAnnouncementModalBase from '@mode2/usecase/modal/useGlobalAnnouncementModalBase';
import useGlobalNoticeModalAction from '@mode2/action/globalNoticeModalAction/useGlobalNoticeModalAction';
import {
  handleGlobalNoticeModalActionClick,
  handleGlobalNoticeModalCloseClick,
} from '@mode2/action/actionTypes';
import InnerHtmlWrapper from '@components/InnerHtmlWrapper';

const Buttons = () => {
  const { t } = useTranslation();
  const { handleGlobalNoticeModalClick } = useGlobalNoticeModalAction();
  const globalNoticeData = useGlobalAnnouncementStore(
    (state) => state.globalNoticeData
  );

  return globalNoticeData.isShowActionButton &&
    globalNoticeData.isShowCloseButton ? (
    <div className="h-12 flex justify-between items-center gap-4">
      {globalNoticeData.isShowCloseButton ? (
        <BaseSecondaryBtn
          children={t('withdrawable_hint_cancel_button')}
          className="h-full"
          classNameText="text-lg font-medium"
          onClick={() =>
            handleGlobalNoticeModalClick({
              actionName: handleGlobalNoticeModalCloseClick,
            })
          }
        />
      ) : null}
      {globalNoticeData.isShowActionButton ? (
        <BasePrimaryBtn
          children={'TODO Action'}
          className="h-full"
          classNameText="text-lg font-medium"
          onClick={() =>
            handleGlobalNoticeModalClick({
              actionName: handleGlobalNoticeModalActionClick,
              payload: {
                action: 'todo',
              },
            })
          }
        />
      ) : null}
    </div>
  ) : null;
};
export const GlobalAnnouncementModal = () => {
  useGlobalAnnouncementModalBase();
  const { handleGlobalNoticeModalClick } = useGlobalNoticeModalAction();

  const isShowGlobalAnnouncementModal = useGlobalAnnouncementStore(
    (state) => state.isShowGlobalAnnouncementModal
  );

  const globalNoticeData = useGlobalAnnouncementStore(
    (state) => state.globalNoticeData
  );

  return isShowGlobalAnnouncementModal ? (
    <BaseModal className="bgi-[var(--transparent-gray-90)]">
      <div
        className={cx(
          'w-[408px]',
          'p-4 box-border flex flex-col gap-4',
          'bgi-text-[var(--grayscale-100)]',
          'border-2 border-[var(--base-1-main)] bgi-[var(--base-2-variant9)] rounded-xl'
        )}
      >
        <div
          className={cx(
            FLEX_ITEMS_CENTER,
            'justify-between gap-3',
            'pb-3 border-b border-[var(--transparent-white-10)]'
          )}
        >
          <span className="w-11/12 text-lg font-medium break-words whitespace-pre-wrap">
            {globalNoticeData.title}
          </span>
          <Icon
            name="ic_close"
            className="w-6 h-6"
            onClick={() =>
              handleGlobalNoticeModalClick({
                actionName: handleGlobalNoticeModalCloseClick,
              })
            }
          />
        </div>

        <InnerHtmlWrapper
          className={cx('mt-1')}
          __html={globalNoticeData.message}
        />

        <Buttons />
      </div>
    </BaseModal>
  ) : null;
};

export default GlobalAnnouncementModal;

import BaseModal from '@libs/components/Modal';
import { cx } from '@libs/commonUtils';
import { FLEX_ITEMS_CENTER } from '@constant/style';
import { Icon } from '@components/Icon';
import { BaseCacheImg } from '@mode2/components/BaseCacheImg';
import BasePrimaryBtn from '@components/BasePrimaryBtn';
import { useDynamicActivityModalBase } from '@mode2/usecase/modal/useDynamicActivityModalBase';
import useDynamicActivityModalStore from '@mode2/zustand/modal/DynamicActivityModal';
import { useDynamicActivityModalAction } from '@mode2/action/model/DynamicActivityModalAction/useDynamicActivityModalAction';
import {
  handleDynamicActivityModalCloseClickAction,
  handleDynamicActivityModalNavButtonClick,
} from '@mode2/action/actionTypes';
import InnerHtmlWrapper from '@components/InnerHtmlWrapper';

export const DynamicActivityModal = () => {
  useDynamicActivityModalBase();

  const currentDynamicContent = useDynamicActivityModalStore(
    (state) => state.currentDynamicContent
  );
  const isShowDynamicActivityModal = useDynamicActivityModalStore(
    (state) => state.isShowDynamicActivityModal
  );

  const { handleDynamicActivityModalClick } = useDynamicActivityModalAction();

  return isShowDynamicActivityModal ? (
    <BaseModal className="bgi-[var(--transparent-gray-90)]">
      <div
        className={cx(
          'w-[408px]',
          'p-4 box-border flex flex-col gap-4',
          'bgi-text-[var(--grayscale-100)]',
          'border-2 border-[var(--base-1-main)] bgi-[var(--base-2-variant9)] rounded-xl',
          'max-h-[90%]'
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
            {currentDynamicContent.popupTitle}
          </span>
          <Icon
            name="ic_close"
            className="w-6 h-6 cursor-pointer"
            onClick={() =>
              handleDynamicActivityModalClick({
                actionName: handleDynamicActivityModalCloseClickAction,
                payload: {
                  uniqueId: currentDynamicContent.uniqueId,
                  orderId: currentDynamicContent.orderId,
                },
              })
            }
          />
        </div>

        {currentDynamicContent.popupBannerUrl ? (
          <BaseCacheImg
            className={cx('w-full', 'object-contain')}
            src={currentDynamicContent.popupBannerUrl}
            imgName={`currentDynamicContent.popupBannerUrl`}
          />
        ) : null}

        <InnerHtmlWrapper
          className={cx('mt-1')}
          __html={currentDynamicContent.popupInnerHtml}
        />

        <BasePrimaryBtn
          children={'Play Now!'}
          className="h-full py-3 text-base h-[48px]"
          classNameText="text-lg font-medium"
          onClick={() =>
            handleDynamicActivityModalClick({
              actionName: handleDynamicActivityModalNavButtonClick,
              payload: {
                uniqueId: currentDynamicContent.uniqueId,
                orderId: currentDynamicContent.orderId,
              },
            })
          }
        />
      </div>
    </BaseModal>
  ) : null;
};

export default DynamicActivityModal;

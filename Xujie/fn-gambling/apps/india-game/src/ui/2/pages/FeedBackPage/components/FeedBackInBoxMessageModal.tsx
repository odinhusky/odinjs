import { cx } from '@libs/commonUtils';
import BaseModal from '@libs/components/Modal';
import { FLEX_CENTER, FLEX_COL } from '@libs/constant/style';
import Icon from '@components/Icon';
import { useMode2FeedBackPageInBoxStore } from '@libs/mode2/zustand/page/feedbackPageStore';
import { formatDate } from '@libs/mode2/utils';
import BasePrimaryBtn from '@components/BasePrimaryBtn';
import { useTranslation } from 'react-i18next';
import useFeedBackPageActions from '@libs/mode2/action/feedBackPageAction/useFeedBackPageActions';
import {
  handleFeedBackPageInBoxMessageModalCloseBtnClick,
  handleFeedBackPageInBoxMessageModalGoNowBtnClick,
} from '@libs/mode2/action/feedBackPageAction/acitonType';
import { useEffect } from 'react';
import { BasePagePathObj } from '@libs/mode2/routerTypes/types';
import { useLocation } from 'react-router';

export const FeedBackInBoxMessageModal = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const isShowMessageModal = useMode2FeedBackPageInBoxStore(
    (state) => state.isShowMessageModal
  );

  const curMessageData = useMode2FeedBackPageInBoxStore(
    (state) => state.curMessageData
  );

  const isShowMessageModalGoNowBtn = useMode2FeedBackPageInBoxStore(
    (state) => state.isShowMessageModalGoNowBtn
  );

  const setIsShowMessageModal = useMode2FeedBackPageInBoxStore(
    (state) => state.setIsShowMessageModal
  );

  const { handleFeedBackPageClick } = useFeedBackPageActions();

  useEffect(() => {
    if (location.pathname !== BasePagePathObj.FeedBackPage)
      setIsShowMessageModal(false);
  }, [location]);

  return isShowMessageModal ? (
    <BaseModal>
      <div
        className={cx(
          'w-[328px] h-[428px]',
          'mobile:w-[352] mobile:h-[528px]',
          'overflow-y-auto',
          'bgi-[var(--linear-8-main)]',
          'p-4 mobile:px-6 mobile:py-8',
          'rounded-lg border border-[var(--grayscale-30)]',
          'relative',
          FLEX_COL,
          'gap-3'
        )}
      >
        {/* 關閉按鈕 */}
        <button
          className={cx(
            'w-6 h-6',
            FLEX_CENTER,
            'absolute top-4 right-3',
            'border rounded-[50%]'
          )}
          onClick={() => {
            handleFeedBackPageClick({
              actionName: handleFeedBackPageInBoxMessageModalCloseBtnClick,
            });
          }}
        >
          <Icon name="ic_close" className="w-4 h-4" />
        </button>

        <div className={cx('modal_head', FLEX_COL, 'gap-2')}>
          {/* 標題 */}
          <h2
            className={cx(
              'm-0 pr-2',
              'block',
              'text-lg mobile:text-xl',
              'font-semibold',
              'bgi-text-[var(--grayscale-100)]'
            )}
          >
            {curMessageData.title}
          </h2>

          {/* 時間 */}
          <span
            className={cx(
              'bgi-text-[var(--transparent-white-50)]',
              'text-xxs',
              'mobile:text-xs'
            )}
          >
            {formatDate(curMessageData.createdAt)}
          </span>

          {/* 分隔線 */}
          <div className={cx('bgi-[var(--title-line)] w-full h-[2px]')}></div>
        </div>

        <div className={cx('modal_body', 'flex-1', FLEX_COL, 'gap-3')}>
          {/* 內容 */}
          <div
            className={cx(
              'mb-auto',
              'bgi-text-[var(--grayscale-100)] text-sm mobile:text-base'
            )}
            dangerouslySetInnerHTML={{
              __html: curMessageData.content,
            }}
          />

          {/* 按鈕的有無 */}
          {isShowMessageModalGoNowBtn ? (
            <BasePrimaryBtn
              className={cx('w-full')}
              onClick={() => {
                handleFeedBackPageClick({
                  actionName: handleFeedBackPageInBoxMessageModalGoNowBtnClick,
                  payload: {
                    action: curMessageData.action,
                  },
                });
              }}
            >
              {t('help_center_inbox_btn_go_now')}
            </BasePrimaryBtn>
          ) : null}
        </div>
      </div>
    </BaseModal>
  ) : null;
};

export default FeedBackInBoxMessageModal;

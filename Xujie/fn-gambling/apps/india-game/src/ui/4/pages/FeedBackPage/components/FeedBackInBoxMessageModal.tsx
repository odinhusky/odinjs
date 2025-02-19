import { cx } from '@libs/commonUtils';
import {
  FLEX_CENTER,
  FLEX_COL,
  MOBILE_BREAK_POINT_MAX_WIDTH,
} from '@libs/constant/style';
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
import Icon from '@components/Icon';

// TODO Ronan
// TODO i18n
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
    if (location.pathname !== BasePagePathObj.FeedBackPage) {
      setIsShowMessageModal(false);
    }
  }, [location]);

  return isShowMessageModal ? (
    <div
      className={cx(
        MOBILE_BREAK_POINT_MAX_WIDTH,
        'w-full h-full absolute top-0 left-1/2 -translate-x-1/2 z-50 bgi-[var(--background-light)]'
      )}
    >
      {/* 關閉按鈕 */}
      <div
        className={cx(FLEX_CENTER, 'h-20', 'bgi-[var(--base-2-variant5)]')}
        onClick={() => {
          handleFeedBackPageClick({
            actionName: handleFeedBackPageInBoxMessageModalCloseBtnClick,
          });
        }}
      >
        <Icon name="ic_back_header" className="w-7 h-7 absolute left-4" />
        <div className="text-2xl font-medium bgi-text-[var(--grayscale-100)]">
          Mail details
        </div>
      </div>

      <div className={cx('overflow-y-auto', 'py-4', 'relative', FLEX_COL)}>
        <div>
          {/* 標題 */}
          <h2
            className={cx(
              'text-xl px-4 font-medium',
              'bgi-text-[var(--grayscale-100)]'
            )}
          >
            {curMessageData.title}
          </h2>

          {/* 時間 */}
          <div
            className={cx(
              'pb-2 px-4 box-border text-base font-medium',
              'bgi-text-[var(--base-2-variant2)]',
              'border-b border-[var(--base-2-variant6)]'
            )}
          >
            {formatDate(curMessageData.createdAt)}
          </div>

          {/* 分隔線 */}
          <div className={cx('bgi-[var(--title-line)] w-full h-[2px]')}></div>
        </div>

        <div className={cx('py-2 px-4 box-border')}>
          {/* 內容 */}
          <div
            className={cx(
              'mb-auto',
              'bgi-text-[var(--grayscale-90)] text-sm font-medium'
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
    </div>
  ) : null;
};

export default FeedBackInBoxMessageModal;

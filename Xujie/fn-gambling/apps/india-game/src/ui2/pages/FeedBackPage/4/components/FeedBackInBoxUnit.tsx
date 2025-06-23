import { cx } from '@libs/commonUtils';
import { FLEX_CENTER, FLEX_ITEMS_CENTER } from '@libs/constant/style';
import { handleFeedBackPageInBoxMessageClick } from '@mode2/action/actionTypes';
import useFeedBackPageActions from '@libs/mode2/action/feedBackPageAction/useFeedBackPageActions';
import Icon from '@components/Icon';
import { MessageInfoResult } from '@libs/mode2/external/api/endpoint/message/PostMessageListEndpoint';
import { EResourceLevel, formatDate, getImgUrl } from '@libs/mode2/utils';
import { forwardRef } from 'react';

interface FeedBackInBoxUnitProps {
  data: MessageInfoResult;
}

export const FeedBackInBoxUnit = forwardRef<
  HTMLDivElement,
  FeedBackInBoxUnitProps
>(({ data }, ref) => {
  const { handleFeedBackPageClick } = useFeedBackPageActions();

  return (
    <div
      ref={ref}
      key={data.indexKey}
      className={cx(
        'w-full min-h-[86px] px-3 box-border relative',
        FLEX_ITEMS_CENTER,
        {
          // 'bgi-[var(--base-1-variant4)]': reward > 0 || !data.isRead,
          // 'bgi-[var(--transparent-white-20)]': reward === 0 && data.isRead,
          'bgi-[var(--base-1-variant4)]': !data.isRead,
          'bgi-[var(--transparent-white-20)]': data.isRead,
        },
        'rounded-md cursor-pointer'
      )}
      onClick={() => {
        handleFeedBackPageClick({
          actionName: handleFeedBackPageInBoxMessageClick,
          payload: {
            data,
          },
        });
      }}
    >
      <img
        className={cx('h-full absolute left-0 top-0 rounded-md')}
        src={getImgUrl(
          EResourceLevel.ICONS,
          data.isRead ? 'mail_element_read' : 'mail_element_unread'
          // reward === 0 && data.isRead
          //   ? 'mail_element_read'
          //  : 'mail_element_unread'
        )}
        alt="mail_element_unread"
      />

      {/* 右上角嘆號icon */}
      {data.reward > 0 && data.isClaim === 0 ? (
        <div className={cx('absolute -top-1 -right-1')}>
          <Icon name="ic_tips_2_fill_2" className="w-5 h-5" />
        </div>
      ) : null}

      {/* Icon */}
      <div className={cx('w-12 h-12', FLEX_CENTER, 'relative')}>
        {data.isRead ? (
          <Icon
            name={'ic_mail_read_2'}
            // name={reward > 0 ? 'ic_mail_read_1' : 'ic_mail_read_2'}
            className="w-full h-full"
          />
        ) : (
          <Icon name="ic_mail_unread" className="w-full h-full" />
        )}

        {/* 左側固定禮物盒icon */}
        {data.reward > 0 ? (
          <div
            className={cx(
              'absolute bottom-3 right-0 p-0.5 rounded-full bgi-[var(--base-2-variant4)]'
            )}
          >
            <Icon name="ic_gift_box" className="w-3 h-3" />
          </div>
        ) : null}
      </div>

      <div
        className={cx(
          'absolute left-[103px]',
          'flex flex-col h-full justify-between items-start py-1.5'
        )}
      >
        {/* 內文 */}
        <div
          className={cx(
            'relative z-10 pr-3 box-border',
            'text-base font-medium',
            // 'flex',
            {
              'bgi-text-[var(--base-2-variant2)]': data.isRead,
              'bgi-text-[var(--base-1-40)]': !data.isRead,
            }
            // reward === 0 && data.isRead
            //   ? 'bgi-text-[var(--base-2-variant2)]'
            //   : 'bgi-text-[var(--base-1-40)]'
          )}
        >
          {/* 標題前的禮物盒icon */}
          {data.reward > 0 ? (
            <img
              src={getImgUrl(EResourceLevel.ICONS, 'ic_mail_benefits')}
              alt="ic_mail_benefits"
              className="w-6 h-6 inline"
            />
          ) : null}

          {/* 標題兩邊之右紙幣icon */}
          {data.isShowAttachments && data.isClaim === 0 ? (
            <img
              src={getImgUrl(EResourceLevel.ICONS, 'ic_mail_activity')}
              alt="ic_mail_activity"
              className="w-6 h-6 inline"
            />
          ) : null}

          <span className="break-all"> {data.title}</span>

          {/* 標題兩邊之左紙幣icon */}
          {data.isShowAttachments && data.isClaim === 0 ? (
            <img
              src={getImgUrl(EResourceLevel.ICONS, 'ic_mail_activity')}
              alt="ic_mail_activity"
              className="w-6 h-6 inline"
            />
          ) : null}
        </div>

        {/* 時間 */}
        <div
          className={cx(
            'text-xs px-2.5 py-0.5 box-border rounded-full',
            FLEX_ITEMS_CENTER,
            ' gap-1',
            {
              'bgi-[var(--base-2-variant6)]': data.isRead,
              'bgi-[var(--base-1-60)]': !data.isRead,
            }
            // reward === 0 && data.isRead
            //   ? 'bgi-[var(--base-2-variant6)]'
            //   : 'bgi-[var(--base-1-60)]'
          )}
        >
          <Icon
            name={
              data.isRead ? 'ic_pending_outline_2' : 'ic_pending_outline_1'

              // reward === 0 && data.isRead
              //   ? 'ic_pending_outline_2'
              //   : 'ic_pending_outline_1'
            }
            className="w-[18px] h-[18px]"
          />
          <div
            className={cx(
              {
                'bgi-text-[var(--base-2-variant2)]': data.isRead,
                'bgi-text-[var(--base-1-90)]': !data.isRead,
              }
              // reward === 0 && data.isRead
              //   ? 'bgi-text-[var(--base-2-variant2)]'
              //   : 'bgi-text-[var(--base-1-90)]'
            )}
          >
            {formatDate(data.createdAt, 'YYYY-MM-DD HH:mm')}
          </div>
        </div>
      </div>
    </div>
  );
});

export default FeedBackInBoxUnit;

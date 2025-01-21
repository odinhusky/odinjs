import RedDot from '@components/RedDot';
import { cx } from '@libs/commonUtils';
import { FLEX_CENTER, FLEX_ITEMS_CENTER } from '@libs/constant/style';
import { handleFeedBackPageInBoxMessageClick } from '@libs/mode2/action/feedBackPageAction/acitonType';
import useFeedBackPageActions from '@libs/mode2/action/feedBackPageAction/useFeedBackPageActions';
import Icon from '@libs/mode2/components/Icon';
import { MessageInfoResult } from '@libs/mode2/external/api/endpoint/message/PostMessageListEndpoint';
import { formatDate } from '@libs/mode2/utils';
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
      className={cx(
        'notice_unit',
        'w-full',
        'h-[60px] mobile:h-[64px]',
        FLEX_ITEMS_CENTER,
        'rounded',
        'p-3 mobile:px-6',
        'gap-3',
        {
          'bgi-[var(--linear-8-main)]': !data.isRead,
          'bgi-[var(--linear-8-dark)]': data.isRead,
        },
        'cursor-pointer'
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
      {/* Icon */}
      <div
        className={cx(
          'w-9 h-9',
          'mobile:w-10 mobile:h-10',
          'bgi-[var(--transparent-white-30)]',
          'rounded-full',
          'p-1.5',
          FLEX_CENTER,
          'relative'
        )}
      >
        {data.isRead ? (
          <Icon name="ic_inbox_notify" className="w-full" color='var(--grayscale-70)' />
        ) : (
          <>
            <Icon name="ic_customer_support" className="w-full" color='var(--grayscale-00)' />
            <RedDot className={'absolute w-[6px] h-[6px] top-[3px] right-[3px]'} />
          </>
        )}
      </div>

      {/* 內文 */}
      <div
        className={cx('flex-1', 'truncate ...', 'text-xs mobile:text-base font-medium', {
          'bgi-text-[var(--grayscale-00)]': !data.isRead,
          'bgi-text-[var(--grayscale-70)]': data.isRead,
        })}
      >
        {data.title}
      </div>

      {/* 時間 */}
      <div
        className={cx(
          'text-center',
          'mobile:flex mobile items-center mobile:gap-1',
          'bgi-text-[var(--transparent-white-70)]',
          'text-xxs mobile:text-xs font-normal'
        )}
      >
        <div className="hidden mobile:block">{formatDate(data.createdAt)}</div>

        <div className={cx('text-center mobile:hidden')}>
          <div>{formatDate(data.createdAt).split(' ')[0]}</div>
          <div>{formatDate(data.createdAt).split(' ')[1]}</div>
        </div>
      </div>
    </div>
  );
});

export default FeedBackInBoxUnit;

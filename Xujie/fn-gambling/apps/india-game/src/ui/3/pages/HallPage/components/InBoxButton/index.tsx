import useHeaderAction from '@mode2/action/components/header/headerAction';
import { cx } from '@libs/commonUtils';
import { handleInBoxActionClick } from '@mode2/action/components/header/actionType';
import { Icon } from '@components/Icon';
import { useMode2FeedBackPageInBoxStore } from '@mode2/zustand/page/feedbackPageStore';
import { Badge } from 'antd';

export const InBoxButton = () => {
  const { handleHeaderClick } = useHeaderAction();
  const noticeUnreadCount = useMode2FeedBackPageInBoxStore(
    (state) => state.noticeUnreadCount
  );
  return (
    <div
      className={cx(
        'w-[54px] h-[54px]',
        'font-bold bgi-text-[var(--base-1-main)] text-[13px] whitespace-nowrap',
        'cursor-pointer relative'
      )}
      onClick={() => {
        handleHeaderClick({
          actionName: handleInBoxActionClick,
        });
      }}
    >
      <Badge
        classNames={{
          root: cx('absolute z-[2] -translate-x-0 top-2 right-2 '),
        }}
        size="small"
        count={noticeUnreadCount}
      ></Badge>
      <Icon className={cx('w-10 h-10 my-2')} name={'ic_mail_unread'} />
    </div>
  );
};

export default InBoxButton;

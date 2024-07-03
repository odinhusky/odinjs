import { INotificationDrawer } from '../../types/INotificationDrawer';
import { useNotificationDrawer } from '../../hooks/useNotificationDrawer';
import React, { useEffect, useMemo, useRef } from 'react';
import cx from '../../../../utils/cx';
import { GetMailListResponseData } from '../../../../../external/MailEndpoint';
import { environment } from '../../../../../../environments/environment';
import useShowShortcut from '../../../../popovers/AddToMobileShortcut/hooks/useShowShortcut';
import useBreakpoint from '../../../../pageTemplate/hooks/useBreakpoint';

type NotificationData = {
  realIndex: number;
  isRead: boolean;
  isExpandable: boolean;
} & GetMailListResponseData;

type INotificationItem = {
  _index: number;
  length: number;
  item: NotificationData;
  handleClick: (
    event: React.MouseEvent<HTMLDivElement>,
    index: number,
    unRead: boolean,
    mailId: number
  ) => void;
};

const NotificationItem = (props: INotificationItem) => {
  const { _index, length, item, handleClick } = props;
  return (
    <div
      className={cx(
        'px-3 py-3 mobile:py-5 bg-linear-4-main flex flex-col gap-y-5',
        _index == 0 ? 'rounded-t-xl' : '',
        _index === length - 1 ? 'rounded-b-xl' : '',
        ''
      )}
      onClick={(event: React.MouseEvent<HTMLDivElement>) => {
        handleClick(event, item.realIndex, item.is_read === 0, item.id);
      }}
    >
      <div className={'flex justify-end items-center gap-x-5'}>
        <div
          className={cx(
            'flex gap-1 text-start text-sm font-bold flex-1 items-center'
          )}
        >
          {item.is_read === 0 && (
            <div className="bg-state-warn-main w-3 h-3 rounded-full" />
          )}
          {item.title}
        </div>

        <div className={cx('flex gap-x-3')}>
          <div className={cx('text-[var(--transparent-white-70)]')}>
            {item.created_at}
          </div>
          <img
            alt="arrow"
            className="h-5 w-5"
            src={`assets/${environment.uVersion}/${
              !item.isExpandable ? 'icon_arrow_down' : 'icon_arrow_up'
            }.png`}
          />
        </div>
      </div>
      {item.isExpandable && (
        <div className={cx('text-sm text-[var(--grayscale-100)] opacity-90')}>
          {item.content}
        </div>
      )}
    </div>
  );
};

const NotificationDrawer = ({ closeDrawer }: INotificationDrawer) => {
  const { messages, expandableIndex, handleClick } = useNotificationDrawer();
  const notificationSlice: NotificationData[][] = useMemo(() => {
    const notifications: NotificationData[] = messages.map((item, index) => {
      return {
        realIndex: index,
        isRead: item.is_read === 1,
        isExpandable: index === expandableIndex,
        ...item,
      };
    });
    if (expandableIndex != null) {
      const sliceStart = notifications.slice(0, expandableIndex);
      const expandable = notifications[expandableIndex];
      const sliceEnd = notifications.slice(
        expandableIndex + 1,
        notifications.length
      );
      return [sliceStart, [expandable], sliceEnd];
    }
    return [notifications];
  }, [messages, expandableIndex]);

  const scrollRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<HTMLDivElement[]>([]);

  const scrollToMiddle = (index: number) => {
    if (scrollRef.current && itemRefs.current[index]) {
      const parentHeight = scrollRef.current.clientHeight;
      const child = itemRefs.current[index];
      const childHeight = child.clientHeight;

      const offsetTop = child.offsetTop;
      const scrollPosition = offsetTop - parentHeight / 2 + childHeight / 2;
      scrollRef.current.scrollTop = scrollPosition;
    }
  };

  useEffect(() => {
    if (expandableIndex != null) {
      const resultIndex = notificationSlice.reduce(
        (minIdx, current, idx, arr) => {
          return current.length < arr[minIdx].length ? idx : minIdx;
        },
        0
      );
      scrollToMiddle(resultIndex);
    }
  }, [notificationSlice, expandableIndex]);
  const isShowShortcut = useShowShortcut();
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let count = 0; //首次点击不执行关闭
    const handleClickOutside = (event: any) => {
      const isTargetOrChildOfTarget =
        ref.current && ref.current.contains(event.target);
      if (!isTargetOrChildOfTarget && count) {
        closeDrawer();
      }
      count++;
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      count = 0;
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);
  const { isDesktop } = useBreakpoint()
  return (
    <div ref={ref}>
      <div className={cx(
        "fixed flex w-full z-[1001] right-0 mobile:top-16 top-[60px]",
        "mobile:w-[560px] h-6 bg-header",
        { 'h-24': !isDesktop && isShowShortcut },
      )}/>
      <div
        className={cx(
          'mt-6 h-[calc(100%-24px-60px)]',
          'fixed z-[1005] right-0 mobile:top-16 top-[60px]',
          'flex flex-col text-[var(--grayscale-100)] bg-header',
          'w-full mobile:w-[560px]',
          'gap-2 tablet:gap-5 mobile:gap-4',
          'px-5 pb-8',
          'shadow-[-4px_0px_20px_0px_#00000080]',
          { 'pb-24 mt-24': !isDesktop && isShowShortcut },
        )}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        {/* title */}
        <div
          className={cx('text-center text-base mobile:text-lg font-bold mb-5')}
        >
          Centro de Notificação
        </div>

        {/* 列表 */}
        <div
          ref={scrollRef}
          className={cx(
            'flex flex-col h-full overflow-y-auto space-y-3 mobile:space-y-5'
          )}
        >
          {notificationSlice.map((items, index) => {
            return (
              <div
                key={index}
                className={cx(
                  'flex flex-col rounded-xl',
                  items.length > 0 ? 'border-stroke-popup-1 ' : ''
                )}
                ref={(el) => (itemRefs.current[index] = el!)}
              >
                <div className={''}>
                  {items.map((item, _index) => {
                    return NotificationItem({
                      _index: _index,
                      length: items.length,
                      item: item,
                      handleClick: handleClick,
                    });
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default NotificationDrawer;

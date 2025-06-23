import Icon from '@components/Icon';
import { cx } from '@libs/commonUtils';
import { FLEX_CENTER, FLEX_ITEMS_CENTER } from '@libs/constant/style';
import { AnnouncementType } from '@libs/mode2/@types/announcementType';
import {
  MissionResult,
  MissionState,
} from '@libs/mode2/external/api/endpoint/mission/PostMissionOngoingEndpoint';
import { TaskListUnitAction, TaskListUnitProps } from '../TaskListUnitProps';
import BaseSecondaryBtn from '@components/BaseSecondaryBtn';
import BasePrimaryBtn from '@components/BasePrimaryBtn';
import { useTranslation } from 'react-i18next';
import { useState, useRef, useEffect } from 'react';

interface SmartEllipsisProps {
  text: string;
  className?: string;
  onClick?: () => void;
}

const SmartEllipsis = ({ text, className, onClick }: SmartEllipsisProps) => {
  const { t } = useTranslation();
  const [isOverflowing, setIsOverflowing] = useState(false);
  const textRef = useRef<HTMLSpanElement>(null);

  // 檢查是否超出一行
  useEffect(() => {
    const el = textRef.current;
    if (el) {
      const isOverflown = el.scrollWidth > el.clientWidth;
      setIsOverflowing(isOverflown);
    }
  }, [text]);

  return (
    <div className={cx('flex overflow-hidden whitespace-nowrap', className)}>
      <span
        ref={textRef}
        className="nowrap text-ellipsis flex-1 overflow-hidden"
      >
        {text}
      </span>

      {isOverflowing && (
        <span
          className="flex-shrink-0 ml-1 cursor-pointer bgi-text-[var(--state-success-main)] underline"
          onClick={() => {
            onClick && onClick();
          }}
        >
          {t('mission_text_more')}
        </span>
      )}
    </div>
  );
};

const IconWrapper = (props: MissionResult) => {
  return (
    <div
      className={cx('rounded-md', {
        'bg-shadow-[var(--box-shadow-7)]':
          props.state === MissionState.CLAIMABLE,
      })}
    >
      <div
        className={cx(FLEX_CENTER, 'w-12 h-12', 'rounded-md shrink-0', {
          '!bgi-[var(--base-2-variant4)] bgi-border-[var(--base-1-variant1)] after:border-[1.5px]':
            props.state === MissionState.CLAIMABLE,
          'bgi-[var(--base-2-variant7)]':
            props.state !== MissionState.CLAIMABLE,
        })}
      >
        {props.state === MissionState.COMPLETE ? (
          <Icon name="receive_tag" className="w-8 h-8" />
        ) : (
          <Icon name="ic_task" className="w-7 h-7" />
        )}
      </div>
    </div>
  );
};

const Buttons = (props: MissionResult & TaskListUnitAction) => {
  const { t } = useTranslation();
  const btnClassName =
    'w-[65px] h-[35px] flex-none bg-shadow-[var(--box-shadow)]';
  const btnTextClassName = 'text-base font-medium';

  return (
    <>
      {props.state === MissionState.COMPLETE ? (
        <div className="text-base font-medium bgi-text-[var(--transparent-white-40)]">
          {t('forgot_password_reset_password_complete_button')}
        </div>
      ) : null}

      {props.state === MissionState.CLAIMABLE ? (
        <BasePrimaryBtn
          children={t('earn_my_rewards_withdraw_claim')}
          className={cx(btnClassName)}
          classNameText={cx(btnTextClassName)}
          onClick={() => {
            props.onClaim && props.onClaim();
          }}
        />
      ) : null}

      {props.state === MissionState.INCOMPLETE ? (
        <BaseSecondaryBtn
          children={t('inbox_proceed_button')}
          className={cx(btnClassName)}
          classNameText={cx(btnTextClassName)}
          onClick={() => {
            props.onGoTo && props.onGoTo();
          }}
        />
      ) : null}
    </>
  );
};

const MissionRight = (
  props: MissionResult & {
    isDailyMission?: boolean;
    isModal?: boolean;
    // className?: string;
  } & TaskListUnitAction
) => {
  const isClaimable = props.state === MissionState.CLAIMABLE;
  const isComplete = props.state === MissionState.COMPLETE;

  const titleClassName = 'w-full truncate';

  const darkClassName = cx(
    'bgi-text-[var(--base-2-variant2)]',
    isClaimable && 'bgi-text-[var(--grayscale-100)]'
  );

  const receiveClassName = cx(
    'bgi-text-[var(--base-1-variant1)]',
    isComplete && 'bgi-text-[var(--base-2-variant2)]'
  );

  const isClaimableClassName = isClaimable
    ? '!bgi-text-[var(--base-2-variant1)]'
    : '';

  return (
    <div
      className={cx(
        'w-full',
        'text-sm font-medium',
        'flex items-center justify-between',
        'truncate'
      )}
    >
      <div className={cx('flex flex-col w-full')}>
        <p className={cx(titleClassName, darkClassName)}>{props.title}</p>

        {props.isModal ? (
          <p
            className={cx(titleClassName, darkClassName, isClaimableClassName)}
          >
            {props.describe}
          </p>
        ) : (
          <SmartEllipsis
            className={cx(titleClassName, darkClassName, isClaimableClassName)}
            text={props.describe}
            onClick={() => {
              props.onMore && props.onMore();
            }}
          />
        )}

        {props.isModal ? (
          props.isDailyMission ? (
            <div className="flex items-center gap-2">
              <Icon name="ic_task" className="w-[18px] h-[18px]" />
              <span className={receiveClassName}>{props.rewardAmount}</span>
            </div>
          ) : null
        ) : (
          <div className={cx(FLEX_ITEMS_CENTER, 'gap-2')}>
            {props.rewardAmount ? (
              <div className="flex items-center gap-2">
                <Icon name="ic_coin" className="w-[18px] h-[18px]" />
                <span className={receiveClassName}>{props.rewardAmount}</span>
              </div>
            ) : null}

            <div className="flex items-center gap-2">
              <Icon name="ic_task" className="w-[18px] h-[18px]" />
              <span className={receiveClassName}>{props.vigor}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const TaskListUnit = ({
  item,
  type,
  isModal,
  ...props
}: TaskListUnitProps & TaskListUnitAction) => {
  const isDailyTask = type === AnnouncementType.DAILY_TASK;

  return (
    <div
      className={cx(
        'w-full',
        'px-3 box-border',
        'h-[72px]',
        'flex items-center gap-4',
        'bgi-[var(--base-2-variant10)]',
        'border-b border-[var(--transparent-white-10)]'
      )}
    >
      <IconWrapper {...item} />
      <MissionRight
        {...item}
        {...props}
        isDailyMission={isDailyTask}
        isModal={isModal}
      />

      {isModal ? null : <Buttons {...item} {...props} />}
    </div>
  );
};

export default TaskListUnit;

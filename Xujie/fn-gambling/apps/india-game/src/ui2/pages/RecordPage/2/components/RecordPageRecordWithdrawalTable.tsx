import { useTranslation } from 'react-i18next';
import { formatDate, formatMoney } from '@mode2/utils';
import { handleRecordPageCopyOrderNumberClick } from '@mode2/action/actionTypes';
import { useRecordPageActions } from '@mode2/action/recordPageAction/useRecordPageActions';
import { cx } from '@libs/commonUtils/cx';
import { useRecordPageBalanceRecordStore } from '@mode2/zustand/page/recordPageStore';
import {
  WithdrawRecordItemResult,
  WithdrawRecordStatus,
} from '@mode2API/endpoint/record/PostWithdrawRecordsEndpoint';
import Icon from '@components/Icon';
import { useEffect, useRef, useState } from 'react';
import { useBreakPoint } from '@libs/commonUtils';
import isEmpty from 'lodash/isEmpty';
import NoData from '@components/NoData';

const recordStateI18nKeyMapping: Record<WithdrawRecordStatus, string> = {
  [WithdrawRecordStatus.PROCESSING]:
    'account_balance_record_add_cash_record_table_content_processing',
  [WithdrawRecordStatus.SUCCESS]:
    'account_balance_record_add_cash_record_table_content_success',
  [WithdrawRecordStatus.FAIL]:
    'account_balance_record_add_cash_record_table_content_fail',
  [WithdrawRecordStatus.FAIL_EXPIRED]:
    'account_balance_record_add_cash_record_table_content_fail_expired',
};

const getStatusI18nKey = (state: WithdrawRecordStatus) => {
  return recordStateI18nKeyMapping[state] || WithdrawRecordStatus.FAIL;
};

const getStatusColor = (state: WithdrawRecordStatus) => {
  if (state === WithdrawRecordStatus.PROCESSING) {
    return 'bgi-text-[var(--state-warn-main)]';
  } else if (state === WithdrawRecordStatus.SUCCESS) {
    return 'bgi-text-[var(--state-success-main)]';
  } else {
    return 'bgi-text-[var(--state-error-main)]';
  }
};

const RecordWithdrawalItemHeader = (item: WithdrawRecordItemResult) => {
  const { t } = useTranslation();
  const statusColorClass: string = getStatusColor(item.status);
  return (
    <div className="bgi-[var(--grayscale-15)] grid grid-cols-3 p-1 gap-1 mobile:p-3 mobile:gap-3">
      <div
        className={cx('flex items-center justify-center gap-1', 'text-center')}
      >
        {formatDate(item.timestamp)}
      </div>
      <div className={'flex items-center justify-center gap-1'}>
        <Icon className="h-4 w-4 mobile:h-6 mobile:w-6" name={'ic_inr'} />
        <span className={statusColorClass}>
          {formatMoney({
            value: item.amount,
            includeDecimal: true,
            showCurrency: false,
          })}
        </span>
      </div>
      <div
        className={cx(
          'flex items-center justify-center gap-1',
          statusColorClass
        )}
      >
        {t(getStatusI18nKey(item.status))}
      </div>
    </div>
  );
};

/**
 * @param item
 * @constructor
 */
const RecordWithdrawalItemMessage = (item: WithdrawRecordItemResult) => {
  const { isTablet, isDesktop } = useBreakPoint();

  const displayWhitelist = [
    WithdrawRecordStatus.FAIL,
    WithdrawRecordStatus.FAIL_EXPIRED,
  ];
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDisplayMessage, setDisplayMessage] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isOverflown, setIsOverflown] = useState(false);
  const maxRow = isDesktop ? 1 : isTablet ? 2 : 3;

  const getTrimmedText = () => {
    if (!containerRef.current || !isOverflown) return item.message;

    const container = containerRef.current;
    const lineHeight = parseInt(
      window.getComputedStyle(container).lineHeight,
      10
    );
    const maxHeight = lineHeight * maxRow; // 最大三行高度
    let truncatedText = item.message;

    // 使用 getBoundingClientRect 获取精确宽度
    const containerRect = container.getBoundingClientRect();
    const containerWidth = containerRect.width;

    // 创建一个隐藏的临时 div 来模拟文本渲染
    const tempDiv = document.createElement('div');
    tempDiv.style.position = 'absolute';
    tempDiv.style.visibility = 'hidden';
    tempDiv.style.width = `${containerWidth}px`;
    tempDiv.style.lineHeight = `${lineHeight}px`;
    tempDiv.style.fontFamily = window.getComputedStyle(container).fontFamily;
    tempDiv.style.fontSize = window.getComputedStyle(container).fontSize;
    document.body.appendChild(tempDiv);

    let tempText = '';
    for (let i = 0; i < item.message.length; i++) {
      tempText += item.message[i];
      tempDiv.textContent = tempText;

      // 如果文本超过三行高度，截取并加上省略号
      if (tempDiv.scrollHeight > maxHeight) {
        truncatedText = tempText.slice(0, tempText.length - 32) + '...'; // 截断并添加 "..."

        // 检查是否填满第三行的宽度
        const truncatedTextWidth = tempDiv.getBoundingClientRect().width;
        const remainingWidth = containerWidth - truncatedTextWidth;

        if (remainingWidth > 0) {
          // 如果剩余空间大于0，尝试继续填充文本，直到占满第三行
          let additionalText = '';
          for (let j = item.message.length - 1; j >= 0; j--) {
            additionalText = item.message[j] + additionalText;
            tempDiv.textContent = truncatedText + additionalText;

            if (tempDiv.getBoundingClientRect().width > containerWidth) {
              break;
            }
          }
          truncatedText += additionalText;
        }
        break;
      }
    }

    // 清理临时 div
    document.body.removeChild(tempDiv);

    return truncatedText;
  };

  useEffect(() => {
    setDisplayMessage(
      displayWhitelist.includes(item.status) && !isEmpty(item.message)
    );
  }, [item]);

  const checkOverflow = () => {
    if (containerRef.current) {
      const lineHeight = parseInt(
        window.getComputedStyle(containerRef.current).lineHeight,
        10
      );
      const maxHeight = lineHeight * maxRow; // 最大三行高度
      const contentHeight = containerRef.current.scrollHeight;
      // 检查内容是否超过三行
      const isOverflown = contentHeight > maxHeight;
      setIsOverflown(isOverflown);
    }
    getTrimmedText();
  };

  useEffect(() => {
    if (isDisplayMessage) {
      setTimeout(checkOverflow, 0);
    }
  }, [isDisplayMessage]);

  const handleToggle = () => {
    setIsExpanded((prevState) => !prevState);
  };

  return isDisplayMessage ? (
    <div className="bgi-[var(--state-error-50)] flex gap-2 p-1 items-center">
      <Icon
        className="ml-1 w-3 h-3 flex-none object-contain"
        name="ic_alert"
        color="var(--grayscale-100)"
      />

      <div
        ref={containerRef}
        className={cx(
          'relative',
          'bgi-text-[var(--grayscale-100)] text-[10px] mobile:text-xs'
          // { 'line-clamp-3': isOverflown && !isExpanded }
        )}
      >
        {isExpanded ? item.message : getTrimmedText()}

        {isOverflown ? (
          <button
            className="bgi-text-[var(--state-warn-main)] underline  decoration-[#FE8B34] inline ml-1"
            onClick={handleToggle}
          >
            {isExpanded ? 'less' : 'more'}
          </button>
        ) : null}
      </div>
    </div>
  ) : null;
};

const RecordWithdrawalItemBody = (item: WithdrawRecordItemResult) => {
  const { t } = useTranslation();
  const { handleRecordPageClick } = useRecordPageActions();
  return (
    <div className="flex bgi-[var(--grayscale-25)] justify-between py-1 px-2 items-center mobile:py-3 mobile:px-6 mobile:gap-3">
      <div className="flex w-full items-center gap-2">
        <Icon
          className="h-6 w-6 mobile:h-9 mobile:w-9"
          name={'ic_deposit'}
          color="var(--grayscale-70)"
        />
        <div className="flex flex-wrap mobile:flex-nowrap text-xs font-normal mobile:font-medium mobile:text-base">
          <span>
            {t(
              'account_balance_record_add_cash_record_table_content_order_number'
            )}
          </span>
          <span>{item.orderNumber}</span>
        </div>
      </div>

      <button
        className="flex gap-1 justify-center items-center font-medium text-2xl mobile:flex-row mobile:text-xs flex-col mobile:flex-row"
        onClick={() => {
          handleRecordPageClick({
            actionName: handleRecordPageCopyOrderNumberClick,
            payload: {
              text: item.orderNumber,
            },
          });
        }}
      >
        <Icon
          className="h-5 w-5 mobile:h-6 mobile:w-6"
          name={'ic_copy'}
          color="var(--grayscale-70)"
        />
        <span className="text-xs font-medium mobile:text-sm">
          {t('account_balance_record_add_cash_record_btn_copy')}
        </span>
      </button>
    </div>
  );
};

const RecordPageRecordWithdrawalTable = () => {
  const withdrawRecordList = useRecordPageBalanceRecordStore(
    (state) => state.withdrawRecordList
  );
  return (
    <div className="overflow-y-auto max-h-[576px] mt-2 mobile:mt-3 tablet:mt-4 ">
      <div className="flex flex-col gap-2 bgi-text-[var(--grayscale-70)] text-xs font-normal mobile:gap-3 mobile:text-base mobile:font-medium tablet:gap-4">
        {withdrawRecordList.map((data, index) => {
          return (
            <div
              key={index}
              className="flex flex-col rounded overflow-hidden shadow-[4px_4px_8px_#00000040]"
            >
              <RecordWithdrawalItemHeader {...data} />

              <RecordWithdrawalItemMessage {...data} />

              <RecordWithdrawalItemBody {...data} />
            </div>
          );
        })}
        {!withdrawRecordList || withdrawRecordList.length === 0 ? (
          <NoData />
        ) : null}
      </div>
    </div>
  );
};

export default RecordPageRecordWithdrawalTable;

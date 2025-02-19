import { cx } from '@libs/commonUtils';
import {
  FLEX_ITEMS_CENTER,
  MOBILE_BREAK_POINT_MAX_WIDTH,
} from '@libs/constant/style';
import {
  getImgUrl,
  EResourceLevel,
  formatDate,
  formatMoney,
} from '@libs/mode2/utils';
import useModa2OrderDetailPageBase from '@mode2/usecase/page/orderDetailPage/useModa2OrderDetailPageBase';
import {
  OrderDeatilRecordStatus,
  useMode2OrderDetailPageStore,
} from '@mode2/zustand/page/orderDetailPageStore';
import useOrderDetailPageAction from '@mode2/action/orderDetailPageAction/useOrderDetailPageAction';
import dayjs from 'dayjs';
import { Fragment } from 'react';
import { handleOrderDetailPageTabClick } from '@libs/mode2/action/orderDetailPageAction/actionType';
import Icon from '@components/Icon';

// TODO Ronan
// TODO i18n
// TODO api 還缺少兩個字段 bonus & Method
const recordStateI18nKeyMapping: Record<OrderDeatilRecordStatus, string> = {
  [OrderDeatilRecordStatus.PROCESSING]: 'processing',
  [OrderDeatilRecordStatus.SUCCESS]: 'success',
  [OrderDeatilRecordStatus.FAIL]: 'fail',
  [OrderDeatilRecordStatus.FAIL_EXPIRED]: 'fail_expired',
};

const getStatusI18nKey = (state: OrderDeatilRecordStatus) => {
  return recordStateI18nKeyMapping[state] || OrderDeatilRecordStatus.FAIL;
};

const getStatusData = (state: string) => {
  if (state === OrderDeatilRecordStatus.PROCESSING) {
    return {
      iconName: 'ic_pending_outline_3',
      color: 'bgi-text-[var(--state-warning-main)]',
    };
  } else if (state === OrderDeatilRecordStatus.SUCCESS) {
    return {
      iconName: 'ic_success_outline',
      color: 'bgi-text-[var(--state-success-main)]',
    };
  } else {
    return {
      iconName: 'ic_fail_outline',
      color: 'bgi-text-[var(--state-error-main)]',
    };
  }
};

const getDateRange = (daysAgo: number) => {
  const startDate = daysAgo
    ? dayjs().subtract(daysAgo, 'day').unix()
    : dayjs().unix();
  const endDate = dayjs().unix();

  return (
    <div className="flex items-center gap-1">
      <span>{formatDate(startDate, 'YYYY-MM-DD')}</span>
      <span>to</span>
      <span>{formatDate(endDate, 'YYYY-MM-DD')}</span>
    </div>
  );
};

export const OrderDetailPage = () => {
  useModa2OrderDetailPageBase();

  const { handleOrderDetailPageClick } = useOrderDetailPageAction();

  const orderDetailTabIndex = useMode2OrderDetailPageStore(
    (state) => state.orderDetailTabIndex
  );
  const orderDetailTabList = useMode2OrderDetailPageStore(
    (state) => state.orderDetailTabList
  );
  const orderDetailList = useMode2OrderDetailPageStore(
    (state) => state.orderDetailList
  );
  console.log('@@@==> History orderDetailList', orderDetailList);

  return (
    <div
      className={cx(
        MOBILE_BREAK_POINT_MAX_WIDTH,
        'bgi-text-[var(--grayscale-100)]'
      )}
    >
      <div
        className={cx(
          'sticky top-20 pt-2.5 box-border',
          'bgi-[var(--base-2-variant10)]'
        )}
      >
        <div
          className={cx(
            FLEX_ITEMS_CENTER,
            'justify-around',
            'bgi-text-[var(--grayscale-100)]'
          )}
        >
          {orderDetailTabList.map((item, index) => {
            const isLastItem = index === orderDetailTabList.length - 1;

            return (
              <Fragment>
                <div
                  key={index}
                  className={cx(
                    'pb-2.5 text-base font-medium ',
                    'box-border border-b border-transparent cursor-pointer',
                    {
                      'bgi-text-[var(--base-1-main)] border-[var(--base-1-main)]':
                        item.value === orderDetailTabIndex,
                    }
                  )}
                  onClick={() => {
                    handleOrderDetailPageClick({
                      actionName: handleOrderDetailPageTabClick,
                      payload: { value: item.value },
                    });
                  }}
                >
                  <div>{item.label}</div>
                </div>
                {!isLastItem && (
                  <img
                    src={getImgUrl(EResourceLevel.ICONS, 'divider')}
                    alt="separator"
                    className="w-1.5 h-5"
                  />
                )}
              </Fragment>
            );
          })}
        </div>
        <div
          className={cx(
            'mt-2 text-sm',
            FLEX_ITEMS_CENTER,
            'justify-between',
            ' bgi-text-[var(--base-2-variant1)] '
          )}
        >
          <div>
            {orderDetailTabIndex === 1 && getDateRange(0)}
            {orderDetailTabIndex === 7 && getDateRange(7)}
            {orderDetailTabIndex === 30 && getDateRange(30)}
          </div>

          <div>Total:{formatMoney(5000)}</div>
        </div>
      </div>

      <div className={cx('bgi-text-[var(--base-2-variant1)]')}>
        {orderDetailList.map((item, index) => {
          return (
            <div
              key={index}
              className={cx(
                'py-5 box-border',
                'text-xs font-medium',
                'flex justify-between items-center',
                'border-b border-[var(--transparent-white-10)]'
              )}
            >
              <div className={cx(FLEX_ITEMS_CENTER, 'gap-4')}>
                <Icon
                  name={getStatusData(item.status).iconName}
                  className="w-7 h-7"
                />
                <div>
                  <p>{formatDate(item.timestamp, 'YYYY-MM-DD')}</p>
                  <p>{formatDate(item.timestamp, 'hh:mm:ss')}</p>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <p>Order id:{item.orderNumber}</p>
                <p>Method: Online Payment</p>
              </div>

              <div className="flex flex-col gap-1.5 text-right">
                <p className="bgi-text-[var(--grayscale-100)]">
                  Cash+:{item.amount}
                </p>
                {/* TODO Ronan 還缺少一個參數 */}
                <p>Bonus+:{250}</p>
                <p className={cx(getStatusData(item.status).color)}>
                  {getStatusI18nKey(item.status)}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderDetailPage;

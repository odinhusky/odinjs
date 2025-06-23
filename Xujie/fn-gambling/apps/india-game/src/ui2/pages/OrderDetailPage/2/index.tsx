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
import { useMode2OrderDetailPageStore } from '@mode2/zustand/page/orderDetailPageStore';
import useOrderDetailPageAction from '@mode2/action/orderDetailPageAction/useOrderDetailPageAction';
import dayjs from 'dayjs';
import { Fragment } from 'react';
import Icon from '@components/Icon';
import { useWalletPageSwitchContentTabsStore } from '@libs/mode2/zustand/page/WalletPage/walletPageSwitchContentTabsStore';
import { WalletPageTabType } from '@libs/mode2/@types/walletPageTabType';
import { OrderDetailModal } from './components/OrderDetailModal';
import { useTranslation } from 'react-i18next';
import { getStatusI18nKey } from './mapping';
import { RechargeRecordStatus } from '@libs/mode2/external/api/endpoint/record/PostRechargeRecordsEndpoint';
import { WithdrawRecordStatus } from '@libs/mode2/external/api/endpoint/record/PostWithdrawRecordsEndpoint';
import NoData from '@components/NoData';
import { useStayTracker } from '@libs/commonUtils/stayTracker/useStayTracker';
import { BasePagePathObj } from '@libs/mode2/routerTypes/types';
import {
  handleOrderDetailPageShowModal,
  handleOrderDetailPageTabClick,
} from '@libs/mode2/action/actionTypes';

const getStatusData = (state: WithdrawRecordStatus | RechargeRecordStatus) => {
  const statusMap = {
    pending: {
      iconName: 'ic_pending_outline_3',
      color: 'bgi-text-[var(--state-warning-main)]',
    },
    success: {
      iconName: 'ic_success_outline',
      color: 'bgi-text-[var(--state-success-main)]',
    },
    fail: {
      iconName: 'ic_fail_outline',
      color: 'bgi-text-[var(--state-error-main)]',
    },
  };

  switch (state) {
    case WithdrawRecordStatus.PROCESSING:
    case RechargeRecordStatus.PROCESSING:
      return statusMap.pending;
    case RechargeRecordStatus.SUCCESS:
    case WithdrawRecordStatus.SUCCESS:
      return statusMap.success;
    default:
      return statusMap.fail;
  }
};

const recordStateI18nKeyMapping: Record<RechargeRecordStatus, string> = {
  [RechargeRecordStatus.PROCESSING]:
    'withdrawal_history_withdrawal_under_review',
  [RechargeRecordStatus.SUCCESS]: 'withdrawal_history_withdraw_successfully',
  [RechargeRecordStatus.FAIL]: 'withdrawal_history_withdrawal_failed',
};

const getStatusI18nKey2 = (state: RechargeRecordStatus) => {
  return recordStateI18nKeyMapping[state] || RechargeRecordStatus.FAIL;
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
  const { t } = useTranslation();

  const { handleOrderDetailPageClick } = useOrderDetailPageAction();
  const curSwitchContentTabId = useWalletPageSwitchContentTabsStore(
    (state) => state.curSwitchContentTabId
  );

  useStayTracker({
    page: BasePagePathObj.TeamClubPage,
    tab: curSwitchContentTabId,
  });

  const orderListTabIndex = useMode2OrderDetailPageStore(
    (state) => state.orderListTabIndex
  );
  const orderListTabList = useMode2OrderDetailPageStore(
    (state) => state.orderListTabList
  );
  const orderList = useMode2OrderDetailPageStore((state) => state.orderList);

  const totalAmount = orderList
    .filter((record) => record.status === RechargeRecordStatus.SUCCESS)
    .reduce((sum, record) => sum + record.amount, 0);
  console.log('@@@==> History orderListTabIndex:', orderListTabIndex);
  console.log('@@@==> History Total amount:', totalAmount);
  console.log('@@@==> History orderList', orderList);

  return (
    <div
      className={cx(
        MOBILE_BREAK_POINT_MAX_WIDTH,
        'w-screen -ml-4 h-screen overflow-y-auto',
        'bgi-text-[var(--grayscale-100)] bgi-[var(--background-light)] '
      )}
    >
      <OrderDetailModal />

      <div
        className={cx(
          MOBILE_BREAK_POINT_MAX_WIDTH,
          'fixed top-20 pt-2.5 w-screen pb-1 px-4 box-border',
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
          {orderListTabList.map((item, index) => {
            const isLastItem = index === orderListTabList.length - 1;

            return (
              <Fragment key={index}>
                <div
                  key={index}
                  className={cx(
                    'pb-2.5 text-base font-medium ',
                    'box-border border-b border-transparent cursor-pointer',
                    {
                      'bgi-text-[var(--base-1-main)] border-[var(--base-1-main)]':
                        item.value === orderListTabIndex,
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
            {orderListTabIndex === 1 && getDateRange(0)}
            {orderListTabIndex === 7 && getDateRange(7)}
            {orderListTabIndex === 30 && getDateRange(30)}
          </div>

          <div>
            {t('withdrawal_history_total_withdrawal_amount')}:
            {formatMoney({ value: totalAmount })}
          </div>
        </div>
      </div>

      <div className={cx('px-4 pt-[77px] bgi-text-[var(--base-2-variant1)]')}>
        {orderList.length > 0 &&
          orderList.map((item, index) => {
            return (
              <div
                key={item.orderNumber + index}
                className={cx(
                  'py-5 box-border',
                  'text-xs font-medium',
                  'flex justify-between items-center',
                  'border-b border-[var(--transparent-white-10)] cursor-pointer'
                )}
                onClick={() => {
                  handleOrderDetailPageClick({
                    actionName: handleOrderDetailPageShowModal,
                    payload: {
                      orderId: item.orderNumber,
                      detail: encodeURIComponent(JSON.stringify(item)),
                    },
                  });
                }}
              >
                <div className={cx(FLEX_ITEMS_CENTER, 'gap-4')}>
                  <Icon
                    name={getStatusData(item.status).iconName}
                    className="w-7 h-7"
                  />
                  <div>
                    <p>{formatDate(item.timestamp, 'YYYY-MM-DD')}</p>
                    <p>{formatDate(item.timestamp, 'HH:mm:ss')}</p>
                  </div>
                </div>

                {curSwitchContentTabId === WalletPageTabType.DEPOSIT ? (
                  <div className="flex flex-col gap-1.5">
                    <p>
                      {t('deposit_history_order_id')}:{item.orderNumber}
                    </p>
                    <p>
                      {t('deposit_history_payment_method')}:{' '}
                      {/* {t('deposit_history_payment_method_online')} */}
                      {item.payType}
                    </p>
                  </div>
                ) : (
                  <div className={cx('flex-[0.6]')}>
                    <div className="bgi-text-[var(--grayscale-100)]">
                      {/* {item.status === RechargeRecordStatus.SUCCESS
                        ? t('withdrawal_history_withdraw_successfully')
                        : null} */}
                      {t(getStatusI18nKey2(item.status))}
                    </div>
                    <div>
                      <span>{t('withdrawal_history_balance_number')} </span>
                      <span className="bgi-text-[var(--grayscale-100)]">
                        {item.orderNumber}
                      </span>
                    </div>
                    {item.message ? (
                      <div className="bgi-text-[var(--state-error-main)]">
                        Message: {item.message}
                      </div>
                    ) : null}
                  </div>
                )}

                <div className="flex flex-col gap-1.5 text-right">
                  <p className="bgi-text-[var(--grayscale-100)]">
                    {curSwitchContentTabId === WalletPageTabType.DEPOSIT ? (
                      <>
                        <span>{t('deposit_history_deposit_amount')}:</span>
                        <span>{item.amount}</span>
                      </>
                    ) : (
                      <span>
                        {formatMoney({
                          value: item.amount,
                          includeDecimal: true,
                        })}
                      </span>
                    )}
                  </p>
                  {item.bonus && item.bonus > 0 ? (
                    <p>
                      {t('deposit_history_deposit_bonus')}:{item.bonus}
                    </p>
                  ) : null}

                  <p className={cx(getStatusData(item.status).color)}>
                    {t(getStatusI18nKey(item.status, curSwitchContentTabId))}
                  </p>
                </div>
              </div>
            );
          })}

        {orderList.length === 0 ? (
          <div className="mt-52">
            <NoData />
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default OrderDetailPage;

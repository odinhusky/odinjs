import Icon from '@components/Icon';
import { cx } from '@libs/commonUtils';
import { FLEX_CENTER } from '@libs/constant/style';
import {
  EResourceLevel,
  formatDate,
  formatMoney,
  getImgUrl,
} from '@libs/mode2/utils';
import { useMode2OrderDetailPageStore } from '@libs/mode2/zustand/page/orderDetailPageStore';
import { useTranslation } from 'react-i18next';
import { handleWalletPageOpenOnlineServiceActionClick } from '@mode2/action/actionTypes';
import useWalletPageBaseActions from '@libs/mode2/action/walletPageAction/useWalletPageBaseActions';
import useRecordPageActions from '@libs/mode2/action/recordPageAction/useRecordPageActions';
import { handleRecordPageCopyOrderNumberClick } from '@mode2/action/actionTypes';
import { getStatusI18nKey } from '../mapping';
import { useWalletPageSwitchContentTabsStore } from '@libs/mode2/zustand/page/WalletPage/walletPageSwitchContentTabsStore';
import { WalletPageTabType } from '@libs/mode2/@types/walletPageTabType';
import useMyPageActions from '@libs/mode2/action/myPageAction/useMyPageActions';
import { handleMyPageTeamClubLineBtnClick } from '@mode2/action/actionTypes';
import { RechargeRecordStatus } from '@libs/mode2/external/api/endpoint/record/PostRechargeRecordsEndpoint';
import { WithdrawRecordStatus } from '@libs/mode2/external/api/endpoint/record/PostWithdrawRecordsEndpoint';
import BaseModal from '@libs/components/Modal';

const getImageName = (state: RechargeRecordStatus | WithdrawRecordStatus) => {
  switch (state) {
    case RechargeRecordStatus.PROCESSING:
    case WithdrawRecordStatus.PROCESSING:
      return 'order_detail_pending';
    case RechargeRecordStatus.SUCCESS:
    case WithdrawRecordStatus.SUCCESS:
      return 'order_detail_success';
    default:
      return 'order_detail_failed';
  }
};

export const OrderDetailModal = () => {
  const { t } = useTranslation();
  const { handleWalletPageBaseClick } = useWalletPageBaseActions();
  const { handleRecordPageClick } = useRecordPageActions();
  const { handleMyPageClick } = useMyPageActions();
  const curSwitchContentTabId = useWalletPageSwitchContentTabsStore(
    (state) => state.curSwitchContentTabId
  );
  const isShowOrderDetailModal = useMode2OrderDetailPageStore(
    (state) => state.isShowOrderDetailModal
  );
  const setShowOrderDetailModal = useMode2OrderDetailPageStore(
    (state) => state.setShowOrderDetailModal
  );
  const orderDetail = useMode2OrderDetailPageStore(
    (state) => state.orderDetail
  );

  console.log('@@@===> orderDetail', orderDetail);

  const itemClassName = 'flex justify-between text-base font-medium';
  const labelClassName = 'bgi-text-[var(--base-2-variant2)]';
  const valueClassName = 'bgi-text-[var(--grayscale-100)]';

  return isShowOrderDetailModal ? (
    <BaseModal className="w-full h-full">
      <div
        className={cx(
          'text-center bgi-[var(--background-light)]',
          'flex flex-col gap-4',
          'w-full h-full'
        )}
      >
        {/* 關閉按鈕 */}
        <div
          className={cx(
            FLEX_CENTER,
            'h-20',
            'bgi-[var(--base-2-variant5)] cursor-pointer'
          )}
          onClick={() => {
            setShowOrderDetailModal(false);
          }}
        >
          <Icon name="ic_back_header" className="w-7 h-7 absolute left-4" />
          <div className="text-2xl font-medium bgi-text-[var(--grayscale-100)]">
            {t('withdrawal_order_detail_page_title')}
          </div>
        </div>

        {/* 内容 */}
        <img
          src={getImgUrl(EResourceLevel.V, getImageName(orderDetail.status))}
          alt="withdrawal_success"
          className="w-[152px] h-[152px] mx-auto"
        />

        <div className="bgi-text-[var(--base-2-variant1)]">
          <p className="text-sm font-medium">
            {t(getStatusI18nKey(orderDetail.status, curSwitchContentTabId))}
          </p>
          <p className="text-5xl bgi-border-b-[var(--base-2-variant6)]">
            {formatMoney({ value: orderDetail.amount || 0 })}
          </p>
        </div>

        <div
          className={cx('w-[718px] h-[1px] ml-4 bgi-[var(--base-2-variant6)]')}
        ></div>

        <div className={cx('px-4 box-border')}>
          <div className="flex flex-col gap-1.5">
            <div className={cx(itemClassName)}>
              <div className={cx(labelClassName)}>
                {curSwitchContentTabId === WalletPageTabType.DEPOSIT
                  ? t('deposit_order_detail_deposit_type')
                  : t('withdrawal_order_detail_withdrawal_type')}
                :
              </div>
              <div className={cx(valueClassName)}>
                {curSwitchContentTabId === WalletPageTabType.DEPOSIT
                  ? orderDetail.payType
                  : ''}
                {curSwitchContentTabId === WalletPageTabType.WITHDRAW
                  ? orderDetail.withdrawType
                  : ''}
              </div>
            </div>
            <div className={cx(itemClassName)}>
              <div className={cx(labelClassName)}>
                {t('withdrawal_order_detail_create_time')}:
              </div>
              <div className={cx(valueClassName)}>
                {orderDetail.timestamp
                  ? formatDate(orderDetail.timestamp, 'YYYY-MM-DD HH:mm:ss')
                  : ''}
              </div>
            </div>
            {[
              RechargeRecordStatus.SUCCESS,
              WithdrawRecordStatus.SUCCESS,
            ].includes(orderDetail.status) ? (
              <div className={cx(itemClassName)}>
                <div className={cx(labelClassName)}>
                  {t('withdrawal_order_detail_success_time')}:
                </div>
                <div className={cx(valueClassName)}>
                  {formatDate(orderDetail.finalTime!, 'YYYY-MM-DD HH:mm:ss')}
                </div>
              </div>
            ) : null}
            {[
              RechargeRecordStatus.FAIL,
              WithdrawRecordStatus.FAIL,
              WithdrawRecordStatus.FAIL_EXPIRED,
            ].includes(orderDetail.status) ? (
              <div className={cx(itemClassName)}>
                <div className={cx(labelClassName)}>
                  {t('withdrawal_order_detail_failed_time')}:
                </div>
                <div className={cx(valueClassName)}>
                  {formatDate(orderDetail.finalTime!, 'YYYY-MM-DD HH:mm:ss')}
                </div>
              </div>
            ) : null}
            <div className={cx(itemClassName)}>
              <div className={cx(labelClassName)}>
                {t('withdrawal_order_detail_order_id')}:
              </div>
              <div
                className={cx(valueClassName, 'flex items-center gap-0.5')}
                onClick={() => {
                  handleRecordPageClick({
                    actionName: handleRecordPageCopyOrderNumberClick,
                    payload: {
                      text: orderDetail.orderNumber,
                    },
                  });
                }}
              >
                <span>{orderDetail.orderNumber || ''}</span>
                <Icon name="ic_copy_2" className="w-4 h-4 cursor-pointer" />
              </div>
            </div>
          </div>

          <div className="text-left text-base mt-4 mb-3 font-medium">
            {curSwitchContentTabId === WalletPageTabType.DEPOSIT
              ? t('deposit_order_detail_deposit_issue')
              : t('withdrawal_order_detail_withdrawal_issue')}
          </div>

          <div
            className={cx(
              'p-4',
              'flex justify-between items-center',
              'bgi-[var(--base-2-variant7)] rounded-md cursor-pointer'
            )}
            onClick={() => {
              handleWalletPageBaseClick({
                actionName: handleWalletPageOpenOnlineServiceActionClick,
              });
            }}
          >
            <div>
              <p className="text-base flex items-center gap-1">
                {t('online_customer_service_entry')}
              </p>
              <p className="text-xs bgi-text-[var(--base-2-variant2)]">
                {t('withdrawal_order_detail_withdrawal_problem_help')}
              </p>
            </div>
            <Icon name="ic_arrow_right_4" className="w-4 h-4" />
          </div>

          {curSwitchContentTabId === WalletPageTabType.DEPOSIT ? (
            <div
              className={cx(
                'p-4 mt-3',
                'flex justify-between items-center',
                'bgi-[var(--base-2-variant7)] rounded-md cursor-pointer'
              )}
              onClick={() => {
                handleMyPageClick({
                  actionName: handleMyPageTeamClubLineBtnClick,
                });
              }}
            >
              <div>
                <p className="text-base flex items-center gap-1">
                  Agent Deposits: Earn{' '}
                  <span className="bgi-text-[var(--base-1-main)]">
                    {formatMoney({ value: 100000 })}+
                  </span>{' '}
                  monthly.
                </p>
                <p className="text-xs flex bgi-text-[var(--base-2-variant2)]">
                  {t('deposit_order_detail_agent_channel_invitation')}
                </p>
              </div>
              <Icon name="ic_arrow_right_4" className="w-4 h-4" />
            </div>
          ) : null}
        </div>
      </div>
    </BaseModal>
  ) : null;
};

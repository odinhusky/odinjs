import Icon from '@components/Icon';
import {
  EResourceLevel,
  formatCountdownTime,
  formatMoney,
  getImgUrl,
} from '@libs/mode2/utils';
import { QRCode } from 'antd';
import { useRef, useState } from 'react';

import useCheckoutPageActions from '@mode2/action/checkoutPageAction/useCheckoutPageActions';
import {
  handleCheckoutPageCloseTutorialClick,
  handleCheckoutPageCopyClick,
  handleCheckoutPageDownLoadQRCodeClick,
  handleCheckoutPageShowTutorialClick,
  handleCheckoutPageUTRConfirmClick,
} from '@libs/mode2/action/checkoutPageAction/actionType';
import Input from '@mode2/components/Input';
import { cx } from '@libs/commonUtils';
import TutorialModal from '@modals/TutorialModal';

import ChangeLangueBox from '../ChangeLangueBox';
import { PayActivationResult } from '@mode2API/endpoint/wallet/PostPayConfigInfoWithOptionsEndpoint';
import { useTranslation } from 'react-i18next';
import { PAY_CONTENT_MAP } from '@/ui/hooks/pages/customizeCheckoutPage/const';
import { PayCheckoutDetailResult } from '@libs/mode2/external/api/endpoint/wallet/GetPayCheckoutDetailEndpoint';
import { PayCheckoutConfirmRequest } from '@libs/mode2/external/api/endpoint/wallet/PostPayCheckoutConfirmEndpoint';
import BasePrimaryBtn from '@components/BasePrimaryBtn';

const UPIPayContent = ({
  data,
  countdownTime,
  onSubmitUTR,
  type,
}: {
  data?: PayCheckoutDetailResult;
  onPayUTRConfirm?: (data: PayCheckoutConfirmRequest) => void;
  countdownTime?: number;
  onSubmitUTR?: (value: string) => void;
  type: PayActivationResult;
}) => {
  const qrRef = useRef<HTMLDivElement>(null);
  const { handleCheckoutPageClick } = useCheckoutPageActions();
  const [confirmCode, setConfirmCode] = useState('');
  const [showTutorialModal, setShowTutorialModal] = useState(false);
  const layout = PAY_CONTENT_MAP[type];
  const showConfig = layout.showConfig;
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-3 text-sm py-4">
      <ChangeLangueBox />
      <div className="flex flex-col gap-3 bgi-[var(--grayscale-20)] rounded p-3 mobile:p-6">
        {layout.logoUrl && (
          <img className="w-40 mt-2 mx-auto" src={layout.logoUrl} alt="logo" />
        )}
        {showConfig.countdownTime && (
          <div className="bgi-text-[var(--base-2-main)] text-center text-2xl font-bold">
            {countdownTime ? formatCountdownTime(countdownTime) : ''}
          </div>
        )}
        <div className="flex flex-col gap-2 font-medium text-sm mobile:text-base">
          {layout.baseInfo.map((item) => (
            <div className="w-full flex justify-between items-center">
              <div className="bgi-text-[var(--grayscale-70)]">
                {t(item.label)}
              </div>
              <div className="bgi-text-[var(--grayscale-100)] flex items-center">
                <span>
                  {item.key === 'payAmount'
                    ? formatMoney(Number(data?.[item.key]) || 0)
                    : data?.[item.key]}
                </span>
                {item.copy && (
                  <Icon
                    className="cursor-pointer ml-1 w-4 h-4"
                    name="ic_copy"
                    onClick={() => {
                      handleCheckoutPageClick({
                        actionName: handleCheckoutPageCopyClick,
                        payload: {
                          value: String(data?.[item.key]),
                          target: item.key,
                        },
                      });
                    }}
                  />
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="bgi-text-[var(--grayscale-100)] bgi-[var(--state-warn-main-50)] px-3 py-2 rounded">
          <div className="flex items-center gap-1">
            <div className="bgi-[var(--transparent-white-20)] p-0.5 rounded-full">
              <Icon
                name="icon_notice_3"
                color="var(--state-warn-main)"
                className="w-4 h-4"
              />
            </div>

            <span className=" font-semibold text-xs">
              {t('game_popup_leave_title_notice')}
            </span>
          </div>
          {layout.noticeText && (
            <div
              className="mt-1"
              dangerouslySetInnerHTML={{
                __html: t(layout.noticeText, {
                  className: 'font-semibold',
                }),
              }}
            ></div>
          )}
        </div>
        <button
          className="text-center text-sm bgi-text-[var(--grayscale-70)]"
          onClick={() => {
            handleCheckoutPageClick({
              actionName: handleCheckoutPageShowTutorialClick,
              payload: { callback: () => setShowTutorialModal(true) },
            });
          }}
        >
          {t(layout.tutorialLinkText)}
        </button>
        {showTutorialModal && (
          <TutorialModal
            type={PayActivationResult.UPI}
            onClose={() => {
              handleCheckoutPageClick({
                actionName: handleCheckoutPageCloseTutorialClick,
                payload: { callback: () => setShowTutorialModal(false) },
              });
            }}
          />
        )}
      </div>
      <div className="flex flex-col gap-3 bgi-[var(--grayscale-20)] rounded px-4 py-3">
        <div className="flex gap-1 mx-auto">
          <div className="bgi-[var(--transparent-white-20)] p-0.5 rounded-full">
            <Icon
              name="icon_notice_3"
              color="var(--state-warn-main)"
              className="w-4 h-4 mobile:w-5 mobile:h-5"
            />
          </div>
          <span className="text-sm mobile:text-base bgi-text-[var(--state-warn-main)]">
            {t('wallet_deposit_pay_upi_content_notice')}
          </span>
        </div>

        {showConfig.downloadQR && (
          <>
            <div
              ref={qrRef}
              className={cx(
                'w-[244px] h-[244px] mobile:w-60 mobile:h-60',
                ' bgi-[var(--grayscale-100)] rounded overflow-hidden mx-auto '
              )}
            >
              <QRCode
                bgColor="white"
                className="!w-full !h-full "
                value={data?.payUrl || ''}
              />
            </div>

            <BasePrimaryBtn
              className={cx('mt-1 mx-auto', 'mobile:w-60', 'font-semibold')}
              onClick={() => {
                const canvas = qrRef.current?.getElementsByTagName('canvas')[0];
                handleCheckoutPageClick({
                  actionName: handleCheckoutPageDownLoadQRCodeClick,
                  payload: canvas,
                });
              }}
              children={t('wallet_deposit_pay_upi_btn_download_qr_code')}
            />
          </>
        )}
        {showConfig.copyCryptoAddress && (
          <>
            <div
              className={cx(
                'w-[244px] h-[244px] mobile:w-60 mobile:h-60',
                ' bgi-[var(--grayscale-100)] rounded overflow-hidden mx-auto '
              )}
            >
              <QRCode
                bgColor="white"
                className="!w-full !h-full "
                value={data?.payAddress || ''}
              />
            </div>
            <div className="bgi-text-[var(--grayscale-100)] text-center font-medium text-sm">
              {data?.payAddress}
            </div>

            <BasePrimaryBtn
              className={cx('mx-auto', 'mobile:w-60', 'font-semibold')}
              onClick={() => {
                handleCheckoutPageClick({
                  actionName: handleCheckoutPageCopyClick,
                  payload: {
                    value: data?.payAddress || '',
                    target: 'payAddress',
                  },
                });
              }}
              children={t('account_balance_record_add_cash_record_btn_copy')}
            />
          </>
        )}

        {showConfig.morePayType && (
          <>
            <div className="mt-1 flex gap-2 justify-center">
              {['paytm', 'phonepe', 'bhim', 'gpay'].map((item, index) => (
                <img
                  className="w-14"
                  src={getImgUrl(
                    EResourceLevel.SHARED,
                    `/paylogo/${item}_logo`
                  )}
                  alt={item}
                  key={index}
                />
              ))}
            </div>
            <div className="bgi-text-[var(--grayscale-70)] text-xs mt-3 text-center border-[var(--grayscale-30)] border-b pb-3">
              {t('wallet_deposit_pay_upi_and_more')}
            </div>
          </>
        )}

        {showConfig.UTR && (
          <div className="mt-3 flex flex-col gap-1">
            <div className="bgi-text-[var(--grayscale-100)] font-semibold text-base">
              UTR
            </div>

            <Input
              value={confirmCode}
              onChange={setConfirmCode}
              styles={{
                containerDiv: '!px-1 !py-1.5 !bg-[var(--grayscale-30)]',
                input: '!font-normal !text-sm',
              }}
              placeholder={{
                i18nKey: 'wallet_deposit_pay_upi_input_hint_utr',
              }}
            />

            <div className="text-[var(--state-error-main)] text-sm mt-1 ">
              {t('wallet_deposit_pay_upi_input_utr_notice')}
            </div>

            <BasePrimaryBtn
              className={cx('group', 'text-sm', 'py-2')}
              disabled={!confirmCode}
              onClick={() => {
                handleCheckoutPageClick({
                  actionName: handleCheckoutPageUTRConfirmClick,
                  payload: {
                    data: {
                      orderId: data?.orderId || '',
                      confirmCode: confirmCode,
                    },
                    onFinally: () => setConfirmCode(''),
                    onSuccess: () => onSubmitUTR?.(confirmCode),
                  },
                });
              }}
              children={t('wallet_deposit_pay_upi_btn_completed_transaction')}
            />
          </div>
        )}
      </div>
      <div className="bgi-text-[var(--grayscale-70)]">
        <div className="mb-2 text-base mobile:text-lg bgi-text-[var(--state-warn-main)] font-bold">
          Reminder
        </div>
        {layout.reminder.map((item, index) => (
          <div
            className="text-sm mobile:text-base"
            key={index}
            dangerouslySetInnerHTML={{
              __html: t(item, {
                className: 'bgi-text-[var(--state-warn-main)] font-semibold',
              }),
            }}
          />
        ))}
      </div>
    </div>
  );
};
export default UPIPayContent;

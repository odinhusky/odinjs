import useInvitePageActions from '@mode2/action/invitePageAction/useInvitePageActions';
import { EResourceLevel, getImgUrl } from '@mode2/utils';
import {
  handleInvitePageClipboardRecommendedLinkClick,
  handleInvitePageSaveRecommendedBarCodeClick,
} from '@mode2/action/actionTypes';
import { useRef } from 'react';
import { QRCode } from 'antd';
import { useTranslation } from 'react-i18next';
import { cx } from '@libs/commonUtils';
import { FLEX_CENTER, FLEX_COL } from '@libs/constant/style';
import BasePrimaryBtn from '@components/BasePrimaryBtn';
import { useUserProfileStore } from '@libs/mode2/zustand/user/userProfileStore';

export const EarnReferalLink = () => {
  const { t } = useTranslation();
  const { handleInvitePageClick } = useInvitePageActions();
  const referralLink = useUserProfileStore((state) => state.referralLink);
  const asImageRef = useRef<HTMLDivElement>(null);
  const rightAsImageRef = useRef<HTMLDivElement>(null);

  return (
    <div className={cx('flex gap-0 mobile:gap-4')}>
      <div className="flex w-full bgi-[var(--state-warn-main)] rounded-lg">
        <div
          className={cx(
            'bgi-[var(--grayscale-100)]',
            'gap-3 mobile:gap-4',
            'flex-[8]',
            'h-full',
            'box-border',
            'px-6 py-4',
            'rounded',
            FLEX_COL,
            'justify-center',
            'items-center mobile:items-start w-full'
          )}
        >
          <img
            src={getImgUrl(EResourceLevel.V, 'my_referral_link')}
            alt="icon-link"
            className="self-center mobile:self-start max-h-10 mobile:max-h-[52px] object-contain"
          />
          <div
            className={cx(
              'flex gap-[6px]',
              'mobile:h-10 h-6',
              'rounded',
              'justify-between',
              'bgi-[var(--transparent-white-20)]',
              'w-full gap-2.5'
            )}
          >
            <div
              className={cx(
                'flex items-center',
                'w-full h-full bgi-[var(--base-1-main)]',
                'font-medium rounded',
                'bgi-text-[var(--grayscale-100)]',
                'text-xs font-normal mobile:text-base',
                'mobile:py-2 mobile:px-3 py-1 px-2 min-w-[100px]'
              )}
            >
              <p className="truncate">{referralLink}</p>
            </div>
            <div
              className="flex h-full py-1 px-2 bgi-[var(--base-1-main)] rounded cursor-pointer items-center"
              onClick={() => {
                handleInvitePageClick({
                  actionName: handleInvitePageClipboardRecommendedLinkClick,
                  payload: {
                    link: referralLink,
                  },
                });
              }}
            >
              <span className="bgi-text-[var(--linear-4)] mobile:text-base text-xs font-medium">
                {t('account_balance_record_add_cash_record_btn_copy')}
              </span>
            </div>
          </div>

          <div
            className={cx(
              'flex-[2]',
              'box-border',
              FLEX_CENTER,
              'flex-col',
              'mobile:hidden'
            )}
          >
            <div ref={asImageRef} className={'mb-3 w-[160px] h-[160px]'}>
              <QRCode
                style={{
                  width: '100%',
                  height: '100%',
                  background: '#FFFFFF',
                  padding: '0.75rem',
                  borderRadius: '0.25rem',
                  border: 'none',
                }}
                value={referralLink}
              />
            </div>

            <BasePrimaryBtn
              className={cx('mobile:text-base')}
              onClick={() => {
                handleInvitePageClick({
                  actionName: handleInvitePageSaveRecommendedBarCodeClick,
                  payload: {
                    asImageRef: asImageRef,
                  },
                });
              }}
            >
              {t('earn_money_earn_btn_save')}
            </BasePrimaryBtn>
          </div>
        </div>
      </div>

      <div className="w-[204px] bgi-[var(--state-warn-main)] rounded-lg items-center hidden mobile:block">
        <div
          className={cx(
            'bgi-[var(--grayscale-100)]',
            FLEX_CENTER,
            'flex-col flex-[2]',
            'box-border',
            'py-4 px-6',
            'rounded'
          )}
        >
          <div ref={rightAsImageRef} className="mb-2 w-[120px] h-[120px]">
            <QRCode
              style={{
                width: '100%',
                height: '100%',
                background: '#FFFFFF',
                padding: '0.75rem',
                borderRadius: '0.25rem',
                border: 'none',
              }}
              value={referralLink}
            />
          </div>

          <BasePrimaryBtn
            className={cx('mobile:text-base h-9')}
            onClick={() => {
              handleInvitePageClick({
                actionName: handleInvitePageSaveRecommendedBarCodeClick,
                payload: {
                  asImageRef: rightAsImageRef,
                },
              });
            }}
          >
            {t('earn_money_earn_btn_save')}
          </BasePrimaryBtn>
        </div>
      </div>
    </div>
  );
};

export default EarnReferalLink;

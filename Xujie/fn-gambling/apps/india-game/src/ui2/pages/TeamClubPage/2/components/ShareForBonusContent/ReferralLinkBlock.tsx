import useTeamClubPageActions from '@mode2/action/teamClubPageAction/useTeamClubPageActions';
import { EResourceLevel, getImgUrl } from '@mode2/utils';
import {
  handleTeamClubPageClipboardRecommendedLinkClick,
  handleTeamClubPageSaveRecommendedBarCodeClick,
} from '@mode2/action/actionTypes';

import { useRef } from 'react';
import { QRCode } from 'antd';
import { useTranslation } from 'react-i18next';
import { cx } from '@libs/commonUtils';
import { FLEX_CENTER, FLEX_COL, FLEX_ITEMS_CENTER } from '@libs/constant/style';
import BasePrimaryBtn from '@components/BasePrimaryBtn';
import Icon from '@components/Icon';
import { useUserProfileStore } from '@libs/mode2/zustand/user/userProfileStore';

/** 推連連結與推薦QRcode */
export const ReferralLinkBlock = () => {
  const asImageRef = useRef<HTMLDivElement>(null);
  const rightAsImageRef = useRef<HTMLDivElement>(null);

  const { t } = useTranslation();
  const { handleTeamClubPageClick } = useTeamClubPageActions();

  const referralLink = useUserProfileStore((state) => state.referralLink);

  return (
    <div className={cx('flex gap-0 mobile:gap-4')}>
      <div className="bgi-[var(--state-warn-main)] rounded-lg flex w-full">
        <div
          className={cx(
            'bgi-[var(--linear-1)]',
            'gap-3 mobile:gap-4',
            'flex-[8]',
            'h-full',
            'box-border',
            'px-6 py-4',
            'rounded-lg',
            FLEX_COL,
            'justify-center',
            'items-center mobile:items-start'
          )}
        >
          <img
            src={getImgUrl(EResourceLevel.V, 'my_referral_link')}
            alt="icon-link"
            className="self-center mobile:self-start max-h-10 mobile:max-h-[52px] object-contain"
          />
          <div
            className={cx(
              'h-10',
              'rounded',
              'box-border',
              FLEX_ITEMS_CENTER,
              'justify-between',
              'px-3 py-0',
              'bgi-[var(--transparent-white-20)]'
            )}
          >
            <div
              className={cx(
                'font-medium',
                'bgi-text-[var(--grayscale-90)]',
                'text-xs font-normal mobile:text-base'
              )}
            >
              {referralLink}
            </div>
            <div
              onClick={() => {
                handleTeamClubPageClick({
                  actionName: handleTeamClubPageClipboardRecommendedLinkClick,
                  payload: {
                    link: referralLink,
                  },
                });
              }}
            >
              <Icon className={cx('w-5 h-5 cursor-pointer')} name="ic_copy" />
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
                }}
                value={referralLink}
              />
            </div>

            <BasePrimaryBtn
              className={cx('mobile:text-base')}
              onClick={() => {
                handleTeamClubPageClick({
                  actionName: handleTeamClubPageSaveRecommendedBarCodeClick,
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

      <div className="bgi-[var(--state-warn-main)] rounded-lg items-center hidden tablet:block">
        <div
          className={cx(
            'bgi-[var(--linear-1)]',
            FLEX_CENTER,
            'flex-col flex-[2]',
            'box-border',
            'p-6',
            'rounded-lg'
          )}
        >
          <div ref={rightAsImageRef} className="mb-2 w-[120px] h-[120px]">
            <QRCode
              style={{
                width: '100%',
                height: '100%',
                background: '#FFFFFF',
                padding: '0.785',
                borderRadius: '0.25rem',
              }}
              value={referralLink}
            />
          </div>

          <BasePrimaryBtn
            className={cx('mobile:text-base')}
            onClick={() => {
              handleTeamClubPageClick({
                actionName: handleTeamClubPageSaveRecommendedBarCodeClick,
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

export default ReferralLinkBlock;

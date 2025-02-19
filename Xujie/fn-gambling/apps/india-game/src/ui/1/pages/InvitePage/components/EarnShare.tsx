import { EResourceLevel, getImgUrl } from '@mode2/utils';
import { useMode2InviteEarnStore } from '@mode2/zustand/page/invitePageStore';
import {
  handleInvitePageClipboardRecommendedCodeClick,
  handleInvitePageClipboardRecommendedLinkClick,
  handleInvitePageContactNowClick,
} from '@mode2/action/invitePageAction/actionType';
import useInvitePageActions from '@mode2/action/invitePageAction/useInvitePageActions';
import { SocialList } from '@components/SocialList';
import { SocialScenarios } from '@mode2/zustand/components/socialListStore';
import sdkUtils from '@mode2/utils/sdk';
import { useTranslation } from 'react-i18next';
import Icon from '@components/Icon';
import { cx } from '@libs/commonUtils';
import { FLEX_CENTER } from '@libs/constant/style';

export const EarnShare = () => {
  const { t } = useTranslation();
  const referralInfo = useMode2InviteEarnStore((state) => state.referralInfo);
  const { handleInvitePageClick } = useInvitePageActions();
  return (
    <div
      className={cx(
        'flex flex-col tablet:gap-6 mobile:gap-5 gap-4 bottom',
        'box-border',
        'rounded-lg'
      )}
    >
      <div className="bgi-[var(--grayscale-100)] rounded-lg py-3 px-6">
        <div
          className={cx(
            'text-base mobile:text-lg',
            'pb-2 mobile:pb-3',
            'bgi-text-[var(--base-1-main)]',
            'font-semibold',
            'text-center',
            'border-b-[var(--grayscale-80)] border-b border-solid'
          )}
        >
          {t('earn_money_social_community_share_with_your_social')}
        </div>

        <div
          className={cx('w-full', FLEX_CENTER, 'flex-col gap-3', 'mx-0 my-4')}
        >
          <SocialList
            className="tablet:pr-[360px] pr-0"
            scenarios={SocialScenarios.INVITE_PAGE}
          />
        </div>

        <div className={cx('earn-share-copy-box')}>
          <div className={cx('earn-share-copy-title')}>
            {t('earn_money_social_community_recommended_link')}
          </div>
          <div
            className={cx(
              'earn-share-href flex justify-between gap-[6px] !p-0'
            )}
          >
            <div
              className={cx(
                'earn-share-href-text bgi-[var(--base-1-main)] w-full',
                'mobile:px-3 py-[6px] !px-2 rounded min-w-[100px]'
              )}
            >
              <p className="truncate">{referralInfo.link}</p>
            </div>

            <button
              className="bgi-[var(--base-1-main)] py-1 px-2 rounded"
              onClick={() => {
                handleInvitePageClick({
                  actionName: handleInvitePageClipboardRecommendedLinkClick,
                  payload: {
                    link: referralInfo.link,
                  },
                });
              }}
            >
              <span className="mobile:text-base text-xs font-medium bgi-text-[var(--linear-4)]">
                {t('account_balance_record_add_cash_record_btn_copy')}
              </span>
            </button>
          </div>
        </div>

        <div className={cx('earn-share-copy-box')}>
          <div className={cx('earn-share-copy-title')}>
            {t('earn_money_social_community_referral_code')}
          </div>
          <div
            className={cx(
              'earn-share-href flex justify-between gap-[6px] !p-0'
            )}
          >
            <div
              className={cx(
                'earn-share-href-text bgi-[var(--base-1-main)] w-full',
                'mobile:px-3 py-[6px] !px-2 rounded'
              )}
            >
              {referralInfo.code}
            </div>

            <button
              className="bgi-[var(--base-1-main)] py-1 px-2 rounded"
              onClick={() => {
                handleInvitePageClick({
                  actionName: handleInvitePageClipboardRecommendedCodeClick,
                  payload: {
                    code: referralInfo.code,
                  },
                });
              }}
            >
              <span className="mobile:text-base text-xs font-medium bgi-text-[var(--linear-4)]">
                {t('account_balance_record_add_cash_record_btn_copy')}
              </span>
            </button>
          </div>
        </div>
      </div>
      <div className="bgi-[var(--grayscale-100)] rounded-lg py-3 px-6">
        <div
          className={cx(
            'w-full',
            'text-base mobile:text-lg',
            'text-center font-semibold',
            'bgi-text-[var(--base-1-main)]',
            'border-b border-b-[var(--grayscale-80)] pb-2'
          )}
        >
          {t('earn_money_notice_title', {
            productName: sdkUtils.productName(),
          })}
        </div>
        <div className="bottom-item">
          {/* <button> */}
          <Icon
            className={'icon-button p-2 object-contain w-12'}
            level={EResourceLevel.SHARED}
            name={'social/icon_telegram'}
          />
          {/* </button> */}
          <div className="desc text-sm mobile:text-base font-normal !bgi-text-[var(--grayscale-00)]">
            <div className="desc-item">{t('earn_money_notice_1-1')}</div>
            <div className="desc-item">{t('earn_money_notice_1-2')}</div>
            <div className="desc-item">{t('earn_money_notice_1-3')}</div>
          </div>
        </div>
        <div className="bottom-item">
          <img src={getImgUrl(EResourceLevel.V, 'earn_coins')} alt="coins" />
          <div>
            <div className="desc !bgi-text-[var(--grayscale-00)]">
              {t('earn_money_notice_2-1')}
              <div
                className="desc-contact underline decoration-[#009D80]"
                onClick={() => {
                  handleInvitePageClick({
                    actionName: handleInvitePageContactNowClick,
                  });
                }}
              >
                <a className="bgi-text-[var(--base-1-main)]">
                  {t('earn_money_notice_contact')}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EarnShare;
